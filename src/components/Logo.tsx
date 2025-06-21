
import { Play } from 'lucide-react';

const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg hover-glow smooth-transition press-effect cursor-pointer">
        <Play className="w-4 h-4 text-primary-foreground fill-current ml-0.5" />
      </div>
      <span className="text-xl font-semibold tracking-tight">ReelZone</span>
    </div>
  );
};

export default Logo;
