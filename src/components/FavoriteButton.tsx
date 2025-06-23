
import { useState, useEffect } from 'react';
import { FavoritesService } from '../services/FavoritesService';
import { useToast } from '../hooks/use-toast';

interface FavoriteButtonProps {
  videoId: string;
  videoTitle: string;
}

const FavoriteButton = ({ videoId, videoTitle }: FavoriteButtonProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsFavorite(FavoritesService.isFavorite(videoId));
  }, [videoId]);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const newFavoriteState = FavoritesService.toggleFavorite(videoId);
    setIsFavorite(newFavoriteState);
    
    toast({
      title: newFavoriteState ? "Adicionado aos favoritos!" : "Removido dos favoritos!",
      description: newFavoriteState 
        ? `"${videoTitle}" foi adicionado aos seus favoritos.`
        : `"${videoTitle}" foi removido dos seus favoritos.`,
    });
  };

  return (
    <button
      onClick={handleToggleFavorite}
      className={`w-full glass-card px-3 py-2 mt-2 rounded-lg smooth-transition hover-glow press-effect text-xs sm:text-sm font-medium ${
        isFavorite 
          ? 'bg-primary/20 text-primary border border-primary/30' 
          : 'text-foreground hover:bg-primary/10'
      }`}
    >
      💛 {isFavorite ? 'FAVORITADO' : 'ADICIONAR AOS FAVORITOS'}
    </button>
  );
};

export default FavoriteButton;
