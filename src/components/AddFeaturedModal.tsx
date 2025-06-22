
import { useState, useEffect } from 'react';
import { Star, X } from 'lucide-react';
import { VideoService } from '../services/VideoService';
import { Video } from '../types';

interface AddFeaturedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFeaturedAdded: () => void;
  editingVideo?: Video | null;
}

const AddFeaturedModal = ({ isOpen, onClose, onFeaturedAdded, editingVideo }: AddFeaturedModalProps) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [cover, setCover] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editingVideo) {
      setTitle(editingVideo.title);
      setUrl(editingVideo.url);
      setCover(editingVideo.cover);
      setDescription(editingVideo.description);
      setTags(editingVideo.tags.join(', '));
    } else {
      setTitle('');
      setUrl('');
      setCover('');
      setDescription('');
      setTags('');
    }
  }, [editingVideo, isOpen]);

  const resetForm = () => {
    setTitle('');
    setUrl('');
    setCover('');
    setDescription('');
    setTags('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const videoData = {
      title: title.trim(),
      url: url.trim(),
      cover: cover.trim(),
      description: description.trim() || 'Conteúdo especial em destaque na plataforma.',
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
    };

    try {
      if (editingVideo) {
        // Atualiza o vídeo existente em destaque
        VideoService.updateFeaturedContent(videoData);
      } else {
        // Adiciona novo conteúdo como destaque
        VideoService.addFeaturedContent(videoData);
      }
      
      resetForm();
      onFeaturedAdded();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar conteúdo em destaque:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      
      <div className="glass-modal p-6 w-full max-w-lg animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">
              {editingVideo ? 'Editar Conteúdo em Destaque' : 'Adicionar Conteúdo em Destaque'}
            </h2>
          </div>
          <button 
            onClick={handleClose}
            className="glass-card p-1 smooth-transition hover-glow"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Título <span className="text-destructive">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full glass-card px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none smooth-transition"
              placeholder="Título atrativo para o conteúdo em destaque"
              required
            />
          </div>

          <div>
            <label htmlFor="url" className="block text-sm font-medium mb-2">
              URL do Vídeo <span className="text-destructive">*</span>
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
            <label htmlFor="cover" className="block text-sm font-medium mb-2">
              URL da Capa <span className="text-destructive">*</span>
            </label>
            <input
              id="cover"
              type="url"
              value={cover}
              onChange={(e) => setCover(e.target.value)}
              className="w-full glass-card px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none smooth-transition"
              placeholder="https://exemplo.com/imagem-alta-resolucao.jpg"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Recomendado: imagem em alta resolução (1920x1080 ou maior)
            </p>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Descrição
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full glass-card px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none smooth-transition"
              placeholder="Descrição detalhada que aparecerá na seção de destaque"
              rows={4}
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
              className="w-full glass-card px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none smooth-transition"
              placeholder="ação, aventura, thriller, exclusivo"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !title.trim() || !url.trim() || !cover.trim()}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold smooth-transition hover-glow press-effect disabled:opacity-50"
          >
            {isLoading ? 
              (editingVideo ? 'Atualizando...' : 'Adicionando...') : 
              (editingVideo ? 'Atualizar Destaque' : 'Adicionar ao Destaque')
            }
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFeaturedModal;
