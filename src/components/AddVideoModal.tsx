
import { useState, useEffect } from 'react';
import { X, Upload, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { VideoService } from '../services/VideoService';
import { toast } from '@/hooks/use-toast';
import { Video } from '../types';

interface AddVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoAdded: () => void;
  onVideoUpdated: () => void;
  editingVideo: Video | null;
}

const AddVideoModal = ({ isOpen, onClose, onVideoAdded, onVideoUpdated, editingVideo }: AddVideoModalProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    url: '',
    cover: '',
    title: '',
    description: '',
    tags: ''
  });

  // Load editing video data when editingVideo changes
  useEffect(() => {
    if (editingVideo) {
      setFormData({
        url: editingVideo.url,
        cover: editingVideo.cover,
        title: editingVideo.title,
        description: editingVideo.description,
        tags: editingVideo.tags.join(', ')
      });
    }
  }, [editingVideo]);

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
        title: "File error",
        description: "Please select PNG files only.",
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

    if (editingVideo) {
      // Update existing video
      VideoService.updateVideo(editingVideo.id, {
        url: formData.url,
        cover: formData.cover,
        title: formData.title,
        description: formData.description,
        tags
      });

      toast({
        title: "Updated!",
        description: "Content updated successfully.",
      });

      onVideoUpdated();
    } else {
      // Add new video
      VideoService.addVideo({
        url: formData.url,
        cover: formData.cover,
        title: formData.title,
        description: formData.description,
        tags
      });

      toast({
        title: "Published!",
        description: "New content added successfully.",
      });

      onVideoAdded();
    }

    handleClose();
  };

  if (!isOpen) return null;

  const stepTitles = [
    'Drive URL',
    'Cover Image', 
    'Title & Description',
    'Tags'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      
      <div className="glass-modal p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {editingVideo ? 'Edit Content' : 'Add Content'}
            </h2>
            <p className="text-muted-foreground font-medium mt-1">
              Step {step} of 4: {stepTitles[step - 1]}
            </p>
          </div>
          <button 
            onClick={handleClose}
            className="glass-card p-2 smooth-transition hover-glow rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex space-x-3">
            {[1, 2, 3, 4].map((num) => (
              <div
                key={num}
                className={`flex-1 h-3 rounded-full smooth-transition ${
                  num <= step ? 'bg-primary animate-neon-pulse' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: URL */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-3 text-foreground">
                Google Drive URL
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                className="w-full glass-card px-4 py-4 rounded-2xl focus:ring-2 focus:ring-primary/50 focus:outline-none smooth-transition text-foreground font-medium"
                placeholder="https://drive.google.com/..."
              />
              <p className="text-xs text-muted-foreground mt-2 font-medium">
                Paste your Google Drive file link here
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Cover */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-3 text-foreground">
                Cover Image (PNG, 1080×1350)
              </label>
              
              {formData.cover ? (
                <div className="relative glass-card p-6 rounded-2xl">
                  <img
                    src={formData.cover}
                    alt="Preview"
                    className="w-full max-w-sm mx-auto rounded-2xl object-cover"
                    style={{ aspectRatio: '1080/1350' }}
                  />
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, cover: '' }))}
                    className="absolute top-3 right-3 glass-card p-2 rounded-xl hover-glow smooth-transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="glass-card p-12 rounded-2xl border-2 border-dashed border-primary/30 cursor-pointer hover-glow smooth-transition block">
                  <div className="text-center">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <p className="text-lg font-semibold text-foreground mb-2">Click to upload</p>
                    <p className="text-sm text-muted-foreground font-medium">PNG files only, max 10MB</p>
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
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-3 text-foreground">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full glass-card px-4 py-4 rounded-2xl focus:ring-2 focus:ring-primary/50 focus:outline-none smooth-transition text-foreground font-medium"
                placeholder="Enter content title"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3 text-foreground">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full glass-card px-4 py-4 rounded-2xl focus:ring-2 focus:ring-primary/50 focus:outline-none smooth-transition resize-none text-foreground font-medium"
                rows={5}
                placeholder="Describe your content..."
              />
            </div>
          </div>
        )}

        {/* Step 4: Tags */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-3 text-foreground">
                Tags
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full glass-card px-4 py-4 rounded-2xl focus:ring-2 focus:ring-primary/50 focus:outline-none smooth-transition text-foreground font-medium"
                placeholder="MOVIE, 2025, HD"
              />
              <p className="text-xs text-muted-foreground mt-2 font-medium">
                Separate tags with commas. They will be converted to uppercase with # prefix
              </p>
            </div>

            {formData.tags && (
              <div className="glass-card p-6 rounded-2xl">
                <p className="text-sm font-semibold mb-3 text-foreground">Tags Preview:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.split(',').map((tag, index) => {
                    const cleaned = tag.trim().toUpperCase();
                    const finalTag = cleaned.startsWith('#') ? cleaned : `#${cleaned}`;
                    return (
                      <span
                        key={index}
                        className="px-3 py-2 text-sm font-semibold bg-primary/20 text-primary rounded-full border border-primary/30"
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
        <div className="flex justify-between mt-10">
          <button
            onClick={handlePrevious}
            disabled={step === 1}
            className="flex items-center gap-3 glass-card px-6 py-3 rounded-2xl smooth-transition hover-glow disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          {step < 4 ? (
            <button
              onClick={handleNext}
              disabled={!validateStep(step)}
              className="flex items-center gap-3 neon-border bg-primary/10 px-6 py-3 rounded-2xl smooth-transition hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-primary"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!validateStep(step)}
              className="flex items-center gap-3 bg-primary text-primary-foreground px-6 py-3 rounded-2xl smooth-transition hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              <Check className="w-4 h-4" />
              {editingVideo ? 'Update' : 'Publish'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddVideoModal;
