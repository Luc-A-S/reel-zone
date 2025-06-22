
import { Video } from '../types';
import { Edit, Trash2, Play } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import DeleteConfirmDialog from './DeleteConfirmDialog';

interface VideoCardProps {
  video: Video;
  onClick: (video: Video) => void;
  onEdit?: (video: Video) => void;
  onDelete?: (video: Video) => void;
}

const VideoCard = ({ video, onClick, onEdit, onDelete }: VideoCardProps) => {
  const { isAuthenticated } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.action-button')) {
      return;
    }
    onClick(video);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(video);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    onDelete?.(video);
    setShowDeleteDialog(false);
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.classList.remove('skeleton');
  };

  return (
    <>
      <div 
        className="glass-card overflow-hidden cursor-pointer smooth-transition hover:scale-[1.02] hover-glow press-effect animate-fade-up group"
        onClick={handleClick}
        style={{ aspectRatio: '1080/1350' }}
      >
        <div className="relative h-full">
          <img
            src={video.cover}
            alt={video.title}
            className="w-full h-full object-cover skeleton"
            onLoad={handleImageLoad}
          />
          
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 smooth-transition">
            <div className="w-16 h-16 rounded-full glass-card flex items-center justify-center">
              <Play className="w-6 h-6 text-primary" />
            </div>
          </div>
          
          {/* Action buttons */}
          {isAuthenticated && (
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 smooth-transition">
              <button
                onClick={handleEdit}
                className="action-button glass-card p-2 smooth-transition hover-glow press-effect rounded-lg"
                aria-label="Edit video"
              >
                <Edit className="w-4 h-4 text-primary" />
              </button>
              <button
                onClick={handleDeleteClick}
                className="action-button glass-card p-2 smooth-transition hover:bg-destructive/20 press-effect rounded-lg"
                aria-label="Delete video"
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </button>
            </div>
          )}
          
          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="glass-card rounded-2xl p-4 space-y-3">
              <h3 className="font-bold text-white text-lg leading-tight line-clamp-2">
                {video.title}
              </h3>
              
              {video.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {video.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-xs font-semibold bg-primary/20 text-primary rounded-full border border-primary/30"
                    >
                      {tag}
                    </span>
                  ))}
                  {video.tags.length > 3 && (
                    <span className="px-3 py-1 text-xs font-semibold bg-muted/20 text-muted-foreground rounded-full border border-muted/30">
                      +{video.tags.length - 3}
                    </span>
                  )}
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
        title={video.title}
      />
    </>
  );
};

export default VideoCard;
