
import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { VideoService } from '../services/VideoService';
import { Video } from '../types';

interface AddVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoAdded: () => void;
  onVideoUpdated: () => void;
  editingVideo?: Video | null;
}

const AddVideoModal = ({ isOpen, onClose, onVideoAdded, onVideoUpdated, editingVideo }: AddVideoModalProps) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [cover, setCover] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState<'Filme' | 'Série' | 'Documentário'>('Filme');
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [episodeTitle, setEpisodeTitle] = useState('');
  const [episodeCover, setEpisodeCover] = useState('');
  const [episodeDescription, setEpisodeDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editingVideo) {
      setTitle(editingVideo.title);
      setUrl(editingVideo.url);
      setCover(editingVideo.cover);
      setDescription(editingVideo.description);
      setTags(editingVideo.tags.join(', '));
      setCategory(editingVideo.category);
      setSeason(editingVideo.season || 1);
      setEpisode(editingVideo.episode || 1);
      setEpisodeTitle(editingVideo.episodeTitle || '');
      setEpisodeCover(editingVideo.episodeCover || '');
      setEpisodeDescription(editingVideo.episodeDescription || '');
    } else {
      setTitle('');
      setUrl('');
      setCover('');
      setDescription('');
      setTags('');
      setCategory('Filme');
      setSeason(1);
      setEpisode(1);
      setEpisodeTitle('');
      setEpisodeCover('');
      setEpisodeDescription('');
    }
  }, [editingVideo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const videoData = {
      title,
      url,
      cover,
      description,
      category,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      ...(category === 'Série' && {
        season,
        episode,
        episodeTitle,
        episodeCover,
        episodeDescription,
      }),
    };

    try {
      if (editingVideo) {
        VideoService.updateVideo(editingVideo.id, videoData);
        onVideoUpdated();
      } else {
        VideoService.addVideo(videoData);
        onVideoAdded();
      }
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="glass-modal p-6 w-full max-w-md animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-semibold">
              {editingVideo ? 'Editar Conteúdo' : 'Adicionar Conteúdo'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="glass-card p-1 smooth-transition hover-glow"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Título
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full glass-card px-4 py-3 rounded-xl focus:ring-2 focus:ring-accent focus:outline-none smooth-transition"
              placeholder="Digite o título do conteúdo"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-2">
              Categoria
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as 'Filme' | 'Série' | 'Documentário')}
              className="w-full glass-card px-4 py-3 rounded-xl focus:ring-2 focus:ring-accent focus:outline-none smooth-transition"
            >
              <option value="Filme">Filme</option>
              <option value="Série">Série</option>
              <option value="Documentário">Documentário</option>
            </select>
          </div>

          {category === 'Série' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="season" className="block text-sm font-medium mb-2">
                    Temporada
                  </label>
                  <input
                    id="season"
                    type="number"
                    min="1"
                    value={season}
                    onChange={(e) => setSeason(parseInt(e.target.value))}
                    className="w-full glass-card px-4 py-3 rounded-xl focus:ring-2 focus:ring-accent focus:outline-none smooth-transition"
                  />
                </div>
                <div>
                  <label htmlFor="episode" className="block text-sm font-medium mb-2">
                    Episódio
                  </label>
                  <input
                    id="episode"
                    type="number"
                    min="1"
                    value={episode}
                    onChange={(e) => setEpisode(parseInt(e.target.value))}
                    className="w-full glass-card px-4 py-3 rounded-xl focus:ring-2 focus:ring-accent focus:outline-none smooth-transition"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="episodeTitle" className="block text-sm font-medium mb-2">
                  Título do Episódio
                </label>
                <input
                  id="episodeTitle"
                  type="text"
                  value={episodeTitle}
                  onChange={(e) => setEpisodeTitle(e.target.value)}
                  className="w-full glass-card px-4 py-3 rounded-xl focus:ring-2 focus:ring-accent focus:outline-none smooth-transition"
                  placeholder="Título específico do episódio"
                />
              </div>

              <div>
                <label htmlFor="episodeCover" className="block text-sm font-medium mb-2">
                  URL da Capa do Episódio
                </label>
                <input
                  id="episodeCover"
                  type="url"
                  value={episodeCover}
                  onChange={(e) => setEpisodeCover(e.target.value)}
                  className="w-full glass-card px-4 py-3 rounded-xl focus:ring-2 focus:ring-accent focus:outline-none smooth-transition"
                  placeholder="https://exemplo.com/episodio.jpg"
                />
              </div>

              <div>
                <label htmlFor="episodeDescription" className="block text-sm font-medium mb-2">
                  Descrição do Episódio
                </label>
                <textarea
                  id="episodeDescription"
                  value={episodeDescription}
                  onChange={(e) => setEpisodeDescription(e.target.value)}
                  className="w-full glass-card px-4 py-3 rounded-xl focus:ring-2 focus:ring-accent focus:outline-none smooth-transition"
                  placeholder="Descrição específica do episódio"
                  rows={2}
                />
              </div>
            </>
          )}

          <div>
            <label htmlFor="url" className="block text-sm font-medium mb-2">
              URL do Vídeo
            </label>
            <input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full glass-card px-4 py-3 rounded-xl focus:ring-2 focus:ring-accent focus:outline-none smooth-transition"
              placeholder="https://youtube.com/watch?v=..."
              required
            />
          </div>

          <div>
            <label htmlFor="cover" className="block text-sm font-medium mb-2">
              URL da Capa
            </label>
            <input
              id="cover"
              type="url"
              value={cover}
              onChange={(e) => setCover(e.target.value)}
              className="w-full glass-card px-4 py-3 rounded-xl focus:ring-2 focus:ring-accent focus:outline-none smooth-transition"
              placeholder="https://exemplo.com/imagem.jpg"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Descrição
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full glass-card px-4 py-3 rounded-xl focus:ring-2 focus:ring-accent focus:outline-none smooth-transition"
              placeholder="Descreva o conteúdo do vídeo"
              rows={3}
              required
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium mb-2">
              Tags (separadas por vírgula)
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full glass-card px-4 py-3 rounded-xl focus:ring-2 focus:ring-accent focus:outline-none smooth-transition"
              placeholder="ação, aventura, comédia"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent text-background py-3 rounded-xl font-semibold smooth-transition hover-glow press-effect disabled:opacity-50"
          >
            {isLoading ? 
              (editingVideo ? 'Atualizando...' : 'Publicando...') : 
              (editingVideo ? 'Atualizar Conteúdo' : 'Publicar Conteúdo')
            }
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddVideoModal;
