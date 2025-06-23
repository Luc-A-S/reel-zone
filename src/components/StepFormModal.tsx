import { useState, useEffect } from 'react';
import { Plus, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { VideoService } from '../services/VideoService';
import { Video } from '../types';
import { useIsMobile } from '../hooks/use-mobile';

interface StepFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoAdded: () => void;
  onVideoUpdated: () => void;
  editingVideo?: Video | null;
}

const StepFormModal = ({ isOpen, onClose, onVideoAdded, onVideoUpdated, editingVideo }: StepFormModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Filme' | 'Série' | 'Documentário'>('Filme');
  const [url, setUrl] = useState('');
  const [cover, setCover] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [episodeTitle, setEpisodeTitle] = useState('');
  const [episodeCover, setEpisodeCover] = useState('');
  const [episodeDescription, setEpisodeDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

  const totalSteps = category === 'Série' ? 8 : 5;

  useEffect(() => {
    if (editingVideo) {
      setTitle(editingVideo.title);
      setCategory(editingVideo.category);
      setUrl(editingVideo.url);
      setCover(editingVideo.cover);
      setDescription(editingVideo.description);
      setTags(editingVideo.tags.join(', '));
      setSeason(editingVideo.season || 1);
      setEpisode(editingVideo.episode || 1);
      setEpisodeTitle(editingVideo.episodeTitle || '');
      setEpisodeCover(editingVideo.episodeCover || '');
      setEpisodeDescription(editingVideo.episodeDescription || '');
    } else {
      // Reset form
      setTitle('');
      setCategory('Filme');
      setUrl('');
      setCover('');
      setDescription('');
      setTags('');
      setSeason(1);
      setEpisode(1);
      setEpisodeTitle('');
      setEpisodeCover('');
      setEpisodeDescription('');
    }
    setCurrentStep(1);
  }, [editingVideo, isOpen]);

  const handleSubmit = async () => {
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

  const canProceed = () => {
    switch (currentStep) {
      case 1: return title.trim() !== '';
      case 2: return true; // category always has a value
      case 3: return url.trim() !== '';
      case 4: return cover.trim() !== '';
      case 5: return description.trim() !== '';
      case 6: return category !== 'Série' || (season > 0 && episode > 0);
      case 7: return category !== 'Série' || episodeTitle.trim() !== '';
      case 8: return category !== 'Série' || episodeCover.trim() !== '';
      default: return true;
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold`}>Título do Conteúdo</h3>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full glass-card px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl focus:ring-2 focus:ring-accent focus:outline-none smooth-transition ${isMobile ? 'text-sm' : ''}`}
              placeholder="Digite o título do conteúdo"
              autoFocus
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold`}>Categoria</h3>
            <div className="grid grid-cols-1 gap-3">
              {(['Filme', 'Série', 'Documentário'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`p-3 sm:p-4 rounded-xl smooth-transition ${
                    category === cat
                      ? 'bg-primary/20 border-2 border-primary'
                      : 'glass-card hover:bg-muted/10'
                  }`}
                >
                  <span className={`font-medium ${isMobile ? 'text-sm' : ''}`}>{cat}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold`}>URL do Vídeo</h3>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={`w-full glass-card px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl focus:ring-2 focus:ring-accent focus:outline-none smooth-transition ${isMobile ? 'text-sm' : ''}`}
              placeholder="https://youtube.com/watch?v=... ou https://drive.google.com/..."
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold`}>URL da Capa</h3>
            <input
              type="url"
              value={cover}
              onChange={(e) => setCover(e.target.value)}
              className={`w-full glass-card px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl focus:ring-2 focus:ring-accent focus:outline-none smooth-transition ${isMobile ? 'text-sm' : ''}`}
              placeholder="https://exemplo.com/imagem.jpg"
            />
            {cover && (
              <div className="mt-4">
                <img
                  src={cover}
                  alt="Preview da capa"
                  className={`${isMobile ? 'w-24 h-32' : 'w-32 h-48'} object-cover rounded-xl mx-auto`}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold`}>Descrição</h3>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full glass-card px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl focus:ring-2 focus:ring-accent focus:outline-none smooth-transition ${isMobile ? 'text-sm' : ''}`}
              placeholder="Descreva o conteúdo do vídeo"
              rows={isMobile ? 3 : 4}
            />
            <div className="mt-4">
              <h4 className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium mb-2`}>Tags (separadas por vírgula)</h4>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className={`w-full glass-card px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl focus:ring-2 focus:ring-accent focus:outline-none smooth-transition ${isMobile ? 'text-sm' : ''}`}
                placeholder="ação, aventura, comédia"
              />
            </div>
          </div>
        );

      case 6:
        return category === 'Série' ? (
          <div className="space-y-4">
            <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold`}>Temporada e Episódio</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block ${isMobile ? 'text-xs' : 'text-sm'} font-medium mb-2`}>Temporada</label>
                <input
                  type="number"
                  min="1"
                  value={season}
                  onChange={(e) => setSeason(parseInt(e.target.value))}
                  className={`w-full glass-card px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl focus:ring-2 focus:ring-accent focus:outline-none smooth-transition ${isMobile ? 'text-sm' : ''}`}
                />
              </div>
              <div>
                <label className={`block ${isMobile ? 'text-xs' : 'text-sm'} font-medium mb-2`}>Episódio</label>
                <input
                  type="number"
                  min="1"
                  value={episode}
                  onChange={(e) => setEpisode(parseInt(e.target.value))}
                  className={`w-full glass-card px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl focus:ring-2 focus:ring-accent focus:outline-none smooth-transition ${isMobile ? 'text-sm' : ''}`}
                />
              </div>
            </div>
          </div>
        ) : null;

      case 7:
        return category === 'Série' ? (
          <div className="space-y-4">
            <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold`}>Título do Episódio</h3>
            <input
              type="text"
              value={episodeTitle}
              onChange={(e) => setEpisodeTitle(e.target.value)}
              className={`w-full glass-card px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl focus:ring-2 focus:ring-accent focus:outline-none smooth-transition ${isMobile ? 'text-sm' : ''}`}
              placeholder="Título específico do episódio"
            />
          </div>
        ) : null;

      case 8:
        return category === 'Série' ? (
          <div className="space-y-4">
            <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold`}>Capa e Descrição do Episódio</h3>
            <input
              type="url"
              value={episodeCover}
              onChange={(e) => setEpisodeCover(e.target.value)}
              className={`w-full glass-card px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl focus:ring-2 focus:ring-accent focus:outline-none smooth-transition ${isMobile ? 'text-sm' : ''}`}
              placeholder="URL da capa do episódio"
            />
            <textarea
              value={episodeDescription}
              onChange={(e) => setEpisodeDescription(e.target.value)}
              className={`w-full glass-card px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl focus:ring-2 focus:ring-accent focus:outline-none smooth-transition ${isMobile ? 'text-sm' : ''}`}
              placeholder="Descrição específica do episódio"
              rows={isMobile ? 2 : 3}
            />
          </div>
        ) : null;

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className={`glass-modal p-4 sm:p-6 w-full ${isMobile ? 'max-w-sm' : 'max-w-md'} animate-scale-in max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <Plus className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-accent`} />
            <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold`}>
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

        {/* Progress indicator */}
        <div className="mb-4 sm:mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
              Etapa {currentStep} de {totalSteps}
            </span>
            <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
              {Math.round((currentStep / totalSteps) * 100)}%
            </span>
          </div>
          <div className="w-full bg-muted/20 rounded-full h-2">
            <div 
              className="bg-accent h-2 rounded-full smooth-transition"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className={`${isMobile ? 'min-h-[180px]' : 'min-h-[200px]'} mb-4 sm:mb-6`}>
          {renderStep()}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between gap-3">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 glass-card rounded-xl smooth-transition hover-glow disabled:opacity-50 disabled:cursor-not-allowed ${isMobile ? 'text-sm' : ''}`}
          >
            <ArrowLeft className="w-4 h-4" />
            {!isMobile && 'Anterior'}
          </button>

          {currentStep === totalSteps ? (
            <button
              onClick={handleSubmit}
              disabled={isLoading || !canProceed()}
              className={`bg-accent text-background px-4 sm:px-6 py-2 rounded-xl font-semibold smooth-transition hover-glow press-effect disabled:opacity-50 ${isMobile ? 'text-sm' : ''}`}
            >
              {isLoading ? 
                (editingVideo ? 'Atualizando...' : 'Publicando...') : 
                (editingVideo ? 'Atualizar' : 'Publicar')
              }
            </button>
          ) : (
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className={`flex items-center gap-2 bg-accent text-background px-3 sm:px-4 py-2 rounded-xl font-semibold smooth-transition hover-glow press-effect disabled:opacity-50 ${isMobile ? 'text-sm' : ''}`}
            >
              {!isMobile && 'Próximo'}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepFormModal;
