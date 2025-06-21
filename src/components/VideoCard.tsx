
import { Video } from '../types';

interface VideoCardProps {
  video: Video;
  onClick: (video: Video) => void;
}

const VideoCard = ({ video, onClick }: VideoCardProps) => {
  const handleClick = () => {
    onClick(video);
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.classList.remove('skeleton');
  };

  return (
    <div 
      className="glass-card overflow-hidden cursor-pointer smooth-transition hover-glow press-effect animate-fade-up"
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
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="glass rounded-xl p-3 space-y-2">
            <h3 className="font-semibold text-white text-lg leading-tight line-clamp-2">
              {video.title}
            </h3>
            
            {video.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {video.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs font-medium bg-primary/20 text-primary rounded-full backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
                {video.tags.length > 3 && (
                  <span className="px-2 py-1 text-xs font-medium bg-muted/20 text-muted-foreground rounded-full backdrop-blur-sm">
                    +{video.tags.length - 3}
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
