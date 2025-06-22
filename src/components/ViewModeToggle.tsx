
import { Grid3X3, List } from 'lucide-react';

interface ViewModeToggleProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const ViewModeToggle = ({ viewMode, onViewModeChange }: ViewModeToggleProps) => {
  return (
    <div className="flex items-center glass-card rounded-xl p-1">
      <button
        onClick={() => onViewModeChange('grid')}
        className={`
          p-2 rounded-lg transition-all duration-200
          ${viewMode === 'grid' 
            ? 'bg-primary/20 text-primary' 
            : 'text-muted-foreground hover:text-foreground'
          }
        `}
      >
        <Grid3X3 className="w-4 h-4" />
      </button>
      <button
        onClick={() => onViewModeChange('list')}
        className={`
          p-2 rounded-lg transition-all duration-200
          ${viewMode === 'list' 
            ? 'bg-primary/20 text-primary' 
            : 'text-muted-foreground hover:text-foreground'
          }
        `}
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ViewModeToggle;
