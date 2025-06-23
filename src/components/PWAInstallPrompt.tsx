
import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Mostrar o prompt após 3 segundos, apenas se não foi dismissed antes
      const wasPromptDismissed = localStorage.getItem('pwa-prompt-dismissed');
      if (!wasPromptDismissed) {
        setTimeout(() => {
          setShowPrompt(true);
        }, 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA instalado');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (!showPrompt || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-up">
      <div className={`glass-card ${
        isMobile 
          ? 'p-3 max-w-[280px]' 
          : 'p-4 max-w-xs'
      } shadow-lg`}>
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h3 className={`font-semibold mb-1 ${
              isMobile ? 'text-sm' : 'text-sm'
            }`}>
              Instalar ReelZone
            </h3>
            <p className={`text-muted-foreground mb-3 ${
              isMobile ? 'text-xs' : 'text-xs'
            }`}>
              Acesse rapidamente direto da sua tela inicial
            </p>
            
            <div className="flex gap-2">
              <button
                onClick={handleInstallClick}
                className={`bg-primary text-primary-foreground font-medium smooth-transition hover-glow press-effect rounded-lg flex items-center gap-1.5 ${
                  isMobile ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-2 text-sm'
                }`}
              >
                <Download className={`${isMobile ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} />
                Instalar
              </button>
              
              <button
                onClick={handleDismiss}
                className={`text-muted-foreground hover:text-foreground smooth-transition ${
                  isMobile ? 'px-2 py-1.5 text-xs' : 'px-2.5 py-2 text-sm'
                }`}
              >
                Depois
              </button>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className={`text-muted-foreground hover:text-foreground smooth-transition flex-shrink-0 ${
              isMobile ? 'p-0.5' : 'p-1'
            }`}
          >
            <X className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
