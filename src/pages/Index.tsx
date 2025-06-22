
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
      title: "Success!",
      description: "Content published successfully!",
    });
  };

  const handleVideoUpdated = () => {
    loadVideos();
    setEditingVideo(null);
    toast({
      title: "Success!",
      description: "Content updated successfully!",
    });
  };

  const handleEditVideo = (video: Video) => {
    setEditingVideo(video);
    setIsAddModalOpen(true);
  };

  const handleDeleteVideo = (video: Video) => {
    if (window.confirm(`Are you sure you want to delete "${video.title}"?`)) {
      if (VideoService.deleteVideo(video.id)) {
        loadVideos();
        toast({
          title: "Success!",
          description: "Content deleted successfully!",
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
    <div className="min-h-screen pb-12">
      <TopBar 
        onAddClick={() => setIsAddModalOpen(true)}
        onLoginClick={() => setIsLoginModalOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />
      
      <div className="px-6 mt-12">
        {filteredVideos.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="max-w-7xl mx-auto mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Featured <span className="neon-text">Content</span>
              </h2>
              <p className="text-muted-foreground font-medium">
                Discover amazing content curated just for you
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
