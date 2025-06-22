
import { useState } from 'react';
import { Filter, ChevronDown } from 'lucide-react';

interface FilterControlsProps {
  onSortChange: (sortBy: string) => void;
  onOrderChange: (order: 'asc' | 'desc') => void;
  currentSort: string;
  currentOrder: 'asc' | 'desc';
}

const FilterControls = ({ onSortChange, onOrderChange, currentSort, currentOrder }: FilterControlsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { value: 'title', label: 'Título' },
    { value: 'createdAt', label: 'Data de Criação' },
    { value: 'category', label: 'Categoria' },
  ];

  const orderOptions = [
    { value: 'asc', label: 'Crescente' },
    { value: 'desc', label: 'Decrescente' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-card px-4 py-2 rounded-xl flex items-center gap-2 smooth-transition hover-glow press-effect"
      >
        <Filter className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Filtros</span>
        <ChevronDown className={`w-4 h-4 smooth-transition ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 glass-modal p-4 rounded-2xl min-w-[200px] z-50">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Ordenar por:</label>
              <select
                value={currentSort}
                onChange={(e) => onSortChange(e.target.value)}
                className="w-full glass-card px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value} className="bg-card text-foreground">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Ordem:</label>
              <select
                value={currentOrder}
                onChange={(e) => onOrderChange(e.target.value as 'asc' | 'desc')}
                className="w-full glass-card px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              >
                {orderOptions.map(option => (
                  <option key={option.value} value={option.value} className="bg-card text-foreground">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full bg-primary/20 text-primary py-2 rounded-lg text-sm font-medium smooth-transition hover:bg-primary/30"
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterControls;
