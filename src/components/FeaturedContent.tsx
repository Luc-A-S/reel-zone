
import { useState } from 'react';
import { Video } from '../types';
import { Play, Info } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useIsMobile } from '../hooks/use-mobile';

interface FeaturedContentProps {
  video: Video | null;
  onVideoClick: (video: Video) => void;
  onEdit?: (video: Video) => void;
}

const FeaturedContent = ({ video, onVideoClick, onEdit }: FeaturedContentProps) => {
  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();

  if (!video) {
    return (
      <div className="relative w-full h-[40vh] sm:h-[50vh] lg:h-[60vh] bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center mb-8">
        <div className="text-center p-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            <span className="neon-text">Conteúdo em Destaque</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-md mx-auto">
            Nenhum conteúdo destacado no momento. Adicione um novo conteúdo para aparecer aqui.
          </p>
        </div>
      </div>
    );
  }

  const handlePlayClick = () => {
    onVideoClick(video);
  };

  const handleEditClick = () => {
    onEdit?.(video);
  };

  return (
    <div className="relative w-full h-[40vh] sm:h-[50vh] lg:h-[60vh] mb-8 overflow-hidden rounded-lg">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${video.cover})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg lg:max-w-xl">
          <div className="mb-2">
            <span className="inline-block px-3 py-1 bg-primary/80 text-white text-xs sm:text-sm font-medium rounded-full">
              {video.category}
            </span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 sm:mb-4 line-clamp-2">
            {video.title}
          </h1>
          
          {video.description && (
            <p className="text-white/90 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 line-clamp-3">
              {video.description}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={handlePlayClick}
              className="flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-white/90 smooth-transition press-effect"
            >
              <Play className="w-5 h-5" fill="currentColor" />
              <span>Assistir</span>
            </button>
            
            <button
              onClick={handlePlayClick}
              className="flex items-center justify-center gap-2 bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 smooth-transition press-effect"
            >
              <Info className="w-5 h-5" />
              <span>Mais informações</span>
            </button>

            {isAuthenticated && (
              <button
                onClick={handleEditClick}
                className="flex items-center justify-center gap-2 bg-primary/80 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary smooth-transition press-effect"
              >
                <span>Editar Destaque</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile overlay for better readability */}
      {isMobile && (
        <div className="absolute inset-0 bg-black/30 pointer-events-none" />
      )}
    </div>
  );
};

export default FeaturedContent;
