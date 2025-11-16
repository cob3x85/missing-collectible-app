/**
 * Database Service Proxy
 * 
 * Platform-aware database abstraction layer for Funko collection management.
 * Automatically selects the appropriate database implementation based on platform:
 * - Native (iOS/Android): SQLite via expo-sqlite
 * - Web: Web-compatible storage (future implementation)
 * 
 * Usage:
 * ```typescript
 * import { db } from '@/services/db';
 * 
 * // Initialize database (call once on app start)
 * await db.init();
 * 
 * // Create a Funko
 * const id = await db.createFunko({ name: "Spider-Man", ... });
 * 
 * // Get paginated results (for infinite scroll)
 * const funkos = await db.getFunkosPaginated(20, 0);
 * ```
 */

import { Funko } from "@/database/schema";
import { Platform } from "react-native";

// Import the appropriate database service based on platform
let databaseService: any;

if (Platform.OS === "web") {
  // Dynamic import for web database service
  import("./database.web").then((module) => {
    databaseService = module.databaseService;
  });
} else {
  // Use the native SQLite service for mobile platforms
  import("./database").then((module) => {
    databaseService = module.databaseService;
  });
}

// Common interface for database operations
/**
 * DatabaseServiceInterface
 * 
 * Defines the contract for all database service implementations.
 * Ensures consistent API across different platforms (native SQLite, web storage, etc.)
 */
export interface DatabaseServiceInterface {
  init(): Promise<void>;
  createFunko(
    funko: Omit<Funko, "id" | "created_at" | "updated_at">
  ): Promise<string>;
  getAllFunkos(): Promise<Funko[]>;
  getFunkosPaginated(limit: number, offset: number): Promise<Funko[]>;
  getTotalFunkosCount(): Promise<number>;
  getFunkoById(id: string): Promise<Funko | null>;
  updateFunko(
    id: string,
    updates: Partial<Omit<Funko, "id" | "created_at">>
  ): Promise<void>;
  deleteFunko(id: string): Promise<void>;
  searchFunkos(query: string): Promise<Funko[]>;
}

/**
 * DatabaseProxy
 * 
 * Proxy class that dynamically loads the correct database implementation
 * based on the current platform. All method calls are forwarded to the
 * underlying service once it's loaded.
 * 
 * This pattern allows for:
 * - Platform-specific optimizations
 * - Lazy loading of database modules
 * - Consistent API across platforms
 */
class DatabaseProxy implements DatabaseServiceInterface {
  private servicePromise: Promise<DatabaseServiceInterface>;

  constructor() {
    this.servicePromise = this.loadService();
  }

  /**
   * Ensures the correct database service is loaded based on platform
   * - Mobile (iOS/Android): Uses native SQLite via expo-sqlite
   * - Web: Uses web-compatible storage (not currently implemented)
   * @returns {Promise<DatabaseServiceInterface>} The loaded database service
   */
  private async loadService(): Promise<DatabaseServiceInterface> {
    const nativeModule = await import("./database");
    return nativeModule.databaseService;
  }

  /**
   * Initializes the database connection and creates tables if they don't exist
   * Must be called before any other database operations
   * @returns {Promise<void>}
   */
  async init(): Promise<void> {
    const service = await this.servicePromise;
    return service.init();
  }

  /**
   * Creates a new Funko entry in the database
   * @param {Omit<Funko, "id" | "created_at" | "updated_at">} funko - The Funko data to create
   * @returns {Promise<string>} The ID of the newly created Funko
   * @example
   * const id = await db.createFunko({
   *   name: "Spider-Man",
   *   series: "Marvel",
   *   number: "574",
   *   category: "Movies",
   *   condition: "mint",
   *   purchase_price: 15.99,
   *   current_value: 25.00,
   *   has_protector_case: true,
   *   image_paths: ["/path/to/image.jpg"]
   * });
   */
  async createFunko(
    funko: Omit<Funko, "id" | "created_at" | "updated_at">
  ): Promise<string> {
    const service = await this.servicePromise;
    return service.createFunko(funko);
  }

  /**
   * Retrieves all Funkos from the database, ordered by creation date (newest first)
   * @returns {Promise<Funko[]>} Array of all Funko entries
   */
  async getAllFunkos(): Promise<Funko[]> {
    const service = await this.servicePromise;
    return service.getAllFunkos();
  }

  /**
   * Retrieves a paginated list of Funkos for infinite scroll functionality
   * @param {number} limit - Number of items to retrieve per page (default: 20)
   * @param {number} offset - Starting position for pagination (0-based)
   * @returns {Promise<Funko[]>} Array of Funko entries for the requested page
   * @example
   * // First page (items 0-19)
   * const page1 = await db.getFunkosPaginated(20, 0);
   * // Second page (items 20-39)
   * const page2 = await db.getFunkosPaginated(20, 20);
   */
  async getFunkosPaginated(limit: number, offset: number): Promise<Funko[]> {
    const service = await this.servicePromise;
    return service.getFunkosPaginated(limit, offset);
  }

  /**
   * Gets the total count of Funkos in the database
   * Used for pagination calculations and collection statistics
   * @returns {Promise<number>} Total number of Funko entries
   */
  async getTotalFunkosCount(): Promise<number> {
    const service = await this.servicePromise;
    return service.getTotalFunkosCount();
  }

  /**
   * Retrieves a single Funko by its unique ID
   * @param {string} id - The unique identifier of the Funko
   * @returns {Promise<Funko | null>} The Funko entry if found, null otherwise
   */
  async getFunkoById(id: string): Promise<Funko | null> {
    const service = await this.servicePromise;
    return service.getFunkoById(id);
  }

  /**
   * Updates an existing Funko entry with partial data
   * Only provided fields will be updated, others remain unchanged
   * @param {string} id - The unique identifier of the Funko to update
   * @param {Partial<Omit<Funko, "id" | "created_at">>} updates - Fields to update
   * @returns {Promise<void>}
   * @example
   * await db.updateFunko("funko-123", {
   *   current_value: 30.00,
   *   condition: "near_mint"
   * });
   */
  async updateFunko(
    id: string,
    updates: Partial<Omit<Funko, "id" | "created_at">>
  ): Promise<void> {
    const service = await this.servicePromise;
    return service.updateFunko(id, updates);
  }

  /**
   * Deletes a Funko entry from the database
   * Note: Associated images must be deleted separately using the images service
   * @param {string} id - The unique identifier of the Funko to delete
   * @returns {Promise<void>}
   */
  async deleteFunko(id: string): Promise<void> {
    const service = await this.servicePromise;
    return service.deleteFunko(id);
  }

  /**
   * Searches Funkos by name, series, or number using fuzzy matching
   * Case-insensitive search across multiple fields
   * @param {string} query - The search term to match against
   * @returns {Promise<Funko[]>} Array of matching Funko entries
   * @example
   * // Search for "spider"
   * const results = await db.searchFunkos("spider");
   * // Returns: Spider-Man, Spider-Gwen, Miles Morales, etc.
   */
  async searchFunkos(query: string): Promise<Funko[]> {
    const service = await this.servicePromise;
    return service.searchFunkos(query);
  }
}

/**
 * Database instance - singleton proxy for all database operations
 * 
 * Import this instance to perform database operations throughout the app.
 * The proxy automatically handles platform detection and service loading.
 * 
 * @example
 * import { db } from '@/services/db';
 * 
 * // Initialize on app start
 * await db.init();
 * 
 * // CRUD operations
 * const id = await db.createFunko({ ... });
 * const funko = await db.getFunkoById(id);
 * await db.updateFunko(id, { current_value: 30 });
 * await db.deleteFunko(id);
 * 
 * // Search and pagination
 * const results = await db.searchFunkos("spider");
 * const page = await db.getFunkosPaginated(20, 0);
 */
export const db = new DatabaseProxy();
