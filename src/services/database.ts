import { Funko } from "@/database/schema";
import * as SQLite from "expo-sqlite";
import { Platform } from "react-native";
import { v4 as uuidv4 } from "uuid";

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async init(): Promise<void> {
    // Skip SQLite initialization on web to avoid WASM issues
    if (Platform.OS === "web") {
      console.warn("SQLite not supported on web, using IndexedDB fallback");
      return;
    }

    this.db = await SQLite.openDatabaseAsync("funko_collection.db");
    await this.createTables();
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    // Create Funkos table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS funkos (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        series TEXT NOT NULL,
        number TEXT NOT NULL,
        category TEXT NOT NULL,
        condition TEXT CHECK(condition IN ('mint', 'near_mint', 'good', 'fair', 'poor')) NOT NULL,
        size TEXT CHECK(size IN ('standard', 'super_sized', 'jumbo')) DEFAULT 'standard',
        type TEXT CHECK(type IN ('standard_pop', 'pop_ride', 'pop_town', 'pop_moment', 'pop_album', 'pop_comic_cover', 'pop_deluxe', 'pop_2pack', 'pop_3pack', 'pop_keychain', 'pop_tee', 'soda', 'vinyl_gold', 'other')) DEFAULT 'standard_pop',
        variant TEXT CHECK(variant IN ('normal', 'chase', 'chrome', 'flocked', 'glow_in_the_dark', 'metallic', 'translucent', 'glitter', 'blacklight', 'diamond', 'scented', 'exclusive', 'limited_edition', 'other')) DEFAULT 'normal',
        purchase_price REAL,
        current_value REAL,
        purchase_date TEXT,
        notes TEXT,
        has_protector_case INTEGER DEFAULT 0,
        image_path TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    // Migration: Add has_protector_case column if it doesn't exist
    try {
      await this.db.execAsync(`
        ALTER TABLE funkos ADD COLUMN has_protector_case INTEGER DEFAULT 0;
      `);
    } catch (error) {
      // Column already exists, ignore error
      if (!(error as Error).message.includes("duplicate column name")) {
        console.error("Migration error:", error);
      }
    }

    // Migration: Add size column if it doesn't exist
    try {
      await this.db.execAsync(`
        ALTER TABLE funkos ADD COLUMN size TEXT CHECK(size IN ('standard', 'super_sized', 'jumbo')) DEFAULT 'standard';
      `);
    } catch (error) {
      // Column already exists, ignore error
      if (!(error as Error).message.includes("duplicate column name")) {
        console.error("Migration error (size):", error);
      }
    }

    // Migration: Add type column if it doesn't exist
    try {
      await this.db.execAsync(`
        ALTER TABLE funkos ADD COLUMN type TEXT CHECK(type IN ('standard_pop', 'pop_ride', 'pop_town', 'pop_moment', 'pop_album', 'pop_comic_cover', 'pop_deluxe', 'pop_2pack', 'pop_3pack', 'pop_keychain', 'pop_tee', 'soda', 'vinyl_gold', 'other')) DEFAULT 'standard_pop';
      `);
    } catch (error) {
      // Column already exists, ignore error
      if (!(error as Error).message.includes("duplicate column name")) {
        console.error("Migration error (type):", error);
      }
    }

    // Migration: Add variant column if it doesn't exist
    try {
      await this.db.execAsync(`
        ALTER TABLE funkos ADD COLUMN variant TEXT CHECK(variant IN ('normal', 'chase', 'chrome', 'flocked', 'glow_in_the_dark', 'metallic', 'translucent', 'glitter', 'blacklight', 'diamond', 'scented', 'exclusive', 'limited_edition', 'other')) DEFAULT 'normal';
      `);
    } catch (error) {
      // Column already exists, ignore error
      if (!(error as Error).message.includes("duplicate column name")) {
        console.error("Migration error (variant):", error);
      }
    }

    // Create Collections table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS collections (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    // Create junction table for collections and funkos
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS collection_items (
        collection_id TEXT,
        funko_id TEXT,
        added_at TEXT NOT NULL,
        PRIMARY KEY (collection_id, funko_id),
        FOREIGN KEY (collection_id) REFERENCES collections (id) ON DELETE CASCADE,
        FOREIGN KEY (funko_id) REFERENCES funkos (id) ON DELETE CASCADE
      );
    `);
  }

  // Funko CRUD operations
  async createFunko(
    funko: Omit<Funko, "id" | "created_at" | "updated_at">
  ): Promise<string> {
    if (Platform.OS === "web") {
      throw new Error("Web platform should use database.web.ts service");
    }

    if (!this.db) throw new Error("Database not initialized");

    const id = uuidv4();
    const now = new Date().toISOString();

    await this.db.runAsync(
      `INSERT INTO funkos (
        id, name, series, number, category, condition, size, type, variant,
        purchase_price, current_value, purchase_date, notes, has_protector_case, image_path,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        funko.name,
        funko.series ?? null,
        funko.number ?? null,
        funko.category ?? null,
        funko.condition ?? null,
        funko.size ?? "standard",
        funko.type ?? "standard_pop",
        funko.variant ?? "normal",
        funko.purchase_price ?? null,
        funko.current_value ?? null,
        funko.purchase_date ?? null,
        funko.notes ?? null,
        funko.has_protector_case ? 1 : 0,
        funko.image_paths && funko.image_paths.length > 0
          ? JSON.stringify(funko.image_paths)
          : null,
        now,
        now,
      ]
    );

    return id;
  }

  async getAllFunkos(): Promise<Funko[]> {
    if (!this.db) throw new Error("Database not initialized");

    const result = await this.db.getAllAsync(
      "SELECT * FROM funkos ORDER BY CAST(number AS INTEGER) ASC"
    );

    // Convert image_path to image_paths array (handle both JSON string and single path)
    return (result as any[]).map((funko) => {
      let image_paths: string[] | undefined;

      if (funko.image_path) {
        try {
          // Try to parse as JSON array
          image_paths = JSON.parse(funko.image_path);
        } catch {
          // If not JSON, treat as single path
          image_paths = [funko.image_path];
        }
      }

      return {
        ...funko,
        image_paths,
      };
    }) as Funko[];
  }

  async getFunkosPaginated(limit: number, offset: number): Promise<Funko[]> {
    if (!this.db) throw new Error("Database not initialized");

    const result = await this.db.getAllAsync(
      "SELECT * FROM funkos ORDER BY CAST(number AS INTEGER) ASC LIMIT ? OFFSET ?",
      [limit, offset]
    );

    // Convert image_path to image_paths array (handle both JSON string and single path)
    return (result as any[]).map((funko) => {
      let image_paths: string[] | undefined;

      if (funko.image_path) {
        try {
          // Try to parse as JSON array
          image_paths = JSON.parse(funko.image_path);
        } catch {
          // If not JSON, treat as single path
          image_paths = [funko.image_path];
        }
      }

      return {
        ...funko,
        has_protector_case: funko.has_protector_case === 1,
        image_paths,
      };
    }) as Funko[];
  }

  async getTotalFunkosCount(): Promise<number> {
    if (!this.db) throw new Error("Database not initialized");

    const result = await this.db.getFirstAsync(
      "SELECT COUNT(*) as count FROM funkos"
    );
    return (result as any)?.count || 0;
  }

  async getFunkoById(id: string): Promise<Funko | null> {
    if (!this.db) throw new Error("Database not initialized");

    const result = await this.db.getFirstAsync(
      "SELECT * FROM funkos WHERE id = ?",
      [id]
    );

    if (!result) return null;

    // Convert image_path to image_paths array (handle both JSON string and single path)
    const funko = result as any;
    let image_paths: string[] | undefined;

    if (funko.image_path) {
      try {
        // Try to parse as JSON array
        image_paths = JSON.parse(funko.image_path);
      } catch {
        // If not JSON, treat as single path
        image_paths = [funko.image_path];
      }
    }

    return {
      ...funko,
      has_protector_case: funko.has_protector_case === 1,
      image_paths,
    } as Funko;
  }

  /*
   * Retrieve all funkos matching a given name or partial name or funko number
   */
  async getAllFunkoByName(name: string): Promise<Funko[] | []> {
    if (!this.db) throw new Error("Database not initialized");
    const result = await this.db.getAllAsync(
      "SELECT * FROM funkos WHERE name LIKE ? OR number LIKE ? ORDER BY created_at DESC",
      [`%${name}%`, `%${name}%`]
    );

    // Convert image_path to image_paths array (handle both JSON string and single path)
    return (result as any[]).map((funko) => {
      let image_paths: string[] | undefined;

      if (funko.image_path) {
        try {
          // Try to parse as JSON array
          image_paths = JSON.parse(funko.image_path);
        } catch {
          // If not JSON, treat as single path
          image_paths = [funko.image_path];
        }
      }

      return {
        ...funko,
        has_protector_case: funko.has_protector_case === 1,
        image_paths,
      };
    }) as Funko[];
  }

  async updateFunko(
    id: string,
    updates: Partial<Omit<Funko, "id" | "created_at">>
  ): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    const now = new Date().toISOString();
    // Whitelist allowed fields for update
    const allowedFields = [
      "name",
      "series",
      "number",
      "category",
      "condition",
      "size",
      "type",
      "variant",
      "purchase_price",
      "current_value",
      "purchase_date",
      "notes",
      "has_protector_case",
      "image_paths",
    ];

    // Filter updates to only allowed fields and transform them
    const filteredUpdates: Record<string, any> = {};
    for (const key of Object.keys(updates)) {
      if (allowedFields.includes(key)) {
        let value = (updates as any)[key];

        // Transform fields to match database format
        if (key === "image_paths") {
          // Convert image_paths array to image_path JSON string for database
          // Handle undefined, null, empty array, or valid array
          if (Array.isArray(value) && value.length > 0) {
            filteredUpdates["image_path"] = JSON.stringify(value);
          } else {
            // Set to null when no images (undefined, null, or empty array)
            filteredUpdates["image_path"] = null;
          }
        } else if (key === "has_protector_case" && typeof value === "boolean") {
          // Convert boolean to INTEGER for SQLite
          const intValue = value ? 1 : 0;
          filteredUpdates[key] = intValue;
        } else {
          filteredUpdates[key] = value;
        }
      }
    }

    const fields = Object.keys(filteredUpdates);
    if (fields.length === 0) return;

    const values = Object.values(filteredUpdates);
    const setClause = fields.map((field) => `${field} = ?`).join(", ");

    await this.db.runAsync(
      `UPDATE funkos SET ${setClause}, updated_at = ? WHERE id = ?`,
      [...values, now, id]
    );
  }
  async deleteFunko(id: string): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    await this.db.runAsync("DELETE FROM funkos WHERE id = ?", [id]);
  }

  async deleteAllFunkos(): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    await this.db.runAsync("DELETE FROM funkos");
  }

  async searchFunkos(query: string): Promise<Funko[]> {
    if (!this.db) throw new Error("Database not initialized");

    const result = await this.db.getAllAsync(
      `SELECT * FROM funkos 
       WHERE name LIKE ? OR series LIKE ? OR category LIKE ? OR number LIKE ?
       ORDER BY created_at DESC`,
      [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]
    );

    // Convert image_path to image_paths array (handle both JSON string and single path)
    return (result as any[]).map((funko) => {
      let image_paths: string[] | undefined;

      if (funko.image_path) {
        try {
          // Try to parse as JSON array
          image_paths = JSON.parse(funko.image_path);
        } catch {
          // If not JSON, treat as single path
          image_paths = [funko.image_path];
        }
      }

      return {
        ...funko,
        has_protector_case: funko.has_protector_case === 1,
        image_paths,
      };
    }) as Funko[];
  }
}

export const databaseService = new DatabaseService();
