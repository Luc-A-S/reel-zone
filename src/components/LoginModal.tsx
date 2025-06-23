
import { useState } from 'react';
import { X, LogIn, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '../hooks/use-mobile';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const isMobile = useIsMobile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = login(email, password);
      
      if (success) {
        toast({
          title: "Login realizado!",
          description: "Bem-vindo de volta, admin.",
        });
        onClose();
        setEmail('');
        setPassword('');
      } else {
        toast({
          title: "Erro no login",
          description: "Credenciais inválidas.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className={`glass-modal animate-scale-in w-full ${
        isMobile 
          ? 'max-w-[95vw] p-4 mx-2' 
          : 'max-w-md p-6'
      }`}>
        <div className={`flex items-center justify-between ${isMobile ? 'mb-4' : 'mb-6'}`}>
          <div className="flex items-center gap-2">
            <LogIn className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-primary`} />
            <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold`}>
              {isMobile ? 'Login Admin' : 'Login do Administrador'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className={`glass-card smooth-transition hover-glow ${
              isMobile ? 'p-1.5' : 'p-1'
            }`}
          >
            <X className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'}`} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={`space-y-${isMobile ? '3' : '4'}`}>
          <div>
            <label htmlFor="email" className={`block font-medium mb-2 ${
              isMobile ? 'text-sm' : 'text-sm'
            }`}>
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full glass-card focus:ring-2 focus:ring-primary focus:outline-none smooth-transition rounded-xl ${
                isMobile ? 'px-3 py-2.5 text-sm' : 'px-4 py-3'
              }`}
              placeholder="admin@reelzone.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className={`block font-medium mb-2 ${
              isMobile ? 'text-sm' : 'text-sm'
            }`}>
              Senha
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full glass-card focus:ring-2 focus:ring-primary focus:outline-none smooth-transition rounded-xl ${
                  isMobile ? 'px-3 py-2.5 pr-10 text-sm' : 'px-4 py-3 pr-12'
                }`}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground smooth-transition ${
                  isMobile ? 'right-2' : 'right-3'
                }`}
              >
                {showPassword ? (
                  <EyeOff className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
                ) : (
                  <Eye className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-primary text-primary-foreground font-semibold smooth-transition hover-glow press-effect disabled:opacity-50 rounded-xl ${
              isMobile ? 'py-2.5 text-sm' : 'py-3'
            }`}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className={`text-muted-foreground text-center ${
          isMobile ? 'mt-3 text-xs' : 'mt-4 text-xs'
        }`}>
          Sessão válida por 2 horas
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
