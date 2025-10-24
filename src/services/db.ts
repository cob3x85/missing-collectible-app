import { Platform } from 'react-native';
import { Funko } from '@/database/schema';

// Import the appropriate database service based on platform
let databaseService: any;

if (Platform.OS === 'web') {
  // Dynamic import for web database service
  import('./database.web').then(module => {
    databaseService = module.databaseService;
  });
} else {
  // Use the native SQLite service for mobile platforms
  import('./database').then(module => {
    databaseService = module.databaseService;
  });
}

// Common interface for database operations
export interface DatabaseServiceInterface {
  init(): Promise<void>;
  createFunko(funko: Omit<Funko, 'id' | 'created_at' | 'updated_at'>): Promise<string>;
  getAllFunkos(): Promise<Funko[]>;
  getFunkoById(id: string): Promise<Funko | null>;
  updateFunko(id: string, updates: Partial<Omit<Funko, 'id' | 'created_at'>>): Promise<void>;
  deleteFunko(id: string): Promise<void>;
  searchFunkos(query: string): Promise<Funko[]>;
}

// Create a proxy that waits for the appropriate service to load
class DatabaseProxy implements DatabaseServiceInterface {
  private servicePromise: Promise<DatabaseServiceInterface>;

  constructor() {
    this.servicePromise = this.loadService();
  }

  private async loadService(): Promise<DatabaseServiceInterface> {
    if (Platform.OS === 'web') {
      const webModule = await import('./database.web');
      return webModule.databaseService;
    } else {
      const nativeModule = await import('./database');
      return nativeModule.databaseService;
    }
  }

  async init(): Promise<void> {
    const service = await this.servicePromise;
    return service.init();
  }

  async createFunko(funko: Omit<Funko, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    const service = await this.servicePromise;
    return service.createFunko(funko);
  }

  async getAllFunkos(): Promise<Funko[]> {
    const service = await this.servicePromise;
    return service.getAllFunkos();
  }

  async getFunkoById(id: string): Promise<Funko | null> {
    const service = await this.servicePromise;
    return service.getFunkoById(id);
  }

  async updateFunko(id: string, updates: Partial<Omit<Funko, 'id' | 'created_at'>>): Promise<void> {
    const service = await this.servicePromise;
    return service.updateFunko(id, updates);
  }

  async deleteFunko(id: string): Promise<void> {
    const service = await this.servicePromise;
    return service.deleteFunko(id);
  }

  async searchFunkos(query: string): Promise<Funko[]> {
    const service = await this.servicePromise;
    return service.searchFunkos(query);
  }
}

export const db = new DatabaseProxy();