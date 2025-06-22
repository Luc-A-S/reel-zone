
import { Video } from '../types';

export class VideoService {
  private static STORAGE_KEY = 'reelzone_videos';
  private static FEATURED_KEY = 'reelzone_featured';

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
      
      // Remove from featured if it's the featured video
      const featuredId = this.getFeaturedVideoId();
      if (featuredId === id) {
        this.removeFeaturedVideo();
      }
      
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

  // Featured video methods
  static setFeaturedVideo(videoId: string): boolean {
    const video = this.getVideoById(videoId);
    if (video) {
      localStorage.setItem(this.FEATURED_KEY, videoId);
      return true;
    }
    return false;
  }

  static getFeaturedVideoId(): string | null {
    return localStorage.getItem(this.FEATURED_KEY);
  }

  static getFeaturedVideo(): Video | null {
    const featuredId = this.getFeaturedVideoId();
    if (!featuredId) return null;
    
    return this.getVideoById(featuredId);
  }

  static removeFeaturedVideo(): void {
    localStorage.removeItem(this.FEATURED_KEY);
  }

  // Método específico para adicionar conteúdo diretamente como destaque
  static addFeaturedContent(video: Omit<Video, 'id' | 'created_at'>): Video {
    // Adiciona o vídeo à lista geral
    const newVideo = this.addVideo(video);
    // Define ele como o vídeo em destaque (substitui o anterior se existir)
    this.setFeaturedVideo(newVideo.id);
    return newVideo;
  }

  // Método para atualizar conteúdo em destaque
  static updateFeaturedContent(video: Omit<Video, 'id' | 'created_at'>): boolean {
    const featuredId = this.getFeaturedVideoId();
    if (featuredId) {
      return this.updateVideo(featuredId, video);
    }
    return false;
  }
}
