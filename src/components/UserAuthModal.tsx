
import { useState } from 'react';
import { X, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useUserAuth } from '../hooks/useUserAuth';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '../hooks/use-mobile';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

const UserAuthModal = ({ isOpen, onClose, initialMode = 'login' }: UserAuthModalProps) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useUserAuth();
  const isMobile = useIsMobile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'register') {
        if (password !== confirmPassword) {
          toast({
            title: "Erro no cadastro",
            description: "As senhas não coincidem.",
            variant: "destructive",
          });
          return;
        }

        const result = register(name, email, password);
        
        if (result.success) {
          toast({
            title: "Cadastro realizado!",
            description: "Sua conta foi criada com sucesso.",
          });
          onClose();
          resetForm();
        } else {
          toast({
            title: "Erro no cadastro",
            description: result.message,
            variant: "destructive",
          });
        }
      } else {
        const result = login(email, password);
        
        if (result.success) {
          toast({
            title: "Login realizado!",
            description: `Bem-vindo de volta, ${result.user?.name}!`,
          });
          onClose();
          resetForm();
        } else {
          toast({
            title: "Erro no login",
            description: result.message,
            variant: "destructive",
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    resetForm();
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
            <User className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-primary`} />
            <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold`}>
              {mode === 'login' ? 'Entrar' : 'Criar Conta'}
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
          {mode === 'register' && (
            <div>
              <label htmlFor="name" className={`block font-medium mb-2 ${
                isMobile ? 'text-sm' : 'text-sm'
              }`}>
                Nome completo
              </label>
              <div className="relative">
                <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground ${
                  isMobile ? 'w-4 h-4' : 'w-5 h-5'
                }`} />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full glass-card focus:ring-2 focus:ring-primary focus:outline-none smooth-transition rounded-xl ${
                    isMobile ? 'pl-10 pr-3 py-2.5 text-sm' : 'pl-12 pr-4 py-3'
                  }`}
                  placeholder="Seu nome"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className={`block font-medium mb-2 ${
              isMobile ? 'text-sm' : 'text-sm'
            }`}>
              E-mail
            </label>
            <div className="relative">
              <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground ${
                isMobile ? 'w-4 h-4' : 'w-5 h-5'
              }`} />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full glass-card focus:ring-2 focus:ring-primary focus:outline-none smooth-transition rounded-xl ${
                  isMobile ? 'pl-10 pr-3 py-2.5 text-sm' : 'pl-12 pr-4 py-3'
                }`}
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className={`block font-medium mb-2 ${
              isMobile ? 'text-sm' : 'text-sm'
            }`}>
              Senha
            </label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground ${
                isMobile ? 'w-4 h-4' : 'w-5 h-5'
              }`} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full glass-card focus:ring-2 focus:ring-primary focus:outline-none smooth-transition rounded-xl ${
                  isMobile ? 'pl-10 pr-10 py-2.5 text-sm' : 'pl-12 pr-12 py-3'
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

          {mode === 'register' && (
            <div>
              <label htmlFor="confirmPassword" className={`block font-medium mb-2 ${
                isMobile ? 'text-sm' : 'text-sm'
              }`}>
                Confirmar senha
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground ${
                  isMobile ? 'w-4 h-4' : 'w-5 h-5'
                }`} />
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full glass-card focus:ring-2 focus:ring-primary focus:outline-none smooth-transition rounded-xl ${
                    isMobile ? 'pl-10 pr-3 py-2.5 text-sm' : 'pl-12 pr-4 py-3'
                  }`}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-primary text-primary-foreground font-semibold smooth-transition hover-glow press-effect disabled:opacity-50 rounded-xl ${
              isMobile ? 'py-2.5 text-sm' : 'py-3'
            }`}
          >
            {isLoading ? 'Aguarde...' : (mode === 'login' ? 'Entrar' : 'Criar Conta')}
          </button>
        </form>

        <div className={`text-center ${isMobile ? 'mt-3' : 'mt-4'}`}>
          <button
            onClick={switchMode}
            className={`text-primary hover:text-primary/80 smooth-transition ${
              isMobile ? 'text-sm' : 'text-sm'
            }`}
          >
            {mode === 'login' ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Entre'}
          </button>
        </div>

        <div className={`text-muted-foreground text-center ${
          isMobile ? 'mt-3 text-xs' : 'mt-4 text-xs'
        }`}>
          Sessão válida por 24 horas
        </div>
      </div>
    </div>
  );
};

export default UserAuthModal;
