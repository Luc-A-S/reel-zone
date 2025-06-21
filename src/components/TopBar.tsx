
import { Plus, LogOut, Search } from 'lucide-react';
import Logo from './Logo';
import CountdownTimer from './CountdownTimer';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

interface TopBarProps {
  onAddClick: () => void;
  onLoginClick: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const TopBar = ({ onAddClick, onLoginClick, searchTerm, onSearchChange }: TopBarProps) => {
  const { isAuthenticated, timeRemaining, logout } = useAuth();

  const handleAddClick = () => {
    if (isAuthenticated) {
      onAddClick();
    } else {
      onLoginClick();
    }
  };

  return (
    <div className="sticky top-0 z-50 glass-card mx-4 mt-4 px-6 py-4">
      <div className="flex items-center justify-between">
        <Logo />
        
        <div className="flex items-center gap-4 flex-1 max-w-md mx-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Pesquisar conteúdo..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 glass rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {isAuthenticated && <CountdownTimer timeRemaining={timeRemaining} />}
          
          {isAuthenticated && (
            <button
              onClick={logout}
              className="glass-card p-2 smooth-transition hover:shadow-lg press-effect"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5 text-foreground" />
            </button>
          )}
          
          <button
            onClick={handleAddClick}
            className="glass-card p-2 smooth-transition hover:shadow-lg press-effect"
            aria-label="Add content"
          >
            <Plus className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
