
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import VideoCard from '../components/VideoCard';
import LoginModal from '../components/LoginModal';
import AddVideoModal from '../components/AddVideoModal';
import EmptyState from '../components/EmptyState';
import { VideoService } from '../services/VideoService';
import { Video } from '../types';
import { useToast } from '../hooks/use-toast';

const Index = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSort, setCurrentSort] = useState('createdAt');
  const [currentOrder, setCurrentOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadVideos = () => {
    const loadedVideos = VideoService.getVideos();
    setVideos(loadedVideos);
    applyFiltersAndSort(loadedVideos, searchTerm, currentSort, currentOrder);
  };

  const applyFiltersAndSort = (videoList: Video[], search: string, sortBy: string, order: 'asc' | 'desc') => {
    let filtered = videoList;

    // Aplicar busca
    if (search.trim()) {
      filtered = VideoService.searchVideos(search);
    }

    // Aplicar ordenação
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Video];
      let bValue: any = b[sortBy as keyof Video];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (order === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredVideos(filtered);
  };

  useEffect(() => {
    loadVideos();
  }, []);

  useEffect(() => {
    applyFiltersAndSort(videos, searchTerm, currentSort, currentOrder);
  }, [searchTerm, videos, currentSort, currentOrder]);

  const handleVideoClick = (video: Video) => {
    window.open(video.url, '_blank');
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
    if (window.confirm(`Tem certeza que deseja excluir "${video.title}"?`)) {
      if (VideoService.deleteVideo(video.id)) {
        loadVideos();
        toast({
          title: "Sucesso!",
          description: "Conteúdo excluído com sucesso!",
        });
      }
    }
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleSortChange = (sortBy: string) => {
    setCurrentSort(sortBy);
  };

  const handleOrderChange = (order: 'asc' | 'desc') => {
    setCurrentOrder(order);
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setEditingVideo(null);
  };

  return (
    <div className="min-h-screen pb-12">
      <TopBar 
        onAddClick={() => setIsAddModalOpen(true)}
        onLoginClick={() => setIsLoginModalOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        onOrderChange={handleOrderChange}
        currentSort={currentSort}
        currentOrder={currentOrder}
      />
      
      <div className="px-6 mt-12">
        {filteredVideos.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="max-w-7xl mx-auto mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Conteúdo em <span className="neon-text">Destaque</span>
              </h2>
              <p className="text-muted-foreground font-medium">
                Descubra conteúdos incríveis selecionados especialmente para você
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {filteredVideos.map((video, index) => (
                <div
                  key={video.id}
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
          </>
        )}
      </div>

      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
      
      <AddVideoModal
        isOpen={isAddModalOpen}
        onClose={handleModalClose}
        onVideoAdded={handleVideoAdded}
        onVideoUpdated={handleVideoUpdated}
        editingVideo={editingVideo}
      />
    </div>
  );
};

export default Index;
