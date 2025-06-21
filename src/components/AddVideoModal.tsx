
import { useState } from 'react';
import { X, Upload, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { VideoService } from '../services/VideoService';
import { toast } from '@/hooks/use-toast';

interface AddVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoAdded: () => void;
}

const AddVideoModal = ({ isOpen, onClose, onVideoAdded }: AddVideoModalProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    url: '',
    cover: '',
    title: '',
    description: '',
    tags: ''
  });

  const resetForm = () => {
    setStep(1);
    setFormData({
      url: '',
      cover: '',
      title: '',
      description: '',
      tags: ''
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateStep = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return formData.url.includes('drive.google.com');
      case 2:
        return formData.cover !== '';
      case 3:
        return formData.title.trim() !== '' && formData.description.trim() !== '';
      case 4:
        return formData.tags.trim() !== '';
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'image/png') {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, cover: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        title: "Erro no arquivo",
        description: "Por favor, selecione apenas arquivos PNG.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = () => {
    if (!validateStep(4)) return;

    const tags = formData.tags
      .split(',')
      .map(tag => {
        const cleaned = tag.trim().toUpperCase();
        return cleaned.startsWith('#') ? cleaned : `#${cleaned}`;
      })
      .filter(tag => tag.length > 1);

    VideoService.addVideo({
      url: formData.url,
      cover: formData.cover,
      title: formData.title,
      description: formData.description,
      tags
    });

    toast({
      title: "Publicado!",
      description: "Novo conteúdo adicionado com sucesso.",
    });

    onVideoAdded();
    handleClose();
  };

  if (!isOpen) return null;

  const stepTitles = [
    'URL do Drive',
    'Capa da Publicação', 
    'Título & Descrição',
    'Tags'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      
      <div className="glass-modal p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Adicionar Conteúdo</h2>
            <p className="text-sm text-muted-foreground">
              Passo {step} de 4: {stepTitles[step - 1]}
            </p>
          </div>
          <button 
            onClick={handleClose}
            className="glass-card p-1 smooth-transition hover-glow"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {[1, 2, 3, 4].map((num) => (
              <div
                key={num}
                className={`flex-1 h-2 rounded-full ${
                  num <= step ? 'bg-primary' : 'bg-muted'
                } smooth-transition`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: URL */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                URL do Google Drive
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                className="w-full glass-card px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none smooth-transition"
                placeholder="https://drive.google.com/..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                Cole aqui o link do seu arquivo no Google Drive
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Cover */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Capa (PNG, 1080×1350)
              </label>
              
              {formData.cover ? (
                <div className="relative glass-card p-4 rounded-xl">
                  <img
                    src={formData.cover}
                    alt="Preview"
                    className="w-full max-w-xs mx-auto rounded-xl object-cover"
                    style={{ aspectRatio: '1080/1350' }}
                  />
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, cover: '' }))}
                    className="absolute top-2 right-2 glass-card p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="glass-card p-8 rounded-xl border-2 border-dashed border-muted cursor-pointer hover-glow smooth-transition block">
                  <div className="text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">Clique para fazer upload</p>
                    <p className="text-xs text-muted-foreground">PNG, máx. 10MB</p>
                  </div>
                  <input
                    type="file"
                    accept=".png"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Title & Description */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Título
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full glass-card px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none smooth-transition"
                placeholder="Digite o título do conteúdo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full glass-card px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none smooth-transition resize-none"
                rows={4}
                placeholder="Descreva o conteúdo..."
              />
            </div>
          </div>
        )}

        {/* Step 4: Tags */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Tags
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full glass-card px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none smooth-transition"
                placeholder="FILME, 2025, HD"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Separe as tags por vírgula. Elas serão convertidas para maiúsculas e receberão o prefixo #
              </p>
            </div>

            {formData.tags && (
              <div className="glass-card p-4 rounded-xl">
                <p className="text-sm font-medium mb-2">Preview das tags:</p>
                <div className="flex flex-wrap gap-1">
                  {formData.tags.split(',').map((tag, index) => {
                    const cleaned = tag.trim().toUpperCase();
                    const finalTag = cleaned.startsWith('#') ? cleaned : `#${cleaned}`;
                    return (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs font-medium bg-primary/20 text-primary rounded-full"
                      >
                        {finalTag}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={step === 1}
            className="flex items-center gap-2 glass-card px-4 py-2 rounded-xl smooth-transition hover-glow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </button>

          {step < 4 ? (
            <button
              onClick={handleNext}
              disabled={!validateStep(step)}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl smooth-transition hover-glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!validateStep(step)}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl smooth-transition hover-glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4" />
              Adicionar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddVideoModal;
