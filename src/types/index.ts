
export interface Video {
  id: string;
  url: string;
  cover: string;
  title: string;
  description: string;
  tags: string[];
  created_at: string;
}

export interface AdminSession {
  token: string;
  expiresAt: number;
}
