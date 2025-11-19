import AsyncStorage from "@react-native-async-storage/async-storage";

export type ImageQuality = "high" | "medium" | "low";

interface AppSettings {
  imageQuality: ImageQuality;
}

const DEFAULT_SETTINGS: AppSettings = {
  imageQuality: "medium",
};

const SETTINGS_KEY = "@app_settings";

class SettingsService {
  private settings: AppSettings = DEFAULT_SETTINGS;
  private initialized = false;

  async init(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(SETTINGS_KEY);
      if (stored) {
        this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
      this.initialized = true;
    } catch (error) {
      console.warn("Failed to load settings:", error);
      this.settings = DEFAULT_SETTINGS;
      this.initialized = true;
    }
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.init();
    }
  }

  async getImageQuality(): Promise<ImageQuality> {
    await this.ensureInitialized();
    return this.settings.imageQuality;
  }

  async setImageQuality(quality: ImageQuality): Promise<void> {
    await this.ensureInitialized();
    this.settings.imageQuality = quality;
    await this.saveSettings();
  }

  private async saveSettings(): Promise<void> {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
    } catch (error) {
      console.warn("Failed to save settings:", error);
    }
  }

  // Get compression quality value (0-1) based on quality setting
  getCompressionQuality(quality: ImageQuality): number {
    switch (quality) {
      case "high":
        return 0.9; // ~90% quality, larger file size
      case "medium":
        return 0.7; // ~70% quality, balanced
      case "low":
        return 0.5; // ~50% quality, smaller file size
      default:
        return 0.7;
    }
  }

  // Get max dimensions based on quality setting
  getMaxDimensions(quality: ImageQuality): number {
    switch (quality) {
      case "high":
        return 1200; // 1200x1200 max
      case "medium":
        return 800; // 800x800 max
      case "low":
        return 600; // 600x600 max
      default:
        return 800;
    }
  }

  // Human-readable labels for UI
  getQualityLabel(quality: ImageQuality): string {
    switch (quality) {
      case "high":
        return "High Quality (Larger files)";
      case "medium":
        return "Medium Quality (Recommended)";
      case "low":
        return "Low Quality (Smaller files)";
      default:
        return "Medium Quality";
    }
  }
}

export const settingsService = new SettingsService();
