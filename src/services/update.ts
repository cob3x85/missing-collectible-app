import * as Updates from "expo-updates";
import { Alert } from "react-native";
import i18n from "../../i18n/i18n";

export interface UpdateInfo {
  isAvailable: boolean;
  manifest?: Updates.Manifest;
  isUpdatePending: boolean;
}

/**
 * Update Service
 * Handles OTA updates with user prompts before applying
 */
export const updateService = {
  /**
   * Check if updates are enabled in the current environment
   */
  isUpdateEnabled(): boolean {
    return !__DEV__ && Updates.isEnabled;
  },

  /**
   * Get current update information
   */
  async getCurrentUpdateInfo(): Promise<{
    updateId: string | undefined;
    channel: string | undefined;
    runtimeVersion: string | undefined;
  }> {
    return {
      updateId: Updates.updateId ?? undefined,
      channel: Updates.channel ?? undefined,
      runtimeVersion: Updates.runtimeVersion ?? undefined,
    };
  },

  /**
   * Check for available updates
   * Returns update information if available
   */
  async checkForUpdates(): Promise<UpdateInfo> {
    if (!this.isUpdateEnabled()) {
      console.log("Updates are not enabled in development mode");
      return {
        isAvailable: false,
        isUpdatePending: false,
      };
    }

    try {
      const update = await Updates.checkForUpdateAsync();

      return {
        isAvailable: update.isAvailable,
        manifest: update.manifest,
        isUpdatePending: false,
      };
    } catch (error) {
      console.error("Error checking for updates:", error);
      throw error;
    }
  },

  /**
   * Download and prompt user to apply update
   * Returns true if update was applied (requires reload)
   */
  async fetchAndPromptUpdate(): Promise<boolean> {
    if (!this.isUpdateEnabled()) {
      console.log("Updates are not enabled in development mode");
      return false;
    }

    try {
      const { isAvailable } = await this.checkForUpdates();

      if (!isAvailable) {
        return false;
      }

      // Download the update
      const fetchResult = await Updates.fetchUpdateAsync();

      if (!fetchResult.isNew) {
        console.log("No new update available");
        return false;
      }

      // Prompt user to apply update
      return new Promise((resolve) => {
        Alert.alert(
          i18n.t("settings.updates.alerts.updateAvailable.title"),
          i18n.t("settings.updates.alerts.updateAvailable.message"),
          [
            {
              text: i18n.t("settings.updates.alerts.updateAvailable.later"),
              style: "cancel",
              onPress: () => resolve(false),
            },
            {
              text: i18n.t("settings.updates.alerts.updateAvailable.updateNow"),
              onPress: async () => {
                try {
                  await Updates.reloadAsync();
                  resolve(true);
                } catch (error) {
                  console.error("Error reloading app:", error);
                  Alert.alert(
                    i18n.t("settings.updates.alerts.updateFailed.title"),
                    i18n.t("settings.updates.alerts.updateFailed.message")
                  );
                  resolve(false);
                }
              },
            },
          ],
          { cancelable: true, onDismiss: () => resolve(false) }
        );
      });
    } catch (error) {
      console.error("Error fetching update:", error);
      throw error;
    }
  },

  /**
   * Manual check for updates with user feedback
   * Shows alerts for all scenarios (no update, error, update available)
   */
  async manualCheckForUpdates(): Promise<void> {
    if (!this.isUpdateEnabled()) {
      Alert.alert(
        i18n.t("settings.updates.alerts.updatesUnavailable.title"),
        i18n.t("settings.updates.alerts.updatesUnavailable.message"),
        [{ text: i18n.t("settings.updates.alerts.ok") }]
      );
      return;
    }

    try {
      const { isAvailable } = await this.checkForUpdates();

      if (!isAvailable) {
        Alert.alert(
          i18n.t("settings.updates.alerts.noUpdates.title"),
          i18n.t("settings.updates.alerts.noUpdates.message"),
          [{ text: i18n.t("settings.updates.alerts.ok") }]
        );
        return;
      }

      // If update is available, download and prompt
      await this.fetchAndPromptUpdate();
    } catch (error) {
      console.error("Error checking for updates:", error);
      Alert.alert(
        i18n.t("settings.updates.alerts.checkFailed.title"),
        i18n.t("settings.updates.alerts.checkFailed.message"),
        [{ text: i18n.t("settings.updates.alerts.ok") }]
      );
    }
  },

  /**
   * Check for updates on app launch (silent check, only prompts if update available)
   */
  async checkOnLaunch(): Promise<void> {
    if (!this.isUpdateEnabled()) {
      return;
    }

    try {
      // Silent check - only prompt if update is available
      await this.fetchAndPromptUpdate();
    } catch (error) {
      // Fail silently on launch - don't disrupt user experience
      console.error("Error checking for updates on launch:", error);
    }
  },
};
