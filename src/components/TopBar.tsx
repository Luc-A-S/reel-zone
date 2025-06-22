
import { Plus, LogOut, Search } from 'lucide-react';
import Logo from './Logo';
import CountdownTimer from './CountdownTimer';
import FilterControls from './FilterControls';
import { useAuth } from '../hooks/useAuth';

interface TopBarProps {
  onAddClick: () => void;
  onLoginClick: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSortChange: (sortBy: string) => void;
  onOrderChange: (order: 'asc' | 'desc') => void;
  currentSort: string;
  currentOrder: 'asc' | 'desc';
}

const TopBar = ({ 
  onAddClick, 
  onLoginClick, 
  searchTerm, 
  onSearchChange,
  onSortChange,
  onOrderChange,
  currentSort,
  currentOrder
}: TopBarProps) => {
  const { isAuthenticated, timeRemaining, logout } = useAuth();

  const handleAddClick = () => {
    if (isAuthenticated) {
      onAddClick();
    } else {
      onLoginClick();
    }
  };

  return (
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
          </div>
          
          <div className="flex items-center gap-4">
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
                className="glass-card p-3 smooth-transition hover-glow press-effect rounded-xl"
                aria-label="Sair"
              >
                <LogOut className="w-5 h-5 text-foreground" />
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
  );
};

export default TopBar;
