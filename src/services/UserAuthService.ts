
import { AdminSession } from '../types';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface UserSession {
  user: User;
  token: string;
  expiresAt: number;
}

export class UserAuthService {
  private static SESSION_KEY = 'reelzone_user_session';
  
  // Mock users database - em produção isso viria de um backend
  private static MOCK_USERS = [
    { id: '1', email: 'user@exemplo.com', password: '123456', name: 'Usuário Teste' },
    { id: '2', email: 'joao@email.com', password: 'senha123', name: 'João Silva' },
    { id: '3', email: 'maria@email.com', password: 'maria123', name: 'Maria Santos' }
  ];

  static login(email: string, password: string): { success: boolean; user?: User } {
    const user = this.MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (user) {
      const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 horas
      const userSession: UserSession = {
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        token: Date.now().toString(),
        expiresAt
      };
      
      sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(userSession));
      return { success: true, user: userSession.user };
    }
    
    return { success: false };
  }

  static register(email: string, password: string, name: string): { success: boolean; user?: User } {
    // Verificar se o email já existe
    const existingUser = this.MOCK_USERS.find(u => u.email === email);
    if (existingUser) {
      return { success: false };
    }

    // Criar novo usuário
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name
    };

    this.MOCK_USERS.push(newUser);

    // Fazer login automático após registro
    return this.login(email, password);
  }

  static logout(): void {
    sessionStorage.removeItem(this.SESSION_KEY);
  }

  static isAuthenticated(): boolean {
    try {
      const stored = sessionStorage.getItem(this.SESSION_KEY);
      if (!stored) return false;

      const session: UserSession = JSON.parse(stored);
      if (Date.now() > session.expiresAt) {
        this.logout();
        return false;
      }
      
      return true;
    } catch {
      return false;
    }
  }

  static getCurrentUser(): User | null {
    try {
      const stored = sessionStorage.getItem(this.SESSION_KEY);
      if (!stored) return null;

      const session: UserSession = JSON.parse(stored);
      if (Date.now() > session.expiresAt) {
        this.logout();
        return null;
      }
      
      return session.user;
    } catch {
      return null;
    }
  }

  static getTimeRemaining(): number {
    try {
      const stored = sessionStorage.getItem(this.SESSION_KEY);
      if (!stored) return 0;

      const session: UserSession = JSON.parse(stored);
      const remaining = session.expiresAt - Date.now();
      return Math.max(0, remaining);
    } catch {
      return 0;
    }
  }
}
