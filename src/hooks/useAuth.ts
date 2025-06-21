
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
