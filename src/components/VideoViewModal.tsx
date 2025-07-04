
import { useState, useEffect } from 'react';
import { X, Play, Calendar, Tag, Star } from 'lucide-react';
import { Video, Episode } from '../types';
import { VideoService } from '../services/VideoService';

interface VideoViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: Video | null;
}

const VideoViewModal = ({ isOpen, onClose, video }: VideoViewModalProps) => {
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [selectedSeason, setSelectedSeason] = useState(1);

  useEffect(() => {
    if (video && video.category === 'Série' && video.episodes) {
      // Definir primeiro episódio da primeira temporada como padrão
      const firstEpisode = video.episodes.find(ep => ep.season === 1 && ep.episode === 1);
      setCurrentEpisode(firstEpisode || video.episodes[0]);
      setSelectedSeason(1);
    }
  }, [video]);

  useEffect(() => {
    if (video && isOpen) {
      // Incrementar contador de cliques
      VideoService.incrementClicks(video.id);
    }
  }, [video, isOpen]);

  if (!isOpen || !video) return null;

  const getEmbedUrl = (url: string) => {
    // Google Drive
    if (url.includes('drive.google.com')) {
      const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (fileIdMatch) {
        return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
      }
    }
    
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    
    // Retorna a URL original se não for reconhecida
    return url;
  };

  const currentContent = video.category === 'Série' && currentEpisode ? currentEpisode : video;
  const embedUrl = getEmbedUrl(currentContent.url);

  const seasons = video.category === 'Série' && video.episodes 
    ? [...new Set(video.episodes.map(ep => ep.season))].sort((a, b) => a - b)
    : [];

  const episodes = video.category === 'Série' && video.episodes
    ? video.episodes.filter(ep => ep.season === selectedSeason).sort((a, b) => a.episode - b.episode)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="glass-modal p-4 sm:p-6 w-full max-w-6xl max-h-[95vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold truncate pr-4">{video.title}</h2>
          <button 
            onClick={onClose}
            className="glass-card p-2 smooth-transition hover-glow rounded-xl flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Player */}
          <div className="lg:col-span-2">
            <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4">
              <iframe
                src={embedUrl}
                title={currentContent.title}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="space-y-3">
              <h3 className="text-lg sm:text-xl font-semibold">
                {video.category === 'Série' && currentEpisode 
                  ? `T${currentEpisode.season}E${currentEpisode.episode} - ${currentEpisode.title}`
                  : video.title
                }
              </h3>
              
              <p className="text-muted-foreground text-sm sm:text-base">
                {video.category === 'Série' && currentEpisode 
                  ? currentEpisode.description
                  : video.description
                }
              </p>

              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs sm:text-sm font-medium">
                  {video.category}
                </span>
                {video.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-muted/20 text-muted-foreground rounded-full text-xs sm:text-sm"
                  >
                    <Tag className="w-3 h-3 inline mr-1" />
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(video.created_at).toLocaleDateString('pt-BR')}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  {video.clicks} visualizações
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <img
              src={currentContent.cover}
              alt={currentContent.title}
              className="w-full aspect-[2/3] object-cover rounded-xl"
            />

            {/* Seleção de Temporada e Episódios (apenas para séries) */}
            {video.category === 'Série' && seasons.length > 0 && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Temporada</label>
                  <select
                    value={selectedSeason}
                    onChange={(e) => {
                      const newSeason = Number(e.target.value);
                      setSelectedSeason(newSeason);
                      // Selecionar primeiro episódio da nova temporada
                      const firstEpisodeOfSeason = video.episodes?.find(ep => ep.season === newSeason && ep.episode === 1);
                      if (firstEpisodeOfSeason) {
                        setCurrentEpisode(firstEpisodeOfSeason);
                      }
                    }}
                    className="w-full glass-card px-3 py-2 rounded-lg text-sm bg-card text-foreground"
                  >
                    {seasons.map(season => (
                      <option key={season} value={season}>
                        Temporada {season}
                      </option>
                    ))}
                  </select>
                </div>

                {episodes.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Episódios</label>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {episodes.map(episode => (
                        <button
                          key={episode.id}
                          onClick={() => setCurrentEpisode(episode)}
                          className={`w-full text-left p-3 rounded-lg smooth-transition ${
                            currentEpisode?.id === episode.id
                              ? 'bg-primary/20 border border-primary/30'
                              : 'glass-card hover:bg-muted/10'
                          }`}
                        >
                          <div className="font-medium text-sm">
                            E{episode.episode} - {episode.title}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {episode.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoViewModal;
