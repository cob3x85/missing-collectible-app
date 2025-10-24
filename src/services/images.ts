import { Platform } from "react-native";

// Common interface for image storage operations
export interface ImageStorageServiceInterface {
  pickImageFromLibrary(): Promise<string | null>;
  takePhoto(): Promise<string | null>;
  saveImage(uri: string): Promise<string>;
  getImageUri(imageId: string): Promise<string | null>;
  deleteImage(imageId: string): Promise<void>;
}

// Create a proxy that loads the appropriate service
class ImageStorageProxy implements ImageStorageServiceInterface {
  private servicePromise: Promise<ImageStorageServiceInterface>;

  constructor() {
    this.servicePromise = this.loadService();
  }

  private async loadService(): Promise<ImageStorageServiceInterface> {
    if (Platform.OS === "web") {
      const webModule = await import("./imageStorage.web");
      return webModule.imageStorageService;
    } else {
      const nativeModule = await import("./imageStorage");
      return nativeModule.imageStorageService;
    }
  }

  async pickImageFromLibrary(): Promise<string | null> {
    const service = await this.servicePromise;
    return service.pickImageFromLibrary();
  }

  async takePhoto(): Promise<string | null> {
    const service = await this.servicePromise;
    return service.takePhoto();
  }

  async saveImage(uri: string): Promise<string> {
    const service = await this.servicePromise;
    return service.saveImage(uri);
  }

  async getImageUri(imageId: string): Promise<string | null> {
    const service = await this.servicePromise;
    return service.getImageUri(imageId);
  }

  async deleteImage(imageId: string): Promise<void> {
    const service = await this.servicePromise;
    return service.deleteImage(imageId);
  }
}

export const images = new ImageStorageProxy();
