import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import VideoCard from '../components/VideoCard';
import LoginModal from '../components/LoginModal';
import StepFormModal from '../components/StepFormModal';
import EmptyState from '../components/EmptyState';
import VideoViewModal from '../components/VideoViewModal';
import PWAInstallPrompt from '../components/PWAInstallPrompt';
import FloatingFavoritesButton from '../components/FloatingFavoritesButton';
import FavoritesModal from '../components/FavoritesModal';
import FeaturedContent from '../components/FeaturedContent';
import { VideoService } from '../services/VideoService';
import { Video } from '../types';
import { useToast } from '../hooks/use-toast';

const Index = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [featuredVideo, setFeaturedVideo] = useState<Video | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadVideos = () => {
    console.log('Carregando vídeos...');
    const loadedVideos = VideoService.getVideos();
    
    console.log('Vídeos carregados:', loadedVideos.length);
    
    setVideos(loadedVideos);
    applyFiltersAndSort(loadedVideos, searchTerm);
    
    // Load featured video
    const featured = VideoService.getFeaturedVideo();
    setFeaturedVideo(featured);
  };

  const applyFiltersAndSort = (videoList: Video[], search: string) => {
    let filtered = videoList;

    // Aplicar busca
    if (search.trim()) {
      filtered = VideoService.searchVideos(search);
    }

    // Ordenar por data de criação (mais recentes primeiro)
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    setFilteredVideos(filtered);
  };

  useEffect(() => {
    loadVideos();
  }, []);

  useEffect(() => {
    applyFiltersAndSort(videos, searchTerm);
  }, [searchTerm, videos]);

  const handleVideoClick = (video: Video) => {
    VideoService.incrementClicks(video.id);
    setSelectedVideo(video);
  };

  const handleVideoAdded = () => {
    loadVideos();
    toast({
      title: "Sucesso!",
      description: "Conteúdo publicado com sucesso!",
    });
  };

  const handleVideoUpdated = () => {
    loadVideos();
    setEditingVideo(null);
    toast({
      title: "Sucesso!",
      description: "Conteúdo atualizado com sucesso!",
    });
  };

  const handleEditVideo = (video: Video) => {
    setEditingVideo(video);
    setIsAddModalOpen(true);
  };

  const handleDeleteVideo = (video: Video) => {
    if (VideoService.deleteVideo(video.id)) {
      loadVideos();
      toast({
        title: "Sucesso!",
        description: "Conteúdo excluído com sucesso!",
      });
    }
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setEditingVideo(null);
  };

  // Organizar vídeos por categoria
  const filmeVideos = filteredVideos.filter(v => v.category === 'Filme').slice(0, 5);
  const serieVideos = filteredVideos.filter(v => v.category === 'Série').slice(0, 5);
  const documentarioVideos = filteredVideos.filter(v => v.category === 'Documentário').slice(0, 5);

  return (
    <div className="min-h-screen pb-24 sm:pb-28">
      <TopBar 
        onAddClick={() => setIsAddModalOpen(true)}
        onLoginClick={() => setIsLoginModalOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      
      {/* Featured Content Section */}
      <div className="px-3 sm:px-4 lg:px-6 mt-4 sm:mt-8">
        <FeaturedContent 
          video={featuredVideo}
          onVideoClick={handleVideoClick}
          onEdit={handleEditVideo}
        />
      </div>
      
      <div className="px-3 sm:px-4 lg:px-6">
        {filteredVideos.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 lg:space-y-12">
            {/* Filmes */}
            {filmeVideos.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                    <span className="neon-text">Filmes</span>
                  </h2>
                  <button 
                    onClick={() => navigate('/category/Filme')}
                    className="text-accent hover:text-accent/80 font-medium text-xs sm:text-sm lg:text-base smooth-transition"
                  >
                    Ver tudo
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 lg:gap-4 xl:gap-6">
                  {filmeVideos.map((video, index) => (
                    <div
                      key={video.id}
                      className="animate-fade-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <VideoCard
                        video={video}
                        onClick={handleVideoClick}
                        onEdit={handleEditVideo}
                        onDelete={handleDeleteVideo}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Séries */}
            {serieVideos.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                    <span className="neon-text">Séries</span>
                  </h2>
                  <button 
                    onClick={() => navigate('/category/Serie')}
                    className="text-accent hover:text-accent/80 font-medium text-xs sm:text-sm lg:text-base smooth-transition"
                  >
                    Ver tudo
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 lg:gap-4 xl:gap-6">
                  {serieVideos.map((video, index) => (
                    <div
                      key={video.id}
                      className="animate-fade-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <VideoCard
                        video={video}
                        onClick={handleVideoClick}
                        onEdit={handleEditVideo}
                        onDelete={handleDeleteVideo}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Documentários */}
            {documentarioVideos.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                    <span className="neon-text">Documentários</span>
                  </h2>
                  <button 
                    onClick={() => navigate('/category/Documentario')}
                    className="text-accent hover:text-accent/80 font-medium text-xs sm:text-sm lg:text-base smooth-transition"
                  >
                    Ver tudo
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 lg:gap-4 xl:gap-6">
                  {documentarioVideos.map((video, index) => (
                    <div
                      key={video.id}
                      className="animate-fade-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <VideoCard
                        video={video}
                        onClick={handleVideoClick}
                        onEdit={handleEditVideo}
                        onDelete={handleDeleteVideo}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <FloatingFavoritesButton onClick={() => setIsFavoritesModalOpen(true)} />

      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
      
      <StepFormModal
        isOpen={isAddModalOpen}
        onClose={handleModalClose}
        onVideoAdded={handleVideoAdded}
        onVideoUpdated={handleVideoUpdated}
        editingVideo={editingVideo}
      />

      <VideoViewModal
        video={selectedVideo}
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />

      <FavoritesModal
        isOpen={isFavoritesModalOpen}
        onClose={() => setIsFavoritesModalOpen(false)}
        onVideoClick={handleVideoClick}
        onVideoEdit={handleEditVideo}
        onVideoDelete={handleDeleteVideo}
      />

      <PWAInstallPrompt />
    </div>
  );
};

export default Index;
