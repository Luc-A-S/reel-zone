import { useState, useEffect } from 'react';
import { Video } from '../types';
import { VideoService } from '../services/VideoService';
import TopBar from '../components/TopBar';
import VideoCard from '../components/VideoCard';
import VideoViewModal from '../components/VideoViewModal';
import AddVideoModal from '../components/AddVideoModal';
import StepFormModal from '../components/StepFormModal';
import LoginModal from '../components/LoginModal';
import UserAuthModal from '../components/UserAuthModal';
import FeaturedContent from '../components/FeaturedContent';
import FilterControls from '../components/FilterControls';
import EmptyState from '../components/EmptyState';
import FloatingFavoritesButton from '../components/FloatingFavoritesButton';
import PWAInstallPrompt from '../components/PWAInstallPrompt';

const Index = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStepForm, setShowStepForm] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserAuthModal, setShowUserAuthModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'Todos' | 'Filme' | 'Série' | 'Documentário'>('Todos');
  const [selectedTag, setSelectedTag] = useState<string>('');

  useEffect(() => {
    console.log('Carregando vídeos...');
    loadVideos();
  }, []);

  useEffect(() => {
    filterVideos();
  }, [videos, searchTerm, selectedCategory, selectedTag]);

  const loadVideos = () => {
    const loadedVideos = VideoService.getVideos();
    console.log('Vídeos carregados:', loadedVideos.length);
    setVideos(loadedVideos);
  };

  const filterVideos = () => {
    let filtered = videos;

    if (searchTerm) {
      filtered = VideoService.searchVideos(searchTerm);
    }

    if (selectedCategory !== 'Todos') {
      filtered = filtered.filter(video => video.category === selectedCategory);
    }

    if (selectedTag) {
      filtered = filtered.filter(video => 
        video.tags.some(tag => tag.toLowerCase().includes(selectedTag.toLowerCase()))
      );
    }

    setFilteredVideos(filtered);
  };

  const handleVideoClick = (video: Video) => {
    VideoService.incrementClicks(video.id);
    setSelectedVideo(video);
    setShowVideoModal(true);
    loadVideos();
  };

  const handleVideoEdit = (video: Video) => {
    setEditingVideo(video);
    setShowStepForm(true);
  };

  const handleAddVideo = () => {
    setEditingVideo(null);
    setShowAddModal(true);
  };

  const handleStepFormVideo = () => {
    setEditingVideo(null);
    setShowStepForm(true);
  };

  const handleVideoSaved = () => {
    loadVideos();
    setShowAddModal(false);
    setShowStepForm(false);
    setEditingVideo(null);
  };

  const handleFeaturedChange = () => {
    loadVideos();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('Todos');
    setSelectedTag('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <TopBar 
        onAddClick={handleAddVideo}
        onLoginClick={() => setShowLoginModal(true)}
        onUserAuthClick={() => setShowUserAuthModal(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      
      <div className="px-2 sm:px-4 md:px-6 lg:px-8 pb-8">
        <FeaturedContent 
          onVideoClick={handleVideoClick}
          onVideoEdit={handleVideoEdit}
          onFeaturedChange={handleFeaturedChange}
        />
        
        <FilterControls
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedTag={selectedTag}
          onTagChange={setSelectedTag}
          onClearFilters={handleClearFilters}
          videos={videos}
        />

        {filteredVideos.length === 0 ? (
          <EmptyState 
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            selectedTag={selectedTag}
            onAddVideo={handleStepFormVideo}
            onClearFilters={handleClearFilters}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
            {filteredVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onClick={() => handleVideoClick(video)}
                onEdit={() => handleVideoEdit(video)}
              />
            ))}
          </div>
        )}
      </div>

      <FloatingFavoritesButton />
      <PWAInstallPrompt />

      {/* Modals */}
      <VideoViewModal
        video={selectedVideo}
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
      />

      <AddVideoModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onVideoSaved={handleVideoSaved}
        editingVideo={editingVideo}
      />

      <StepFormModal
        isOpen={showStepForm}
        onClose={() => setShowStepForm(false)}
        onVideoSaved={handleVideoSaved}
        editingVideo={editingVideo}
      />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      <UserAuthModal
        isOpen={showUserAuthModal}
        onClose={() => setShowUserAuthModal(false)}
      />
    </div>
  );
};

export default Index;
