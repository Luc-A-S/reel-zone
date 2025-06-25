
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Video } from '../types';
import { VideoService } from '../services/VideoService';
import { FavoritesService } from '../services/FavoritesService';
import VideoCard from './VideoCard';
import { useAuth } from '../hooks/useAuth';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoClick: (video: Video) => void;
  onVideoEdit?: (video: Video) => void;
  onVideoDelete?: (video: Video) => void;
}

const FavoritesModal = ({ 
  isOpen, 
  onClose, 
  onVideoClick, 
  onVideoEdit, 
  onVideoDelete 
}: FavoritesModalProps) => {
  const [favoriteVideos, setFavoriteVideos] = useState<Video[]>([]);
  const { isAdmin } = useAuth();

  const loadFavorites = () => {
    const favoriteIds = FavoritesService.getFavorites();
    const allVideos = VideoService.getVideos();
    const favorites = allVideos.filter(video => favoriteIds.includes(video.id));
    setFavoriteVideos(favorites);
  };

  useEffect(() => {
    if (isOpen) {
      loadFavorites();
    }
  }, [isOpen]);

  const handleVideoDelete = (video: Video) => {
    onVideoDelete?.(video);
    loadFavorites(); // Recarregar favoritos após deletar
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      
      <div className="relative glass-modal max-w-6xl w-full max-h-[90vh] overflow-hidden mx-4">
        <div className="sticky top-0 glass-card p-4 sm:p-6 border-b border-white/10 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
              <span className="neon-text">💛 Meus Favoritos</span>
            </h2>
            <button
              onClick={onClose}
              className="glass-card p-2 smooth-transition hover-glow press-effect rounded-lg"
              aria-label="Fechar favoritos"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {favoriteVideos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💛</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Nenhum favorito ainda
              </h3>
              <p className="text-muted-foreground">
                Adicione conteúdos aos favoritos para vê-los aqui
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 lg:gap-4 xl:gap-6">
              {favoriteVideos.map((video, index) => (
                <div
                  key={video.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <VideoCard
                    video={video}
                    onClick={onVideoClick}
                    onEdit={isAdmin ? onVideoEdit : undefined}
                    onDelete={isAdmin ? handleVideoDelete : undefined}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesModal;
