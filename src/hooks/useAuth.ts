
import { useState, useEffect } from 'react';
import { AuthService } from '../services/AuthService';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(AuthService.isAuthenticated());
      setTimeRemaining(AuthService.getTimeRemaining());
    };

    checkAuth();
    const interval = setInterval(checkAuth, 1000);

    return () => clearInterval(interval);
  }, []);

  const login = (email: string, password: string) => {
    const success = AuthService.login(email, password);
    if (success) {
      setIsAuthenticated(true);
      setTimeRemaining(AuthService.getTimeRemaining());
    }
    return success;
  };

  const logout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    setTimeRemaining(0);
  };

  return { isAuthenticated, timeRemaining, login, logout };
};
</lov-wrap>

<lov-write file_path="src/components/Logo.tsx">
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
