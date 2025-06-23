
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
  const { isAuthenticated, timeRemaining, logout } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const isMobile = useIsMobile();

  const handleAddClick = () => {
    if (isAuthenticated) {
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

  return (
    <>
      <div className="sticky top-0 z-50 mx-1 sm:mx-2 md:mx-4 mt-2 sm:mt-3 md:mt-6">
        <div className="glass-card px-2 sm:px-3 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4 lg:py-6">
          <div className="flex items-center justify-between gap-1 sm:gap-2 md:gap-4">
            <div className="flex-shrink-0">
              <Logo />
            </div>
            
            {/* Search area - responsive layout */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-4 lg:gap-6 flex-1 max-w-xs sm:max-w-sm md:max-w-lg mx-1 sm:mx-2 md:mx-4 lg:mx-12">
              <div className="relative flex-1">
                <Search className="absolute left-2 sm:left-3 md:left-4 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={isMobile ? "Buscar..." : "Pesquisar conteúdo..."}
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-6 sm:pl-8 md:pl-10 lg:pl-12 pr-2 sm:pr-3 md:pr-4 py-1.5 sm:py-2 md:py-2.5 lg:py-3 glass rounded-lg sm:rounded-xl md:rounded-2xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 smooth-transition text-xs sm:text-sm md:text-sm lg:text-base font-medium"
                />
              </div>
              <VoiceSearch onSearchResult={handleVoiceSearchResult} />
            </div>
            
            {/* Action buttons - responsive layout */}
            <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 lg:gap-4 flex-shrink-0">
              <NotificationBell />
              
              {isAuthenticated && !isMobile && <CountdownTimer timeRemaining={timeRemaining} />}
              
              {isAuthenticated && (
                <button
                  onClick={handleLogoutClick}
                  className="glass-card p-1.5 sm:p-2 md:p-2.5 lg:p-3 smooth-transition hover-glow press-effect rounded-md sm:rounded-lg md:rounded-xl"
                  aria-label="Sair"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              )}
              
              <button
                onClick={handleAddClick}
                className="neon-border bg-primary/10 p-1.5 sm:p-2 md:p-2.5 lg:p-3 smooth-transition hover:bg-primary/20 press-effect rounded-md sm:rounded-lg md:rounded-xl"
                aria-label="Adicionar conteúdo"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary" />
              </button>
            </div>
          </div>

          {/* Mobile timer - show below on mobile */}
          {isAuthenticated && isMobile && (
            <div className="mt-2 flex justify-center">
              <CountdownTimer timeRemaining={timeRemaining} />
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
