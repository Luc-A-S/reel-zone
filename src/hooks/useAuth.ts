
import { useState, useEffect } from 'react';
import { AuthService } from '../services/AuthService';
import { UserAuthService, User } from '../services/UserAuthService';
import { UserType } from '../types';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [userType, setUserType] = useState<UserType>({ type: 'guest' });

  useEffect(() => {
    const checkAuth = () => {
      const isAdminAuth = AuthService.isAuthenticated();
      const isUserAuth = UserAuthService.isAuthenticated();
      
      if (isAdminAuth) {
        setIsAuthenticated(true);
        setTimeRemaining(AuthService.getTimeRemaining());
        setUserType({ type: 'admin' });
      } else if (isUserAuth) {
        const currentUser = UserAuthService.getCurrentUser();
        setIsAuthenticated(true);
        setTimeRemaining(UserAuthService.getTimeRemaining());
        setUserType({ 
          type: 'user', 
          user: currentUser || undefined 
        });
      } else {
        setIsAuthenticated(false);
        setTimeRemaining(0);
        setUserType({ type: 'guest' });
      }
    };

    checkAuth();
    const interval = setInterval(checkAuth, 1000);

    return () => clearInterval(interval);
  }, []);

  const loginAdmin = (email: string, password: string) => {
    const success = AuthService.login(email, password);
    if (success) {
      setIsAuthenticated(true);
      setTimeRemaining(AuthService.getTimeRemaining());
      setUserType({ type: 'admin' });
    }
    return success;
  };

  const loginUser = (email: string, password: string) => {
    const result = UserAuthService.login(email, password);
    if (result.success && result.user) {
      setIsAuthenticated(true);
      setTimeRemaining(UserAuthService.getTimeRemaining());
      setUserType({ 
        type: 'user', 
        user: result.user 
      });
    }
    return result;
  };

  const registerUser = (email: string, password: string, name: string) => {
    const result = UserAuthService.register(email, password, name);
    if (result.success && result.user) {
      setIsAuthenticated(true);
      setTimeRemaining(UserAuthService.getTimeRemaining());
      setUserType({ 
        type: 'user', 
        user: result.user 
      });
    }
    return result;
  };

  const logout = () => {
    if (userType.type === 'admin') {
      AuthService.logout();
    } else if (userType.type === 'user') {
      UserAuthService.logout();
    }
    setIsAuthenticated(false);
    setTimeRemaining(0);
    setUserType({ type: 'guest' });
  };

  // Funções de conveniência para verificar tipo de usuário
  const isAdmin = userType.type === 'admin';
  const isUser = userType.type === 'user';
  const isGuest = userType.type === 'guest';

  return { 
    isAuthenticated, 
    timeRemaining, 
    userType,
    isAdmin,
    isUser,
    isGuest,
    loginAdmin,
    loginUser,
    registerUser,
    logout,
    // Manter compatibilidade com código existente
    login: loginAdmin
  };
};
