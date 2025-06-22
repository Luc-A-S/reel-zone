
import { useState } from 'react';
import { Video } from '../types';
import { Edit, Trash2, Play, Clock, Eye, Heart } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import VideoPreview from './VideoPreview';
import CategoryBadge from './CategoryBadge';

interface VideoCardProps {
  video: Video;
  onClick: (video: Video) => void;
  onEdit?: (video: Video) => void;
  onDelete?: (video: Video) => void;
  viewMode?: 'grid' | 'list';
}

const VideoCard = ({ video, onClick, onEdit, onDelete, viewMode = 'grid' }: VideoCardProps) => {
  const { isAuthenticated } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

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

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(video);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  if (viewMode === 'list') {
    return (
      <div 
        className="glass-card overflow-hidden cursor-pointer smooth-transition hover:scale-[1.01] hover-glow press-effect animate-fade-up group p-4"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex gap-4">
          <div className="relative w-32 h-20 flex-shrink-0">
            <VideoPreview 
              thumbnailUrl={video.cover}
              title={video.title}
              isHovered={isHovered}
            />
          </div>
          
          <div className="flex-1 space-y-2">
            <h3 className="font-bold text-white text-lg line-clamp-1">
              {video.title}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2">
              {video.description}
            </p>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>5:30</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>1.2k visualizações</span>
              </div>
            </div>
            
            {video.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {video.tags.slice(0, 3).map((tag, index) => (
                  <CategoryBadge key={index} category={tag} size="sm" />
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-start gap-2">
            <button
              onClick={handleFavorite}
              className={`action-button glass-card p-2 smooth-transition press-effect rounded-lg ${
                isFavorited ? 'text-red-500 hover:bg-red-500/20' : 'text-muted-foreground hover:text-red-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
            
            {isAuthenticated && (
              <>
                <button
                  onClick={handleEdit}
                  className="action-button glass-card p-2 smooth-transition hover-glow press-effect rounded-lg"
                >
                  <Edit className="w-4 h-4 text-primary" />
                </button>
                <button
                  onClick={handleDelete}
                  className="action-button glass-card p-2 smooth-transition hover:bg-destructive/20 press-effect rounded-lg"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="glass-card overflow-hidden cursor-pointer smooth-transition hover:scale-[1.02] hover-glow press-effect animate-fade-up group"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ aspectRatio: '1080/1350' }}
    >
      <div className="relative h-full">
        <VideoPreview 
          thumbnailUrl={video.cover}
          title={video.title}
          isHovered={isHovered}
        />
        
        {/* Badge de duração */}
        <div className="absolute top-4 left-4 glass-card px-2 py-1 rounded-lg">
          <div className="flex items-center gap-1 text-xs text-white font-medium">
            <Clock className="w-3 h-3" />
            <span>5:30</span>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 smooth-transition">
          <button
            onClick={handleFavorite}
            className={`action-button glass-card p-2 smooth-transition press-effect rounded-lg ${
              isFavorited ? 'text-red-500 hover:bg-red-500/20' : 'text-white hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
          
          {isAuthenticated && (
            <>
              <button
                onClick={handleEdit}
                className="action-button glass-card p-2 smooth-transition hover-glow press-effect rounded-lg"
              >
                <Edit className="w-4 h-4 text-primary" />
              </button>
              <button
                onClick={handleDelete}
                className="action-button glass-card p-2 smooth-transition hover:bg-destructive/20 press-effect rounded-lg"
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </button>
            </>
          )}
        </div>
        
        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="glass-card rounded-2xl p-4 space-y-3">
            <h3 className="font-bold text-white text-lg leading-tight line-clamp-2">
              {video.title}
            </h3>
            
            <div className="flex items-center gap-4 text-xs text-white/70">
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>1.2k</span>
              </div>
              <div className="flex items-center gap-1">
                <Play className="w-3 h-3" />
                <span>Assistir</span>
              </div>
            </div>
            
            {video.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {video.tags.slice(0, 2).map((tag, index) => (
                  <CategoryBadge key={index} category={tag} size="sm" />
                ))}
                {video.tags.length > 2 && (
                  <span className="px-2 py-1 text-xs font-semibold bg-muted/20 text-muted-foreground rounded-full border border-muted/30">
                    +{video.tags.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
