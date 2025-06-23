
export interface Video {
  id: string;
  title: string;
  description: string;
  cover: string;
  video_url: string;
  category: 'Filme' | 'Série' | 'Documentário';
  tags: string[];
  created_at: string;
  clicks: number;
}

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface AdminSession {
  token: string;
  expiresAt: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface UserSession {
  user: User;
  token: string;
  expiresAt: number;
}

export type AuthUser = User | null;
