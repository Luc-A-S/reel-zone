
import { Video } from '../types';

export class VideoService {
  private static STORAGE_KEY = 'reelzone_videos';

  static getVideos(): Video[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static addVideo(video: Omit<Video, 'id' | 'created_at'>): Video {
    const newVideo: Video = {
      ...video,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };

    const videos = this.getVideos();
    videos.unshift(newVideo);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(videos));
    
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
      video.tags.some(tag => tag.toLowerCase().includes(term))
    );
  }
}
