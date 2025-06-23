
import { useState, useEffect } from 'react';
import { UserAuthService } from '../services/UserAuthService';
import { User } from '../types';

export const useUserAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = UserAuthService.getCurrentUser();
      setUser(currentUser);
      setIsAuthenticated(UserAuthService.isAuthenticated());
      setTimeRemaining(UserAuthService.getTimeRemaining());
    };

    checkAuth();
    const interval = setInterval(checkAuth, 1000);

    return () => clearInterval(interval);
  }, []);

  const login = (email: string, password: string) => {
    const result = UserAuthService.login(email, password);
    if (result.success && result.user) {
      setUser(result.user);
      setIsAuthenticated(true);
      setTimeRemaining(UserAuthService.getTimeRemaining());
    }
    return result;
  };

  const register = (name: string, email: string, password: string) => {
    const result = UserAuthService.register(name, email, password);
    if (result.success && result.user) {
      // Auto login após registro
      const loginResult = UserAuthService.login(email, password);
      if (loginResult.success && loginResult.user) {
        setUser(loginResult.user);
        setIsAuthenticated(true);
        setTimeRemaining(UserAuthService.getTimeRemaining());
      }
    }
    return result;
  };

  const logout = () => {
    UserAuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setTimeRemaining(0);
  };

  return { user, isAuthenticated, timeRemaining, login, register, logout };
};
