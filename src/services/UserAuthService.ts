
import { User, UserSession } from '../types';

export class UserAuthService {
  private static SESSION_KEY = 'reelzone_user_session';
  private static USERS_KEY = 'reelzone_users';

  static getUsers(): User[] {
    try {
      const stored = localStorage.getItem(this.USERS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static saveUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  static register(name: string, email: string, password: string): { success: boolean; message: string; user?: User } {
    const users = this.getUsers();
    
    // Verificar se o email já existe
    if (users.find(user => user.email === email)) {
      return { success: false, message: 'Este email já está cadastrado' };
    }

    // Criar novo usuário
    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      created_at: new Date().toISOString()
    };

    // Salvar senha (em produção seria hasheada)
    const userData = { ...newUser, password };
    users.push(userData);
    this.saveUsers(users);

    return { success: true, message: 'Conta criada com sucesso!', user: newUser };
  }

  static login(email: string, password: string): { success: boolean; message: string; user?: User } {
    const users = this.getUsers();
    const userData = users.find(user => user.email === email && (user as any).password === password);

    if (!userData) {
      return { success: false, message: 'Email ou senha incorretos' };
    }

    const { password: _, ...user } = userData as any;
    
    const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 horas
    const session: UserSession = {
      user,
      token: Date.now().toString(),
      expiresAt
    };
    
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    return { success: true, message: 'Login realizado com sucesso!', user };
  }

  static logout(): void {
    sessionStorage.removeItem(this.SESSION_KEY);
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

  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
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
