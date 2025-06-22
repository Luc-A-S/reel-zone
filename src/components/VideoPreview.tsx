
import { useState } from 'react';
import { Play, Volume2, VolumeX } from 'lucide-react';

interface VideoPreviewProps {
  thumbnailUrl: string;
  title: string;
  isHovered: boolean;
}

const VideoPreview = ({ thumbnailUrl, title, isHovered }: VideoPreviewProps) => {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <img
        src={thumbnailUrl}
        alt={title}
        className={`w-full h-full object-cover transition-all duration-500 ${
          isHovered ? 'scale-110' : 'scale-100'
        }`}
      />
      
      {/* Overlay gradiente dinâmico */}
      <div className={`
        absolute inset-0 transition-all duration-300
        ${isHovered 
          ? 'bg-gradient-to-t from-black/90 via-black/20 to-transparent' 
          : 'bg-gradient-to-t from-black/60 via-black/10 to-transparent'
        }
      `} />
      
      {/* Botão de play animado */}
      <div className={`
        absolute inset-0 flex items-center justify-center transition-all duration-300
        ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
      `}>
        <div className="glass-card p-4 rounded-full animate-pulse">
          <Play className="w-8 h-8 text-primary fill-primary" />
        </div>
      </div>

      {/* Controles de volume */}
      {isHovered && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMuted(!isMuted);
          }}
          className="absolute top-4 right-4 glass-card p-2 rounded-lg smooth-transition hover-glow"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-white" />
          ) : (
            <Volume2 className="w-4 h-4 text-primary" />
          )}
        </button>
      )}
    </div>
  );
};

export default VideoPreview;
