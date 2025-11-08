import { Funko } from "@/database/schema";
import { v4 as uuidv4 } from "uuid";

// Web-compatible database service using IndexedDB
class WebDatabaseService {
  private dbName = "funko_collection_db";
  private dbVersion = 1;
  private db: IDBDatabase | null = null;
  private isInitialized = false;

  async init(): Promise<void> {
    // Skip initialization on server-side rendering
    if (typeof window === "undefined" || typeof indexedDB === "undefined") {
      console.warn("IndexedDB not available, skipping database initialization");
      return;
    }

    if (this.isInitialized) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        reject(new Error("Failed to open IndexedDB"));
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.isInitialized = true;
        resolve();
      };

      request.onupgradeneeded = () => {
        const db = request.result;

        // Create Funkos store
        if (!db.objectStoreNames.contains("funkos")) {
          const funkoStore = db.createObjectStore("funkos", { keyPath: "id" });
          funkoStore.createIndex("name", "name", { unique: false });
          funkoStore.createIndex("series", "series", { unique: false });
          funkoStore.createIndex("category", "category", { unique: false });
        }

        // Create Collections store
        if (!db.objectStoreNames.contains("collections")) {
          db.createObjectStore("collections", { keyPath: "id" });
        }

        // Create Collection Items store
        if (!db.objectStoreNames.contains("collection_items")) {
          const collectionItemsStore = db.createObjectStore(
            "collection_items",
            { keyPath: ["collection_id", "funko_id"] }
          );
          collectionItemsStore.createIndex("collection_id", "collection_id", {
            unique: false,
          });
          collectionItemsStore.createIndex("funko_id", "funko_id", {
            unique: false,
          });
        }
      };
    });
  }

  private getStore(
    storeName: string,
    mode: IDBTransactionMode = "readonly"
  ): IDBObjectStore {
    if (!this.db)
      throw new Error("Database not initialized - call init() first");

    const transaction = this.db.transaction([storeName], mode);
    return transaction.objectStore(storeName);
  }

  async createFunko(
    funko: Omit<Funko, "id" | "created_at" | "updated_at">
  ): Promise<string> {
    const id = uuidv4();
    const now = new Date().toISOString();

    const newFunko: Funko = {
      id,
      ...funko,
      created_at: now,
      updated_at: now,
    };

    return new Promise((resolve, reject) => {
      const store = this.getStore("funkos", "readwrite");
      const request = store.add(newFunko);

      request.onsuccess = () => resolve(id);
      request.onerror = () => reject(new Error("Failed to create funko"));
    });
  }

  async getAllFunkos(): Promise<Funko[]> {
    return new Promise((resolve, reject) => {
      const store = this.getStore("funkos");
      const request = store.getAll();

      request.onsuccess = () => {
        const funkos = request.result;
        // Sort by created_at desc
        funkos.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        resolve(funkos);
      };
      request.onerror = () => reject(new Error("Failed to get funkos"));
    });
  }

  async getFunkoById(id: string): Promise<Funko | null> {
    return new Promise((resolve, reject) => {
      const store = this.getStore("funkos");
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(new Error("Failed to get funko"));
    });
  }

  async updateFunko(
    id: string,
    updates: Partial<Omit<Funko, "id" | "created_at">>
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const existingFunko = await this.getFunkoById(id);
        if (!existingFunko) {
          reject(new Error("Funko not found"));
          return;
        }

        const updatedFunko: Funko = {
          ...existingFunko,
          ...updates,
          updated_at: new Date().toISOString(),
        };

        const store = this.getStore("funkos", "readwrite");
        const request = store.put(updatedFunko);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(new Error("Failed to update funko"));
      } catch (error) {
        reject(error);
      }
    });
  }

  async deleteFunko(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getStore("funkos", "readwrite");
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error("Failed to delete funko"));
    });
  }

  async searchFunkos(query: string): Promise<Funko[]> {
    const allFunkos = await this.getAllFunkos();
    const lowercaseQuery = query.toLowerCase();

    return allFunkos.filter(
      (funko) =>
        funko.name.toLowerCase().includes(lowercaseQuery) ||
        funko.number?.toLowerCase().includes(lowercaseQuery) ||
        funko.series?.toLowerCase().includes(lowercaseQuery) ||
        funko.category?.toLowerCase().includes(lowercaseQuery)
    );
  }
}

export const databaseService = new WebDatabaseService();
