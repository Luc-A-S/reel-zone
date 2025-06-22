
import { useState } from 'react';
import { Play, Plus, Edit, Trash2 } from 'lucide-react';
import { Video } from '../types';
import { useAuth } from '../hooks/useAuth';
import DeleteConfirmDialog from './DeleteConfirmDialog';

interface HeroSectionProps {
  featuredVideo?: Video | null;
  onPlay: (video: Video) => void;
  onEdit?: (video: Video) => void;
  onDelete?: (video: Video) => void;
  onAddFeatured?: () => void;
}

const HeroSection = ({ featuredVideo, onPlay, onEdit, onDelete, onAddFeatured }: HeroSectionProps) => {
  const { isAuthenticated } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (featuredVideo && onDelete) {
      onDelete(featuredVideo);
    }
    setShowDeleteDialog(false);
  };

  // Se não há vídeo em destaque e o usuário está logado, mostra opção para adicionar
  if (!featuredVideo && isAuthenticated) {
    return (
      <div className="relative h-[70vh] min-h-[500px] mb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-6 max-w-2xl px-6">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
              Destaque <span className="neon-text">Principal</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Adicione um conteúdo especial para aparecer em destaque no início da página
            </p>
            <button
              onClick={onAddFeatured}
              className="glass-card px-8 py-4 text-lg font-semibold smooth-transition hover-glow press-effect rounded-2xl inline-flex items-center gap-3"
            >
              <Plus className="w-6 h-6 text-primary" />
              Adicionar Conteúdo em Destaque
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Se não há vídeo em destaque e usuário não está logado, não mostra nada
  if (!featuredVideo) {
    return null;
  }

  return (
    <>
      <div className="relative h-[70vh] min-h-[500px] mb-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={featuredVideo.cover}
            alt={featuredVideo.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative h-full flex items-center px-6 md:px-12">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              {featuredVideo.title}
            </h1>
            
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed line-clamp-3">
              {featuredVideo.description}
            </p>

            {/* Tags */}
            {featuredVideo.tags.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {featuredVideo.tags.slice(0, 4).map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 text-sm font-semibold bg-white/20 text-white rounded-full backdrop-blur-sm border border-white/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-4">
              <button
                onClick={() => onPlay(featuredVideo)}
                className="bg-white text-black px-8 py-4 rounded-xl font-bold text-lg smooth-transition hover:bg-gray-200 press-effect inline-flex items-center gap-3"
              >
                <Play className="w-6 h-6 fill-current" />
                Assistir
              </button>

              {/* Admin Actions */}
              {isAuthenticated && (
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => onEdit && onEdit(featuredVideo)}
                    className="glass-card p-3 smooth-transition hover-glow press-effect rounded-xl"
                    aria-label="Editar conteúdo em destaque"
                  >
                    <Edit className="w-5 h-5 text-primary" />
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    className="glass-card p-3 smooth-transition hover:bg-destructive/20 press-effect rounded-xl"
                    aria-label="Remover conteúdo em destaque"
                  >
                    <Trash2 className="w-5 h-5 text-destructive" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        title={featuredVideo.title}
      />
    </>
  );
};

export default HeroSection;
