
import { Video, Notification } from '../types';

export class VideoService {
  private static STORAGE_KEY = 'reelzone_videos';
  private static NOTIFICATIONS_KEY = 'reelzone_notifications';

  static getVideos(): Video[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static addVideo(video: Omit<Video, 'id' | 'created_at' | 'clicks'>): Video {
    const newVideo: Video = {
      ...video,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      clicks: 0,
    };

    const videos = this.getVideos();
    videos.unshift(newVideo);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(videos));
    
    // Adicionar notificação
    this.addNotification(`Novo ${video.category.toLowerCase()} "${video.title}" foi adicionado!`);
    
    return newVideo;
  }

  static updateVideo(id: string, updates: Partial<Omit<Video, 'id' | 'created_at'>>): boolean {
    const videos = this.getVideos();
    const index = videos.findIndex(v => v.id === id);
    
    if (index !== -1) {
      videos[index] = { ...videos[index], ...updates };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(videos));
      return true;
    }
    return false;
  }

  static deleteVideo(id: string): boolean {
    const videos = this.getVideos();
    const filtered = videos.filter(v => v.id !== id);
    
    if (filtered.length !== videos.length) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
      return true;
    }
    return false;
  }

  static getVideoById(id: string): Video | null {
    const videos = this.getVideos();
    return videos.find(v => v.id === id) || null;
  }

  static searchVideos(searchTerm: string): Video[] {
    const videos = this.getVideos();
    if (!searchTerm.trim()) return videos;
    
    const term = searchTerm.toLowerCase();
    return videos.filter(video => 
      video.title.toLowerCase().includes(term) ||
      video.description.toLowerCase().includes(term) ||
      video.tags.some(tag => tag.toLowerCase().includes(term)) ||
      video.category.toLowerCase().includes(term)
    );
  }

  static getVideosByCategory(category: 'Filme' | 'Série' | 'Documentário'): Video[] {
    const videos = this.getVideos();
    return videos.filter(video => video.category === category);
  }

  static getVideosByTag(tag: string): Video[] {
    const videos = this.getVideos();
    return videos.filter(video => 
      video.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
    );
  }

  static getRecentVideos(limit: number = 5): Video[] {
    const videos = this.getVideos();
    return videos
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  }

  static getTopVideos(limit: number = 5): Video[] {
    const videos = this.getVideos();
    return videos
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, limit);
  }

  static incrementClicks(id: string): boolean {
    const videos = this.getVideos();
    const video = videos.find(v => v.id === id);
    
    if (video) {
      video.clicks = (video.clicks || 0) + 1;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(videos));
      return true;
    }
    return false;
  }

  static getAllTags(): string[] {
    const videos = this.getVideos();
    const allTags = videos.flatMap(video => video.tags);
    return [...new Set(allTags)].sort();
  }

  // Sistema de notificações
  static addNotification(message: string): void {
    const notifications = this.getNotifications();
    const newNotification: Notification = {
      id: crypto.randomUUID(),
      message,
      timestamp: new Date().toISOString(),
      read: false,
    };

    notifications.unshift(newNotification);
    
    // Manter apenas as últimas 50 notificações
    if (notifications.length > 50) {
      notifications.splice(50);
    }

    localStorage.setItem(this.NOTIFICATIONS_KEY, JSON.stringify(notifications));
    
    // Disparar evento para atualizar UI
    window.dispatchEvent(new CustomEvent('newNotification'));
  }

  static getNotifications(): Notification[] {
    try {
      const stored = localStorage.getItem(this.NOTIFICATIONS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
}
