/**
 * Database Service Proxy
 *
 * Database abstraction layer for Funko collection management.
 * Uses native SQLite via expo-sqlite for iOS and Android platforms.
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
import { databaseService } from "./database";

// Common interface for database operations
/**
 * DatabaseServiceInterface
 *
 * Defines the contract for database service implementation.
 * All operations use native SQLite on iOS and Android.
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
 * Database instance - direct access to SQLite database operations
 *
 * Import this instance to perform database operations throughout the app.
 * Uses native SQLite on iOS and Android via expo-sqlite.
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
export const db = databaseService;
