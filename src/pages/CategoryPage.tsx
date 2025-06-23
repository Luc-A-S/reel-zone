
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import TopBar from '../components/TopBar';
import VideoCard from '../components/VideoCard';
import LoginModal from '../components/LoginModal';
import StepFormModal from '../components/StepFormModal';
import VideoViewModal from '../components/VideoViewModal';
import { VideoService } from '../services/VideoService';
import { Video } from '../types';
import { useToast } from '../hooks/use-toast';
import { useIsMobile } from '../hooks/use-mobile';

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const categoryName = category === 'Filme' ? 'Filmes' : 
                      category === 'Serie' ? 'Séries' : 
                      category === 'Documentario' ? 'Documentários' : 'Todos';

  const loadVideos = () => {
    let loadedVideos: Video[] = [];
    
    if (category === 'Filme') {
      loadedVideos = VideoService.getVideosByCategory('Filme');
    } else if (category === 'Serie') {
      loadedVideos = VideoService.getVideosByCategory('Série');
    } else if (category === 'Documentario') {
      loadedVideos = VideoService.getVideosByCategory('Documentário');
    } else {
      loadedVideos = VideoService.getVideos();
    }

    // Aplicar busca se houver termo
    if (searchTerm.trim()) {
      loadedVideos = loadedVideos.filter(video => 
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Ordenar por data de criação (mais recentes primeiro)
    loadedVideos.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    setVideos(loadedVideos);
  };

  useEffect(() => {
    loadVideos();
  }, [category, searchTerm]);

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

  return (
    <div className="min-h-screen pb-4 sm:pb-6 md:pb-8 lg:pb-12">
      <TopBar 
        onAddClick={() => setIsAddModalOpen(true)}
        onLoginClick={() => setIsLoginModalOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      
      <div className="px-2 sm:px-3 md:px-4 lg:px-6 mt-3 sm:mt-4 md:mt-6 lg:mt-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6 lg:mb-8">
            <button
              onClick={() => navigate('/')}
              className="glass-card p-1.5 sm:p-2 md:p-3 smooth-transition hover-glow press-effect rounded-lg sm:rounded-xl"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </button>
            <h1 className={`${isMobile ? 'text-lg' : 'text-xl sm:text-2xl md:text-3xl lg:text-4xl'} font-bold`}>
              <span className="neon-text">{categoryName}</span>
            </h1>
          </div>

          {videos.length === 0 ? (
            <div className="text-center py-6 sm:py-8 md:py-12">
              <p className="text-muted-foreground text-sm sm:text-base md:text-lg px-4">
                Nenhum conteúdo encontrado {searchTerm && `para "${searchTerm}"`}
              </p>
            </div>
          ) : (
            <div className={`grid ${isMobile ? 'grid-cols-2 gap-2' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4 lg:gap-6'}`}>
              {videos.map((video, index) => (
                <div
                  key={video.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
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
          )}
        </div>
      </div>

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
    </div>
  );
};

export default CategoryPage;
