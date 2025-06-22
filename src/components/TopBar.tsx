
import { Plus, LogOut, Search, Sparkles } from 'lucide-react';
import Logo from './Logo';
import CountdownTimer from './CountdownTimer';
import FilterControls from './FilterControls';
import ViewModeToggle from './ViewModeToggle';
import LoadingSpinner from './LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

interface TopBarProps {
  onAddClick: () => void;
  onLoginClick: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSortChange: (sortBy: string) => void;
  onOrderChange: (order: 'asc' | 'desc') => void;
  currentSort: string;
  currentOrder: 'asc' | 'desc';
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const TopBar = ({ 
  onAddClick, 
  onLoginClick, 
  searchTerm, 
  onSearchChange,
  onSortChange,
  onOrderChange,
  currentSort,
  currentOrder,
  viewMode,
  onViewModeChange
}: TopBarProps) => {
  const { isAuthenticated, timeRemaining, logout } = useAuth();
  const [isSearching, setIsSearching] = useState(false);

  const handleAddClick = () => {
    if (isAuthenticated) {
      onAddClick();
    } else {
      onLoginClick();
    }
  };

  const handleSearchChange = (value: string) => {
    setIsSearching(true);
    onSearchChange(value);
    setTimeout(() => setIsSearching(false), 300);
  };

  return (
    <div className="sticky top-0 z-50 mx-4 mt-6">
      <div className="glass-card px-8 py-6 border border-primary/10">
        <div className="flex items-center justify-between">
          <Logo />
          
          <div className="flex items-center gap-6 flex-1 max-w-2xl mx-12">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              {isSearching && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <LoadingSpinner size="sm" />
                </div>
              )}
              <input
                type="text"
                placeholder="Buscar conteúdo incrível..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-12 pr-12 py-4 glass rounded-2xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 smooth-transition text-sm font-medium border border-primary/20"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <ViewModeToggle 
              viewMode={viewMode}
              onViewModeChange={onViewModeChange}
            />
            
            <FilterControls 
              onSortChange={onSortChange}
              onOrderChange={onOrderChange}
              currentSort={currentSort}
              currentOrder={currentOrder}
            />
            
            {isAuthenticated && <CountdownTimer timeRemaining={timeRemaining} />}
            
            {isAuthenticated && (
              <button
                onClick={logout}
                className="glass-card p-3 smooth-transition hover-glow press-effect rounded-xl border border-primary/20 hover:border-primary/40"
                aria-label="Sair"
              >
                <LogOut className="w-5 h-5 text-foreground" />
              </button>
            )}
            
            <button
              onClick={handleAddClick}
              className="neon-border bg-primary/10 p-3 smooth-transition hover:bg-primary/20 press-effect rounded-xl flex items-center gap-2 group"
              aria-label="Adicionar conteúdo"
            >
              <Plus className="w-5 h-5 text-primary" />
              <Sparkles className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 smooth-transition" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
