
import { Play, Music, BookOpen, Gamepad2, Tv, Briefcase, Heart, Zap } from 'lucide-react';

interface CategoryBadgeProps {
  category: string;
  size?: 'sm' | 'md' | 'lg';
}

const CategoryBadge = ({ category, size = 'md' }: CategoryBadgeProps) => {
  const getCategoryIcon = (cat: string) => {
    const normalizedCat = cat.toLowerCase();
    if (normalizedCat.includes('música') || normalizedCat.includes('music')) return Music;
    if (normalizedCat.includes('educação') || normalizedCat.includes('education')) return BookOpen;
    if (normalizedCat.includes('game') || normalizedCat.includes('jogo')) return Gamepad2;
    if (normalizedCat.includes('entretenimento') || normalizedCat.includes('tv')) return Tv;
    if (normalizedCat.includes('negócios') || normalizedCat.includes('business')) return Briefcase;
    if (normalizedCat.includes('estilo') || normalizedCat.includes('lifestyle')) return Heart;
    if (normalizedCat.includes('tecnologia') || normalizedCat.includes('tech')) return Zap;
    return Play;
  };

  const Icon = getCategoryIcon(category);
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-2 text-sm'
  };
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <span className={`
      inline-flex items-center gap-1 ${sizeClasses[size]} 
      font-semibold bg-primary/20 text-primary rounded-full 
      border border-primary/30 backdrop-blur-sm
    `}>
      <Icon className={iconSizes[size]} />
      {category}
    </span>
  );
};

export default CategoryBadge;
