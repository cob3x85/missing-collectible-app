import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ImageQuality, settingsService } from "@/services/settings";
import { useTheme } from "@react-navigation/native";
import { GlassContainer, GlassView } from "expo-glass-effect";
import { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [imageQuality, setImageQuality] = useState<ImageQuality>("medium");

  // Load current setting
  useEffect(() => {
    const loadSettings = async () => {
      const quality = await settingsService.getImageQuality();
      setImageQuality(quality);
    };
    loadSettings();
  }, []);

  const handleQualityChange = async (quality: ImageQuality) => {
    const prevQuality = imageQuality;
    setImageQuality(quality);
    try {
      await settingsService.setImageQuality(quality);
    } catch (error) {
      setImageQuality(prevQuality);
      Alert.alert(
        "Failed to Save",
        "Could not update image quality. Please try again."
      );
    }
  };

  const handleImageStorageInfo = () => {
    Alert.alert(
      "Image Storage",
      "Images are stored directly in the app's database and will persist across app updates.\n\n" +
        "Storage Details:\n" +
        "• Images are saved as part of the app's database\n" +
        "• They persist through app updates\n" +
        "• Only removed if the app is uninstalled\n\n" +
        "Your images are safe and will not be lost during updates.",
      [{ text: "OK" }]
    );
  };

  const handleDeleteInfo = () => {
    Alert.alert(
      "How to Delete Funko Items",
      "To delete a Funko from your collection:\n\n1. Long press on any Funko card\n2. Tap 'Delete' from the menu\n3. Confirm deletion when prompted\n\nNote: This action cannot be undone and will also delete all associated images.",
      [{ text: "Got it" }]
    );
  };

  return (
    <GlassContainer style={styles.container}>
      <GlassView style={[styles.header, { paddingTop: insets.top }]}>
        <ThemedText type="title" style={styles.headerTitle}>
          Settings
        </ThemedText>
      </GlassView>

      <ScrollView style={styles.scrollView}>
        <GlassView style={styles.content}>
          {/* App Information Section */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>App Information</ThemedText>
            <View style={styles.card}>
              <View style={styles.row}>
                <ThemedText style={styles.label}>Version</ThemedText>
                <ThemedText style={styles.value}>1.0.0</ThemedText>
              </View>
              <View style={styles.row}>
                <ThemedText style={styles.label}>Platform</ThemedText>
                <ThemedText style={styles.value}>{Platform.OS}</ThemedText>
              </View>
              <View style={styles.row}>
                <ThemedText style={styles.label}>Developer</ThemedText>
                <ThemedText style={styles.value}>Carlos Ortiz</ThemedText>
              </View>
              <View style={styles.row}>
                <ThemedText style={styles.label}>Support</ThemedText>
                <ThemedText style={styles.value}>
                  cob3x85.apple@outlook.com
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Image Quality Section */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Image Quality</ThemedText>
            <ThemedText style={[styles.sectionDescription, {color: theme.colors.text}]}>
              Choose image quality for new photos. Lower quality saves storage
              space.
            </ThemedText>
            <View style={styles.card}>
              {(
                [
                  {
                    value: "high",
                    label: "High Quality",
                    size: "~500KB/image",
                  },
                  {
                    value: "medium",
                    label: "Medium Quality",
                    size: "~250KB/image",
                  },
                  { value: "low", label: "Low Quality", size: "~150KB/image" },
                ] as const
              ).map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.qualityOption,
                    imageQuality === option.value &&
                      styles.qualityOptionSelected,
                  ]}
                  onPress={() => handleQualityChange(option.value)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: imageQuality === option.value }}
                  accessibilityLabel={`${option.label}, ${option.size}${option.value === "medium" ? ", Recommended" : ""}`}
                >
                  <View style={styles.qualityOptionLeft}>
                    <View
                      style={[
                        styles.radioOuter,
                        imageQuality === option.value &&
                          styles.radioOuterSelected,
                      ]}
                    >
                      {imageQuality === option.value && (
                        <View style={styles.radioInner} />
                      )}
                    </View>
                    <View>
                      <ThemedText style={styles.qualityLabel}>
                        {option.label}
                      </ThemedText>
                      <ThemedText style={styles.qualitySize}>
                        {option.size}
                      </ThemedText>
                    </View>
                  </View>
                  {option.value === "medium" && (
                    <View style={styles.recommendedBadge}>
                      <ThemedText style={styles.recommendedText}>
                        Recommended
                      </ThemedText>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
            <ThemedText style={[styles.qualityNote, {color: theme.colors.text}]}>
              💡 This setting only affects new photos. Existing images won't
              change.
            </ThemedText>
          </View>

          {/* User Guide Section */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Help & Guide</ThemedText>
            <View style={styles.card}>
              <Pressable
                style={({ pressed }) => [
                  styles.row,
                  styles.pressable,
                  pressed && styles.pressed,
                ]}
                onPress={handleDeleteInfo}
              >
                <View style={styles.rowLeft}>
                  <IconSymbol
                    size={20}
                    name="trash.fill"
                    color={theme.colors.primary}
                    style={styles.rowIcon}
                  />
                  <View>
                    <ThemedText style={styles.label}>
                      How to Delete Items
                    </ThemedText>
                    <ThemedText style={styles.sublabel}>
                      Learn how to remove Funkos
                    </ThemedText>
                  </View>
                </View>
                <IconSymbol size={16} name="chevron.right" color="#999" />
              </Pressable>
            </View>
          </View>

          {/* Storage Section */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Storage</ThemedText>
            <View style={styles.card}>
              <Pressable
                style={({ pressed }) => [
                  styles.row,
                  styles.pressable,
                  pressed && styles.pressed,
                ]}
                onPress={handleImageStorageInfo}
              >
                <View style={styles.rowLeft}>
                  <IconSymbol
                    size={20}
                    name="info.circle.fill"
                    color={theme.colors.primary}
                    style={styles.rowIcon}
                  />
                  <View>
                    <ThemedText style={styles.label}>
                      Image Storage Info
                    </ThemedText>
                    <ThemedText style={styles.sublabel}>
                      How images are stored on your device
                    </ThemedText>
                  </View>
                </View>
                <IconSymbol size={16} name="chevron.right" color="#999" />
              </Pressable>
            </View>
          </View>

          {/* Future Settings Placeholder */}
          <View style={[styles.section, { marginBottom: 100 }]}>
            <ThemedText style={styles.sectionTitle}>Coming Soon</ThemedText>
            <View style={styles.card}>
              <View style={[styles.row, styles.disabled]}>
                <ThemedText style={[styles.label, styles.disabledText]}>
                  Localization: Spanish, Portuguese, French, German, and more.
                </ThemedText>
              </View>
            </View>
          </View>
        </GlassView>
      </ScrollView>
    </GlassContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: undefined,
  },
  header: {
    backgroundColor: "#f46d03",
    padding: 20,
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rowIcon: {
    marginRight: 12,
  },
  pressable: {
    borderRadius: 8,
    marginHorizontal: -8,
    paddingHorizontal: 8,
  },
  pressed: {
    backgroundColor: "#f5f5f5",
  },
  label: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  sublabel: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  value: {
    fontSize: 16,
    color: "#666",
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: "#999",
  },
  warningBanner: {
    flexDirection: "row",
    backgroundColor: "#ffebee",
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#ff3b30",
  },
  successBanner: {
    flexDirection: "row",
    backgroundColor: "#e8f5e9",
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#34c759",
  },
  successTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  warningIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  warningTextContainer: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  warningText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    lineHeight: 20,
  },
  qualityOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  qualityOptionSelected: {
    backgroundColor: "#f0f8ff",
  },
  qualityOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ccc",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  radioOuterSelected: {
    borderColor: "#f46d03",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#f46d03",
  },
  qualityLabel: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  qualitySize: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  recommendedBadge: {
    backgroundColor: "#34c759",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  recommendedText: {
    fontSize: 11,
    color: "white",
    fontWeight: "600",
  },
  qualityNote: {
    fontSize: 13,
    color: "#666",
    marginTop: 12,
    lineHeight: 18,
    fontStyle: "italic",
  },
});
