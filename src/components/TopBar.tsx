
import { Plus, Search } from 'lucide-react';
import Logo from './Logo';
import CountdownTimer from './CountdownTimer';
import VoiceSearch from './VoiceSearch';
import NotificationBell from './NotificationBell';
import LogoutConfirmDialog from './LogoutConfirmDialog';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

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
      <div className="sticky top-0 z-50 mx-4 mt-6">
        <div className="glass-card px-8 py-6">
          <div className="flex items-center justify-between">
            <Logo />
            
            <div className="flex items-center gap-6 flex-1 max-w-lg mx-12">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Pesquisar conteúdo..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 glass rounded-2xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 smooth-transition text-sm font-medium"
                />
              </div>
              <VoiceSearch onSearchResult={handleVoiceSearchResult} />
            </div>
            
            <div className="flex items-center gap-4">
              <NotificationBell />
              
              {isAuthenticated && <CountdownTimer timeRemaining={timeRemaining} />}
              
              {isAuthenticated && (
                <button
                  onClick={handleLogoutClick}
                  className="glass-card p-3 smooth-transition hover-glow press-effect rounded-xl"
                  aria-label="Sair"
                >
                  <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              )}
              
              <button
                onClick={handleAddClick}
                className="neon-border bg-primary/10 p-3 smooth-transition hover:bg-primary/20 press-effect rounded-xl"
                aria-label="Adicionar conteúdo"
              >
                <Plus className="w-5 h-5 text-primary" />
              </button>
            </div>
          </div>
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
