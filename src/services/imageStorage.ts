import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";

class ImageStorageService {
  private imagesDirectoryPath: string;

  constructor() {
    this.imagesDirectoryPath = `${FileSystem.documentDirectory}funko_images/`;
    this.ensureDirectoryExists();
  }

  private async ensureDirectoryExists(): Promise<void> {
    try {
      const dirInfo = await FileSystem.getInfoAsync(this.imagesDirectoryPath);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.imagesDirectoryPath, {
          intermediates: true,
        });
      }
    } catch (error) {
      console.warn("Error creating images directory:", error);
    }
  }

  async pickImageFromLibrary(): Promise<string | null> {
    try {
      // Request permission
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        console.log("Media library permission denied");
        return null;
      }

      // Pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1], // Square aspect ratio for Funko images
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        return await this.saveImage(result.assets[0].uri);
      }

      return null;
    } catch (error) {
      console.error("Error picking image from library:", error);
      throw error;
    }
  }

  async takePhoto(): Promise<string | null> {
    try {
      // Request permission
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        console.log("Camera permission denied");
        return null;
      }

      // Take photo
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        return await this.saveImage(result.assets[0].uri);
      }

      return null;
    } catch (error) {
      console.error("Error taking photo:", error);
      throw error;
    }
  }

  private generateUniqueFilename(): string {
    const uniquePart = globalThis.crypto?.randomUUID
      ? globalThis.crypto.randomUUID()
      : Math.floor(Math.random() * 1e9);
    return `funko_${Date.now()}_${uniquePart}.jpg`;
  }

  async saveImage(sourceUri: string): Promise<string> {
    try {
      // Convert image to base64
      const base64 = await FileSystem.readAsStringAsync(sourceUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Return base64 string with data URI prefix for React Native Image component
      return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
      console.warn("Failed to convert image to base64:", error);
      throw error;
    }
  }

  async deleteImage(imagePath: string): Promise<void> {
    try {
      // If it's a base64 data URI, nothing to delete
      if (imagePath.startsWith("data:image")) {
        return;
      }

      // Legacy: Delete file if it exists
      const fileInfo = await FileSystem.getInfoAsync(imagePath);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(imagePath);
      }
    } catch (error) {
      console.warn("Failed to delete image:", error);
    }
  }

  async getImageUri(imagePath: string): Promise<string | null> {
    try {
      // If already a data URI (base64), return as-is
      if (imagePath.startsWith("data:image")) {
        return imagePath;
      }

      // Legacy: Check if it's a file path
      const fileInfo = await FileSystem.getInfoAsync(imagePath);
      return fileInfo.exists ? imagePath : null;
    } catch (error) {
      console.warn("Failed to get image URI:", error);
      return null;
    }
  }

  // Legacy sync method for backwards compatibility
  getImageUriSync(imagePath: string): string {
    return imagePath;
  }

  async getAllImages(): Promise<string[]> {
    try {
      const dirInfo = await FileSystem.getInfoAsync(this.imagesDirectoryPath);
      if (dirInfo.exists && dirInfo.isDirectory) {
        const files = await FileSystem.readDirectoryAsync(
          this.imagesDirectoryPath
        );
        return files
          .filter((filename: string) =>
            filename.match(/\.(jpg|jpeg|png|gif|webp)$/i)
          )
          .map((filename: string) => `${this.imagesDirectoryPath}${filename}`)
          .sort((a, b) => b.localeCompare(a)); // Sort by newest first
      }
      return [];
    } catch (error) {
      console.warn("Failed to list images:", error);
      return [];
    }
  }

  async clearAllImages(): Promise<void> {
    try {
      const images = await this.getAllImages();
      await Promise.all(images.map((imagePath) => this.deleteImage(imagePath)));
    } catch (error) {
      console.warn("Failed to clear images:", error);
    }
  }

  async getImageInfo(imagePath: string): Promise<{
    size: number;
    exists: boolean;
    uri: string;
    modificationTime?: number;
  } | null> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(imagePath);
      return {
        size: "size" in fileInfo ? fileInfo.size : 0,
        exists: fileInfo.exists,
        uri: imagePath,
        modificationTime:
          "modificationTime" in fileInfo
            ? fileInfo.modificationTime
            : undefined,
      };
    } catch (error) {
      console.warn("Failed to get image info:", error);
      return null;
    }
  }

  async moveImage(fromPath: string, toFilename: string): Promise<string> {
    const newPath = `${this.imagesDirectoryPath}${toFilename}`;
    try {
      await FileSystem.moveAsync({
        from: fromPath,
        to: newPath,
      });
      return newPath;
    } catch (error) {
      console.warn("Failed to move image:", error);
      throw error;
    }
  }

  async copyImageFromUri(
    sourceUri: string,
    filename?: string
  ): Promise<string> {
    const finalFilename = filename || this.generateUniqueFilename();
    const destinationUri = `${this.imagesDirectoryPath}${finalFilename}`;

    try {
      await FileSystem.copyAsync({
        from: sourceUri,
        to: destinationUri,
      });

      return destinationUri;
    } catch (error) {
      console.warn("Failed to copy image:", error);
      throw error;
    }
  }

  async getDirectoryInfo(): Promise<{
    exists: boolean;
    itemCount: number;
    totalSize: number;
  }> {
    try {
      const dirInfo = await FileSystem.getInfoAsync(this.imagesDirectoryPath);
      if (dirInfo.exists && dirInfo.isDirectory) {
        const files = await FileSystem.readDirectoryAsync(
          this.imagesDirectoryPath
        );
        const imageFiles = files.filter((filename: string) =>
          filename.match(/\.(jpg|jpeg|png|gif|webp)$/i)
        );

        // Calculate total size
        let totalSize = 0;
        for (const filename of imageFiles) {
          const filePath = `${this.imagesDirectoryPath}${filename}`;
          const fileInfo = await FileSystem.getInfoAsync(filePath);
          if ("size" in fileInfo) {
            totalSize += fileInfo.size;
          }
        }

        return {
          exists: true,
          itemCount: imageFiles.length,
          totalSize,
        };
      }
      return { exists: false, itemCount: 0, totalSize: 0 };
    } catch (error) {
      console.warn("Failed to get directory info:", error);
      return { exists: false, itemCount: 0, totalSize: 0 };
    }
  }

  async isImageValid(imagePath: string): Promise<boolean> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(imagePath);
      // Basic validation - check if file exists and has size > 0
      return fileInfo.exists && ("size" in fileInfo ? fileInfo.size > 0 : true);
    } catch (error) {
      console.warn("Failed to validate image:", error);
      return false;
    }
  }

  getImageFileName(imagePath: string): string {
    return imagePath.split("/").pop() || "unknown";
  }

  // Utility method to format file size
  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
}

export const imageStorageService = new ImageStorageService();
