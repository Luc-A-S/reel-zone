
import { Plus, Search } from 'lucide-react';
import Logo from './Logo';
import CountdownTimer from './CountdownTimer';
import VoiceSearch from './VoiceSearch';
import NotificationBell from './NotificationBell';
import LogoutConfirmDialog from './LogoutConfirmDialog';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import { useIsMobile } from '../hooks/use-mobile';

interface TopBarProps {
  onAddClick: () => void;
  onLoginClick: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const TopBar = ({ 
  onAddClick, 
  onLoginClick, 
  searchTerm, 
  onSearchChange
}: TopBarProps) => {
  const { isAuthenticated, timeRemaining, logout, isAdmin, isUser, isGuest, userType } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const isMobile = useIsMobile();

  const handleAddClick = () => {
    if (isAdmin) {
      onAddClick();
    } else {
      onLoginClick();
    }
  };

  const handleVoiceSearchResult = (text: string) => {
    onSearchChange(text);
  };

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutDialog(false);
  };

  const getUserDisplayName = () => {
    if (isAdmin) return 'Admin';
    if (isUser && userType.user) return userType.user.name;
    return '';
  };

  return (
    <>
      <div className="sticky top-0 z-50 mx-1 sm:mx-2 md:mx-4 mt-2 sm:mt-3 md:mt-6">
        <div className="glass-card px-2 sm:px-3 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4 lg:py-6">
          <div className="flex items-center justify-between gap-1 sm:gap-2 md:gap-4">
            {/* Logo - ainda mais compacto no mobile */}
            <div className="flex-shrink-0">
              <div className={`${isMobile ? 'scale-60' : 'scale-75 sm:scale-90 md:scale-100'}`}>
                <Logo />
              </div>
            </div>
            
            {/* Search area - máxima prioridade de espaço */}
            <div className="flex items-center gap-1 flex-1 mx-1 sm:mx-2 md:mx-4 lg:mx-6">
              <div className="relative flex-1">
                <Search className={`absolute left-2 sm:left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground ${
                  isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6'
                }`} />
                <input
                  type="text"
                  placeholder={isMobile ? "Buscar..." : "Pesquisar conteúdo..."}
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className={`w-full text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 smooth-transition font-medium glass rounded-lg sm:rounded-xl md:rounded-2xl ${
                    isMobile 
                      ? 'pl-7 pr-2 py-2 text-sm' 
                      : 'pl-8 sm:pl-10 md:pl-12 lg:pl-14 pr-3 sm:pr-4 md:pr-5 py-2 sm:py-2.5 md:py-3 lg:py-4 text-sm sm:text-base md:text-lg'
                  }`}
                />
              </div>
              <VoiceSearch onSearchResult={handleVoiceSearchResult} />
            </div>
            
            {/* Action buttons - ultra compacto no mobile */}
            <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2 flex-shrink-0">
              {/* Sino de notificações */}
              <div className={`${isMobile ? 'scale-75' : 'scale-90 sm:scale-95 md:scale-100'}`}>
                <NotificationBell />
              </div>
              
              {/* Nome do usuário quando logado */}
              {isAuthenticated && !isMobile && (
                <div className="text-xs sm:text-sm text-muted-foreground px-2">
                  Olá, {getUserDisplayName()}
                </div>
              )}
              
              {/* Timer apenas no desktop quando logado */}
              {isAuthenticated && !isMobile && (
                <div className="scale-90 sm:scale-95 md:scale-100">
                  <CountdownTimer timeRemaining={timeRemaining} />
                </div>
              )}
              
              {/* Botão de logout quando logado */}
              {isAuthenticated && (
                <button
                  onClick={handleLogoutClick}
                  className={`glass-card smooth-transition hover-glow press-effect ${
                    isMobile 
                      ? 'p-1 rounded-md scale-75' 
                      : 'p-1.5 sm:p-2 md:p-2.5 rounded-md sm:rounded-lg md:rounded-xl scale-90 sm:scale-95 md:scale-100'
                  }`}
                  aria-label="Sair"
                >
                  <svg className={`text-foreground ${isMobile ? 'w-3.5 h-3.5' : 'w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              )}
              
              {/* Botão de adicionar/login - só para admin ou guest */}
              <button
                onClick={handleAddClick}
                className={`neon-border bg-primary/10 smooth-transition hover:bg-primary/20 press-effect ${
                  isMobile 
                    ? 'p-1 rounded-md scale-75' 
                    : 'p-1.5 sm:p-2 md:p-2.5 rounded-md sm:rounded-lg md:rounded-xl scale-90 sm:scale-95 md:scale-100'
                }`}
                aria-label={isAdmin ? "Adicionar conteúdo" : "Fazer login"}
              >
                <Plus className={`text-primary ${isMobile ? 'w-3.5 h-3.5' : 'w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5'}`} />
              </button>
            </div>
          </div>

          {/* Timer no mobile quando logado - posicionado de forma mais compacta */}
          {isAuthenticated && isMobile && (
            <div className="mt-1.5 flex justify-center scale-75">
              <CountdownTimer timeRemaining={timeRemaining} />
            </div>
          )}

          {/* Nome do usuário no mobile quando logado */}
          {isAuthenticated && isMobile && (
            <div className="mt-1 text-center text-xs text-muted-foreground">
              Olá, {getUserDisplayName()}
            </div>
          )}
        </div>
      </div>

      <LogoutConfirmDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
};

export default TopBar;
