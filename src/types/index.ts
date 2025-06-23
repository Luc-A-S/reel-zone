
export interface Video {
  id: string;
  url: string;
  cover: string;
  title: string;
  description: string;
  tags: string[];
  created_at: string;
  category: 'Filme' | 'Série' | 'Documentário';
  clicks: number;
  // Campos específicos para séries
  season?: number;
  episode?: number;
  episodeTitle?: string;
  episodeCover?: string;
  episodeDescription?: string;
  episodes?: Episode[];
}

export interface Episode {
  id: string;
  season: number;
  episode: number;
  title: string;
  description: string;
  cover: string;
  url: string;
}

export interface AdminSession {
  token: string;
  expiresAt: number;
}

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
}
