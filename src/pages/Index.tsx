
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
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadVideos = () => {
    const loadedVideos = VideoService.getVideos();
    setVideos(loadedVideos);
    setFilteredVideos(loadedVideos);
  };

  useEffect(() => {
    loadVideos();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = VideoService.searchVideos(searchTerm);
      setFilteredVideos(filtered);
    } else {
      setFilteredVideos(videos);
    }
  }, [searchTerm, videos]);

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

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setEditingVideo(null);
  };

  return (
    <div className="min-h-screen pb-8">
      <TopBar 
        onAddClick={() => setIsAddModalOpen(true)}
        onLoginClick={() => setIsLoginModalOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />
      
      <div className="px-4 mt-8">
        {filteredVideos.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {filteredVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onClick={handleVideoClick}
                onEdit={handleEditVideo}
                onDelete={handleDeleteVideo}
              />
            ))}
          </div>
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
