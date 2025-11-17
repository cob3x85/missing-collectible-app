import { imageStorageService } from "./imageStorage";

// Common interface for image storage operations
export interface ImageStorageServiceInterface {
  pickImageFromLibrary(): Promise<string | null>;
  takePhoto(): Promise<string | null>;
  saveImage(uri: string): Promise<string>;
  getImageUri(imageId: string): Promise<string | null>;
  deleteImage(imageId: string): Promise<void>;
}

export const images = imageStorageService;
