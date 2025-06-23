
export class FavoritesService {
  private static STORAGE_KEY = 'reelzone_favorites';

  static getFavorites(): string[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static addFavorite(videoId: string): boolean {
    const favorites = this.getFavorites();
    if (!favorites.includes(videoId)) {
      favorites.push(videoId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
      return true;
    }
    return false;
  }

  static removeFavorite(videoId: string): boolean {
    const favorites = this.getFavorites();
    const filtered = favorites.filter(id => id !== videoId);
    
    if (filtered.length !== favorites.length) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
      return true;
    }
    return false;
  }

  static isFavorite(videoId: string): boolean {
    const favorites = this.getFavorites();
    return favorites.includes(videoId);
  }

  static toggleFavorite(videoId: string): boolean {
    if (this.isFavorite(videoId)) {
      this.removeFavorite(videoId);
      return false;
    } else {
      this.addFavorite(videoId);
      return true;
    }
  }
}
