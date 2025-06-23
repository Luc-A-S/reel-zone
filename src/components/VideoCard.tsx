
import { Video } from '../types';
import { Edit, Trash2, Play } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import { useIsMobile } from '../hooks/use-mobile';
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
  const isMobile = useIsMobile();

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
          
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 smooth-transition">
            <div className={`${isMobile ? 'w-12 h-12' : 'w-14 h-14 sm:w-16 sm:h-16'} rounded-full glass-card flex items-center justify-center`}>
              <Play className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5 sm:w-6 sm:h-6'} text-primary`} />
            </div>
          </div>
          
          {/* Action buttons */}
          {isAuthenticated && (
            <div className={`absolute ${isMobile ? 'top-2 right-2' : 'top-3 right-3 sm:top-4 sm:right-4'} flex gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 smooth-transition`}>
              <button
                onClick={handleEdit}
                className={`action-button glass-card ${isMobile ? 'p-1.5' : 'p-1.5 sm:p-2'} smooth-transition hover-glow press-effect rounded-md sm:rounded-lg`}
                aria-label="Edit video"
              >
                <Edit className={`${isMobile ? 'w-3 h-3' : 'w-3.5 h-3.5 sm:w-4 sm:h-4'} text-primary`} />
              </button>
              <button
                onClick={handleDeleteClick}
                className={`action-button glass-card ${isMobile ? 'p-1.5' : 'p-1.5 sm:p-2'} smooth-transition hover:bg-destructive/20 press-effect rounded-md sm:rounded-lg`}
                aria-label="Delete video"
              >
                <Trash2 className={`${isMobile ? 'w-3 h-3' : 'w-3.5 h-3.5 sm:w-4 sm:h-4'} text-destructive`} />
              </button>
            </div>
          )}

          {/* Video info overlay for mobile */}
          {isMobile && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2">
              <h3 className="text-white text-xs font-medium line-clamp-2 leading-tight">
                {video.title}
              </h3>
              {video.category === 'Série' && video.season && video.episode && (
                <p className="text-white/70 text-xs mt-1">
                  T{video.season} E{video.episode}
                </p>
              )}
            </div>
          )}
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
