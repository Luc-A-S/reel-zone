
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  timeRemaining: number;
}

const CountdownTimer = ({ timeRemaining }: CountdownTimerProps) => {
  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (timeRemaining <= 0) return null;

  return (
    <div className="glass-card px-3 py-1 flex items-center gap-2 text-sm">
      <Clock className="w-4 h-4" />
      <span className="font-mono">{formatTime(timeRemaining)}</span>
    </div>
  );
};

export default CountdownTimer;
