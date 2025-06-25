
import { useState } from 'react';
import { X, LogIn, Eye, EyeOff, UserPlus } from 'lucide-react';
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
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'admin' | 'user'>('user');
  const [userMode, setUserMode] = useState<'login' | 'register'>('login');
  const { loginAdmin, loginUser, registerUser } = useAuth();
  const isMobile = useIsMobile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (activeTab === 'admin') {
        const success = loginAdmin(email, password);
        
        if (success) {
          toast({
            title: "Login realizado!",
            description: "Bem-vindo de volta, admin.",
          });
          onClose();
          resetForm();
        } else {
          toast({
            title: "Erro no login",
            description: "Credenciais inválidas.",
            variant: "destructive",
          });
        }
      } else {
        if (userMode === 'login') {
          const result = loginUser(email, password);
          
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
              description: "Email ou senha incorretos.",
              variant: "destructive",
            });
          }
        } else {
          const result = registerUser(email, password, name);
          
          if (result.success) {
            toast({
              title: "Conta criada!",
              description: `Bem-vindo, ${result.user?.name}!`,
            });
            onClose();
            resetForm();
          } else {
            toast({
              title: "Erro no cadastro",
              description: "Email já existe ou dados inválidos.",
              variant: "destructive",
            });
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setShowPassword(false);
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
              {activeTab === 'admin' ? 'Login Administrador' : (userMode === 'login' ? 'Login Usuário' : 'Cadastro Usuário')}
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

        {/* Tabs */}
        <div className={`flex rounded-lg mb-${isMobile ? '4' : '6'} glass-card p-1`}>
          <button
            onClick={() => setActiveTab('user')}
            className={`flex-1 py-2 px-3 rounded text-sm font-medium smooth-transition ${
              activeTab === 'user' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Usuário
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex-1 py-2 px-3 rounded text-sm font-medium smooth-transition ${
              activeTab === 'admin' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Administrador
          </button>
        </div>

        {/* User Login/Register Toggle */}
        {activeTab === 'user' && (
          <div className={`flex rounded-lg mb-${isMobile ? '4' : '6'} glass-card p-1`}>
            <button
              onClick={() => setUserMode('login')}
              className={`flex-1 py-2 px-3 rounded text-sm font-medium smooth-transition ${
                userMode === 'login' 
                  ? 'bg-primary/20 text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setUserMode('register')}
              className={`flex-1 py-2 px-3 rounded text-sm font-medium smooth-transition ${
                userMode === 'register' 
                  ? 'bg-primary/20 text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Cadastrar
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className={`space-y-${isMobile ? '3' : '4'}`}>
          {/* Nome - apenas no cadastro de usuário */}
          {activeTab === 'user' && userMode === 'register' && (
            <div>
              <label htmlFor="name" className={`block font-medium mb-2 ${
                isMobile ? 'text-sm' : 'text-sm'
              }`}>
                Nome
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full glass-card focus:ring-2 focus:ring-primary focus:outline-none smooth-transition rounded-xl ${
                  isMobile ? 'px-3 py-2.5 text-sm' : 'px-4 py-3'
                }`}
                placeholder="Seu nome completo"
                required
              />
            </div>
          )}

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
              placeholder={activeTab === 'admin' ? "admin@reelzone.com" : "seu@email.com"}
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
            {isLoading ? 'Carregando...' : (
              activeTab === 'admin' ? 'Entrar como Admin' : 
              userMode === 'login' ? 'Entrar' : 'Criar Conta'
            )}
          </button>
        </form>

        {/* Informações de sessão */}
        <div className={`text-muted-foreground text-center ${
          isMobile ? 'mt-3 text-xs' : 'mt-4 text-xs'
        }`}>
          {activeTab === 'admin' ? 'Sessão válida por 2 horas' : 'Sessão válida por 24 horas'}
        </div>

        {/* Usuários de exemplo */}
        {activeTab === 'user' && userMode === 'login' && (
          <div className={`text-muted-foreground text-center ${
            isMobile ? 'mt-2 text-xs' : 'mt-3 text-xs'
          }`}>
            <div>Usuários de teste:</div>
            <div>user@exemplo.com / 123456</div>
            <div>joao@email.com / senha123</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
