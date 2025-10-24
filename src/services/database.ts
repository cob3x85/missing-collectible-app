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
        purchase_price REAL,
        current_value REAL,
        purchase_date TEXT,
        notes TEXT,
        image_path TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

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
        id, name, series, number, category, condition, 
        purchase_price, current_value, purchase_date, notes, image_path,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        funko.name,
        funko.series,
        funko.number,
        funko.category,
        funko.condition,
        funko.purchase_price ?? null,
        funko.current_value ?? null,
        funko.purchase_date ?? null,
        funko.notes ?? null,
        funko.image_path ?? null,
        now,
        now,
      ]
    );

    return id;
  }

  async getAllFunkos(): Promise<Funko[]> {
    if (!this.db) throw new Error("Database not initialized");

    const result = await this.db.getAllAsync(
      "SELECT * FROM funkos ORDER BY created_at DESC"
    );
    return result as Funko[];
  }

  async getFunkoById(id: string): Promise<Funko | null> {
    if (!this.db) throw new Error("Database not initialized");

    const result = await this.db.getFirstAsync(
      "SELECT * FROM funkos WHERE id = ?",
      [id]
    );
    return result as Funko | null;
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
      "purchase_price",
      "current_value",
      "purchase_date",
      "notes",
      "image_path",
    ];

    // Filter updates to only allowed fields
    const filteredUpdates: Record<string, any> = {};
    for (const key of Object.keys(updates)) {
      if (allowedFields.includes(key)) {
        filteredUpdates[key] = (updates as any)[key];
      }
    }

    const fields = Object.keys(filteredUpdates);
    if (fields.length === 0) return; // Nothing to update

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

  async searchFunkos(query: string): Promise<Funko[]> {
    if (!this.db) throw new Error("Database not initialized");

    const result = await this.db.getAllAsync(
      `SELECT * FROM funkos 
       WHERE name LIKE ? OR series LIKE ? OR category LIKE ? 
       ORDER BY created_at DESC`,
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );
    return result as Funko[];
  }
}

export const databaseService = new DatabaseService();
