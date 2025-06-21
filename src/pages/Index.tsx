
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import VideoCard from '../components/VideoCard';
import LoginModal from '../components/LoginModal';
import AddVideoModal from '../components/AddVideoModal';
import EmptyState from '../components/EmptyState';
import { VideoService } from '../services/VideoService';
import { Video } from '../types';

const Index = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const navigate = useNavigate();

  const loadVideos = () => {
    const loadedVideos = VideoService.getVideos();
    setVideos(loadedVideos);
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const handleVideoClick = (video: Video) => {
    // Open the drive link in a new tab
    window.open(video.url, '_blank');
  };

  const handleVideoAdded = () => {
    loadVideos();
  };

  return (
    <div className="min-h-screen pb-8">
      <TopBar 
        onAddClick={() => setIsAddModalOpen(true)}
        onLoginClick={() => setIsLoginModalOpen(true)}
      />
      
      <div className="px-4 mt-8">
        {videos.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onClick={handleVideoClick}
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
        onClose={() => setIsAddModalOpen(false)}
        onVideoAdded={handleVideoAdded}
      />
    </div>
  );
};

export default Index;
