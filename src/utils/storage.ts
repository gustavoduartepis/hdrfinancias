// Utility for robust data persistence
export class StorageService {
  private static isStorageAvailable(type: 'localStorage' | 'sessionStorage'): boolean {
    try {
      const storage = window[type];
      const test = '__storage_test__';
      storage.setItem(test, test);
      storage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  private static getAvailableStorage(): Storage | null {
    if (this.isStorageAvailable('localStorage')) {
      return localStorage;
    }
    if (this.isStorageAvailable('sessionStorage')) {
      return sessionStorage;
    }
    return null;
  }

  static setItem(key: string, value: any): boolean {
    try {
      const storage = this.getAvailableStorage();
      if (!storage) {
        console.warn('Nenhum storage disponível, dados não serão persistidos');
        return false;
      }
      
      const serializedValue = JSON.stringify(value);
      storage.setItem(key, serializedValue);
      
      // Verificar se foi salvo corretamente
      const saved = storage.getItem(key);
      return saved === serializedValue;
    } catch (error) {
      console.error('Erro ao salvar no storage:', error);
      return false;
    }
  }

  static getItem<T>(key: string, defaultValue: T | null = null): T | null {
    try {
      const storage = this.getAvailableStorage();
      if (!storage) {
        return defaultValue;
      }
      
      const item = storage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      
      return JSON.parse(item) as T;
    } catch (error) {
      console.error('Erro ao carregar do storage:', error);
      return defaultValue;
    }
  }

  static removeItem(key: string): boolean {
    try {
      const storage = this.getAvailableStorage();
      if (!storage) {
        return false;
      }
      
      storage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Erro ao remover do storage:', error);
      return false;
    }
  }

  static clear(): boolean {
    try {
      const storage = this.getAvailableStorage();
      if (!storage) {
        return false;
      }
      
      storage.clear();
      return true;
    } catch (error) {
      console.error('Erro ao limpar storage:', error);
      return false;
    }
  }

  static getStorageInfo(): { type: string; available: boolean; size?: number } {
    const localStorage = this.isStorageAvailable('localStorage');
    const sessionStorage = this.isStorageAvailable('sessionStorage');
    
    if (localStorage) {
      try {
        const used = JSON.stringify(window.localStorage).length;
        return { type: 'localStorage', available: true, size: used };
      } catch {
        return { type: 'localStorage', available: true };
      }
    }
    
    if (sessionStorage) {
      return { type: 'sessionStorage', available: true };
    }
    
    return { type: 'none', available: false };
  }
}