
import { useState, useEffect } from 'react';
import { Play, Star, Settings, Trash2 } from 'lucide-react';
import { Video } from '../types';
import { VideoService } from '../services/VideoService';
import { useAuth } from '../hooks/useAuth';

interface FeaturedContentProps {
  onVideoClick: (video: Video) => void;
  onVideoEdit: (video: Video) => void;
  onFeaturedChange: () => void;
}

const FeaturedContent = ({ onVideoClick, onVideoEdit, onFeaturedChange }: FeaturedContentProps) => {
  const [featuredVideo, setFeaturedVideo] = useState<Video | null>(null);
  const [allVideos, setAllVideos] = useState<Video[]>([]);
  const [showVideoSelector, setShowVideoSelector] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadFeaturedVideo();
    loadAllVideos();
  }, []);

  const loadFeaturedVideo = () => {
    const featured = VideoService.getFeaturedVideo();
    setFeaturedVideo(featured);
  };

  const loadAllVideos = () => {
    const videos = VideoService.getVideos();
    setAllVideos(videos);
  };

  const handleSetFeatured = (video: Video) => {
    VideoService.setFeaturedVideo(video.id);
    setFeaturedVideo(video);
    setShowVideoSelector(false);
    onFeaturedChange();
  };

  const handleRemoveFeatured = () => {
    VideoService.removeFeaturedVideo();
    setFeaturedVideo(null);
    onFeaturedChange();
  };

  if (!featuredVideo && !isAuthenticated) {
    return null;
  }

  if (!featuredVideo && isAuthenticated) {
    return (
      <div className="relative mb-8">
        <div className="h-[300px] sm:h-[400px] lg:h-[500px] bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
              Adicionar Conteúdo em Destaque
            </h2>
            <p className="text-muted-foreground max-w-md">
              Selecione um vídeo para destacar na página inicial
            </p>
            <button
              onClick={() => setShowVideoSelector(true)}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold smooth-transition hover-glow"
            >
              Escolher Vídeo
            </button>
          </div>
        </div>

        {showVideoSelector && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowVideoSelector(false)} />
            
            <div className="glass-modal p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto animate-scale-in">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Selecionar Conteúdo em Destaque</h3>
                <button
                  onClick={() => setShowVideoSelector(false)}
                  className="glass-card p-2 smooth-transition hover-glow rounded-xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {allVideos.map((video) => (
                  <div
                    key={video.id}
                    onClick={() => handleSetFeatured(video)}
                    className="cursor-pointer glass-card p-3 rounded-xl smooth-transition hover-glow"
                  >
                    <img
                      src={video.cover}
                      alt={video.title}
                      className="w-full aspect-[2/3] object-cover rounded-lg mb-2"
                    />
                    <h4 className="font-medium text-sm truncate">{video.title}</h4>
                    <p className="text-xs text-muted-foreground">{video.category}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative mb-8">
      <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${featuredVideo.cover})` }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        
        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="px-6 sm:px-8 lg:px-12 max-w-2xl">
            <div className="space-y-2 sm:space-y-4 lg:space-y-6">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-accent fill-accent" />
                <span className="text-accent font-medium text-sm sm:text-base">
                  Conteúdo em Destaque
                </span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white leading-tight">
                {featuredVideo.title}
              </h1>
              
              <p className="text-gray-200 text-sm sm:text-base lg:text-lg line-clamp-3 max-w-lg">
                {featuredVideo.description}
              </p>
              
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <button
                  onClick={() => onVideoClick(featuredVideo)}
                  className="flex items-center gap-2 bg-white text-black px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold smooth-transition hover:bg-white/90 press-effect"
                >
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-black" />
                  Assistir
                </button>
                
                {isAuthenticated && (
                  <>
                    <button
                      onClick={() => onVideoEdit(featuredVideo)}
                      className="flex items-center gap-2 bg-gray-600/80 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold smooth-transition hover:bg-gray-600 press-effect"
                    >
                      <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                      Editar
                    </button>
                    
                    <button
                      onClick={() => setShowVideoSelector(true)}
                      className="flex items-center gap-2 bg-primary/80 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold smooth-transition hover:bg-primary press-effect"
                    >
                      Trocar
                    </button>
                    
                    <button
                      onClick={handleRemoveFeatured}
                      className="flex items-center gap-2 bg-red-600/80 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold smooth-transition hover:bg-red-600 press-effect"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      Remover
                    </button>
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <span className="px-3 py-1 bg-primary/80 rounded-full">
                  {featuredVideo.category}
                </span>
                <span>{featuredVideo.clicks} visualizações</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Selector Modal */}
      {showVideoSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowVideoSelector(false)} />
          
          <div className="glass-modal p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Trocar Conteúdo em Destaque</h3>
              <button
                onClick={() => setShowVideoSelector(false)}
                className="glass-card p-2 smooth-transition hover-glow rounded-xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {allVideos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => handleSetFeatured(video)}
                  className={`cursor-pointer glass-card p-3 rounded-xl smooth-transition hover-glow ${
                    video.id === featuredVideo?.id ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <img
                    src={video.cover}
                    alt={video.title}
                    className="w-full aspect-[2/3] object-cover rounded-lg mb-2"
                  />
                  <h4 className="font-medium text-sm truncate">{video.title}</h4>
                  <p className="text-xs text-muted-foreground">{video.category}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturedContent;
