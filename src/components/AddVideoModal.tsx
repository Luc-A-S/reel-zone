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
  const [thumbnail, setThumbnail] = useState('');
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editingVideo) {
      setTitle(editingVideo.title);
      setUrl(editingVideo.url);
      setThumbnail(editingVideo.thumbnail);
      setCategory(editingVideo.category);
    } else {
      setTitle('');
      setUrl('');
      setThumbnail('');
      setCategory('');
    }
  }, [editingVideo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const videoData = {
      title,
      url,
      thumbnail,
      category,
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
            <Plus className="w-5 h-5 text-primary" />
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
              className="w-full glass-card px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none smooth-transition"
              placeholder="Digite o título do conteúdo"
              required
            />
          </div>

          <div>
            <label htmlFor="url" className="block text-sm font-medium mb-2">
              URL do Vídeo
            </label>
            <input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full glass-card px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none smooth-transition"
              placeholder="https://youtube.com/watch?v=..."
              required
            />
          </div>

          <div>
            <label htmlFor="thumbnail" className="block text-sm font-medium mb-2">
              URL da Miniatura
            </label>
            <input
              id="thumbnail"
              type="url"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              className="w-full glass-card px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none smooth-transition"
              placeholder="https://exemplo.com/imagem.jpg"
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
              onChange={(e) => setCategory(e.target.value)}
              className="w-full glass-card px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none smooth-transition"
              required
            >
              <option value="">Selecione uma categoria</option>
              <option value="Entretenimento">Entretenimento</option>
              <option value="Educação">Educação</option>
              <option value="Música">Música</option>
              <option value="Esportes">Esportes</option>
              <option value="Tecnologia">Tecnologia</option>
              <option value="Culinária">Culinária</option>
              <option value="Viagem">Viagem</option>
              <option value="Outros">Outros</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold smooth-transition hover-glow press-effect disabled:opacity-50"
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
