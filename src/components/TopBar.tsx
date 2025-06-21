
import { Plus, LogOut } from 'lucide-react';
import Logo from './Logo';
import ThemeSwitch from './ThemeSwitch';
import CountdownTimer from './CountdownTimer';
import { useAuth } from '../hooks/useAuth';

interface TopBarProps {
  onAddClick: () => void;
  onLoginClick: () => void;
}

const TopBar = ({ onAddClick, onLoginClick }: TopBarProps) => {
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
        
        <div className="flex items-center gap-3">
          {isAuthenticated && <CountdownTimer timeRemaining={timeRemaining} />}
          
          {isAuthenticated && (
            <button
              onClick={logout}
              className="glass-card p-2 smooth-transition hover-glow press-effect"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5 text-foreground" />
            </button>
          )}
          
          <button
            onClick={handleAddClick}
            className="glass-card p-2 smooth-transition hover-glow press-effect"
            aria-label="Add content"
          >
            <Plus className="w-5 h-5 text-foreground" />
          </button>
          
          <ThemeSwitch />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
