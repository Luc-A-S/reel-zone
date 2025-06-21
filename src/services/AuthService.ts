
import { AdminSession } from '../types';

export class AuthService {
  private static SESSION_KEY = 'reelzone_admin_session';
  private static CREDENTIALS = {
    email: 'r33lz0n3@admin.acess',
    password: 'Rz-4d@$>'
  };

  static login(email: string, password: string): boolean {
    if (email === this.CREDENTIALS.email && password === this.CREDENTIALS.password) {
      const expiresAt = Date.now() + (2 * 60 * 60 * 1000); // 2 hours
      const session: AdminSession = {
        token: Date.now().toString(),
        expiresAt
      };
      
      sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
      return true;
    }
    return false;
  }

  static logout(): void {
    sessionStorage.removeItem(this.SESSION_KEY);
  }

  static isAuthenticated(): boolean {
    try {
      const stored = sessionStorage.getItem(this.SESSION_KEY);
      if (!stored) return false;

      const session: AdminSession = JSON.parse(stored);
      if (Date.now() > session.expiresAt) {
        this.logout();
        return false;
      }
      
      return true;
    } catch {
      return false;
    }
  }

  static getTimeRemaining(): number {
    try {
      const stored = sessionStorage.getItem(this.SESSION_KEY);
      if (!stored) return 0;

      const session: AdminSession = JSON.parse(stored);
      const remaining = session.expiresAt - Date.now();
      return Math.max(0, remaining);
    } catch {
      return 0;
    }
  }
}
