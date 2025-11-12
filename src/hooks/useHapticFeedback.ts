import { useAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import { useCallback } from "react";

export type FeedbackType =
  | "light"
  | "medium"
  | "heavy"
  | "success"
  | "warning"
  | "error";

export const useHapticFeedback = () => {
  // Create audio player for click sound
  const player = useAudioPlayer(
    "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3"
  );

  const playFeedback = useCallback(
    async (type: FeedbackType = "medium") => {
      // Play haptic feedback
      switch (type) {
        case "light":
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case "medium":
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case "heavy":
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case "success":
          await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success
          );
          break;
        case "warning":
          await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Warning
          );
          break;
        case "error":
          await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Error
          );
          break;
      }

      // Play system sound
      try {
        player.volume = 0.3;
        player.play();
      } catch (error) {
        // Silently fail if sound can't be played
        console.log("Could not play sound:", error);
      }
    },
    [player]
  );

  return { playFeedback };
};
