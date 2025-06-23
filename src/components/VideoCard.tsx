
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
            <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16'} rounded-full glass-card flex items-center justify-center`}>
              <Play className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6'} text-primary`} />
            </div>
          </div>
          
          {/* Action buttons */}
          {isAuthenticated && (
            <div className={`absolute ${isMobile ? 'top-1 right-1' : 'top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4'} flex gap-1 opacity-0 group-hover:opacity-100 smooth-transition`}>
              <button
                onClick={handleEdit}
                className={`action-button glass-card ${isMobile ? 'p-1' : 'p-1.5 sm:p-2'} smooth-transition hover-glow press-effect rounded-md`}
                aria-label="Edit video"
              >
                <Edit className={`${isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4'} text-primary`} />
              </button>
              <button
                onClick={handleDeleteClick}
                className={`action-button glass-card ${isMobile ? 'p-1' : 'p-1.5 sm:p-2'} smooth-transition hover:bg-destructive/20 press-effect rounded-md`}
                aria-label="Delete video"
              >
                <Trash2 className={`${isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4'} text-destructive`} />
              </button>
            </div>
          )}

          {/* Video info overlay for mobile */}
          {isMobile && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-1.5">
              <h3 className="text-white text-xs font-medium line-clamp-2 leading-tight">
                {video.title}
              </h3>
              {video.category === 'Série' && video.season && video.episode && (
                <p className="text-white/70 text-xs mt-0.5">
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
