
import { Play, Edit, Trash2 } from 'lucide-react';
import { Video } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import DeleteConfirmDialog from './DeleteConfirmDialog';

interface HeroSectionProps {
  video: Video;
  onPlay: (video: Video) => void;
  onEdit?: (video: Video) => void;
  onDelete?: (video: Video) => void;
}

const HeroSection = ({ video, onPlay, onEdit, onDelete }: HeroSectionProps) => {
  const { isAuthenticated } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handlePlay = () => {
    onPlay(video);
  };

  const handleEdit = () => {
    onEdit?.(video);
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    onDelete?.(video);
    setShowDeleteDialog(false);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <>
      <div className="relative w-full h-[70vh] min-h-[500px] max-h-[800px] overflow-hidden rounded-3xl mx-4 mt-6">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={video.cover}
            alt={video.title}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleImageLoad}
          />
          {!imageLoaded && (
            <div className="w-full h-full skeleton" />
          )}
        </div>

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="px-12 max-w-2xl">
            <div className="space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-neon-pulse" />
                <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                  Conteúdo em Destaque
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                {video.title}
              </h1>

              {/* Description */}
              <p className="text-gray-200 text-lg md:text-xl leading-relaxed max-w-xl">
                {video.description}
              </p>

              {/* Tags */}
              {video.tags.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {video.tags.slice(0, 4).map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 text-sm font-semibold bg-primary/20 text-primary rounded-full border border-primary/30 backdrop-blur-sm"
                    >
                      {tag}
                    </span>
                  ))}
                  {video.tags.length > 4 && (
                    <span className="px-4 py-2 text-sm font-semibold bg-muted/20 text-muted-foreground rounded-full border border-muted/30 backdrop-blur-sm">
                      +{video.tags.length - 4}
                    </span>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-4">
                <button
                  onClick={handlePlay}
                  className="flex items-center gap-3 bg-primary text-background px-8 py-4 rounded-xl font-bold text-lg smooth-transition hover:bg-primary/90 hover-glow press-effect"
                >
                  <Play className="w-6 h-6" />
                  Assistir Agora
                </button>

                {isAuthenticated && (
                  <div className="flex gap-3">
                    <button
                      onClick={handleEdit}
                      className="glass-card p-4 smooth-transition hover-glow press-effect rounded-xl"
                      aria-label="Editar conteúdo"
                    >
                      <Edit className="w-5 h-5 text-primary" />
                    </button>
                    <button
                      onClick={handleDeleteClick}
                      className="glass-card p-4 smooth-transition hover:bg-destructive/20 press-effect rounded-xl"
                      aria-label="Excluir conteúdo"
                    >
                      <Trash2 className="w-5 h-5 text-destructive" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        title={video.title}
      />
    </>
  );
};

export default HeroSection;
