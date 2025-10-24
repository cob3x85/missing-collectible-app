// Web-compatible image storage service using Web APIs
class WebImageStorageService {
  private dbName = "funko_images_db";
  private dbVersion = 1;
  private db: IDBDatabase | null = null;
  private isInitialized = false;

  constructor() {
    // Only initialize in browser environment
    if (typeof window !== "undefined") {
      this.initDB().catch(console.error);
    }
  }

  private async initDB(): Promise<void> {
    // Skip initialization on server-side rendering
    if (typeof window === "undefined" || typeof indexedDB === "undefined") {
      console.warn(
        "IndexedDB not available, skipping image storage initialization"
      );
      return;
    }

    if (this.isInitialized) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error("Error creating images database:", request.error);
        reject(new Error("Failed to open images database"));
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.isInitialized = true;
        resolve();
      };

      request.onupgradeneeded = () => {
        const db = request.result;

        // Create images store
        if (!db.objectStoreNames.contains("images")) {
          db.createObjectStore("images", { keyPath: "id" });
        }
      };
    });
  }

  async pickImageFromLibrary(): Promise<string | null> {
    // Check if running in browser
    if (typeof window === "undefined" || typeof document === "undefined") {
      console.warn("File picker not available in server environment");
      return null;
    }

    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.style.display = "none";

      input.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          try {
            const imageId = await this.saveImageFile(file);
            resolve(imageId);
          } catch (error) {
            console.error("Error saving image:", error);
            resolve(null);
          }
        } else {
          resolve(null);
        }
        document.body.removeChild(input);
      };

      input.oncancel = () => {
        document.body.removeChild(input);
        resolve(null);
      };

      document.body.appendChild(input);
      input.click();
    });
  }

  async takePhoto(): Promise<string | null> {
    // Check if running in browser
    if (typeof window === "undefined" || typeof document === "undefined") {
      console.warn("Camera not available in server environment");
      return null;
    }

    // For web, we'll use the same file picker but with camera capture preference
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.capture = "environment"; // Use rear camera
      input.style.display = "none";

      input.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          try {
            const imageId = await this.saveImageFile(file);
            resolve(imageId);
          } catch (error) {
            console.error("Error saving image:", error);
            resolve(null);
          }
        } else {
          resolve(null);
        }
        document.body.removeChild(input);
      };

      input.oncancel = () => {
        document.body.removeChild(input);
        resolve(null);
      };

      document.body.appendChild(input);
      input.click();
    });
  }

  private async saveImageFile(file: File): Promise<string> {
    if (!this.db && !this.isInitialized) {
      await this.initDB();
    }

    if (!this.db) {
      throw new Error("Database not available");
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const imageId = Date.now().toString();
        const imageData = {
          id: imageId,
          data: reader.result as string,
          filename: file.name,
          type: file.type,
          size: file.size,
          created_at: new Date().toISOString(),
        };

        const transaction = this.db!.transaction(["images"], "readwrite");
        const store = transaction.objectStore("images");
        const request = store.add(imageData);

        request.onsuccess = () => resolve(imageId);
        request.onerror = () => reject(new Error("Failed to save image"));
      };

      reader.onerror = () => reject(new Error("Failed to read image file"));
      reader.readAsDataURL(file);
    });
  }

  async saveImage(uri: string): Promise<string> {
    // For web, the uri would typically be a blob URL or data URL
    // We'll generate a unique ID and store the URI
    const imageId = Date.now().toString();

    if (!this.db && !this.isInitialized) {
      await this.initDB();
    }

    if (!this.db) {
      throw new Error("Database not available");
    }

    return new Promise((resolve, reject) => {
      const imageData = {
        id: imageId,
        data: uri,
        created_at: new Date().toISOString(),
      };

      const transaction = this.db!.transaction(["images"], "readwrite");
      const store = transaction.objectStore("images");
      const request = store.add(imageData);

      request.onsuccess = () => resolve(imageId);
      request.onerror = () => reject(new Error("Failed to save image"));
    });
  }

  async getImageUri(imageId: string): Promise<string | null> {
    if (!this.db && !this.isInitialized) {
      await this.initDB();
    }

    if (!this.db) {
      console.warn("Database not available for image retrieval");
      return null;
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["images"], "readonly");
      const store = transaction.objectStore("images");
      const request = store.get(imageId);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.data : null);
      };

      request.onerror = () => reject(new Error("Failed to get image"));
    });
  }

  async deleteImage(imageId: string): Promise<void> {
    if (!this.db && !this.isInitialized) {
      await this.initDB();
    }

    if (!this.db) {
      console.warn("Database not available for image deletion");
      return;
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["images"], "readwrite");
      const store = transaction.objectStore("images");
      const request = store.delete(imageId);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error("Failed to delete image"));
    });
  }
}

export const imageStorageService = new WebImageStorageService();
