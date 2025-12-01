import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ImageSpinner } from "@/components/ui/image-spinner";
import { ImageQuality, settingsService } from "@/services/settings";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { GlassContainer, GlassView } from "expo-glass-effect";
import { Image } from "expo-image";
import { getLocales } from "expo-localization";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
  const locales = getLocales();
  const deviceLanguageCode = locales[0]?.languageCode ?? "en";
  const { t } = useTranslation();
  const [imageQuality, setImageQuality] = useState<ImageQuality>("medium");
  const [fontsLoaded] = useFonts({
    Slackey: require("@/assets/fonts/Slackey/Slackey-Regular.ttf"),
  });
  if (!fontsLoaded) {
    return <ImageSpinner />;
  }

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
      t("settings.storage.alert.title"),
      t("settings.storage.alert.message"),
      [{ text: t("settings.storage.alert.confirmButton") }]
    );
  };

  const handleDeleteInfo = () => {
    Alert.alert(
      t("settings.deleteAlert.title"),
      t("settings.deleteAlert.message"),
      [{ text: t("settings.deleteAlert.confirmButton") }]
    );
  };

  return (
    <GlassContainer style={styles.container}>
      <GlassView style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <ThemedText type="title" style={styles.headerTitle}>
            {t("settings.title")}
          </ThemedText>
          <View style={styles.logoChip}>
            <Image
              source={require("@/assets/images/PopCollectionImage.png")}
              style={styles.logoImage}
              contentFit="contain"
            />
          </View>
        </View>
      </GlassView>

      <ScrollView style={styles.scrollView}>
        <GlassView style={styles.content}>
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              {t("settings.language")}
            </ThemedText>
            <View style={styles.card}>
              {/* <View style={styles.row}>
                <ThemedText style={styles.label}>
                  {t("settings.appLanguage")}
                </ThemedText>
                <ThemedText style={styles.value}>
                  {i18n.language === "es" ? "Español (MX)" : "English (US)"}
                </ThemedText>
              </View> */}
              <View style={styles.row}>
                <ThemedText style={styles.label}>
                  {t("settings.deviceLanguage")}
                </ThemedText>
                <ThemedText style={styles.value}>
                  {deviceLanguageCode}
                </ThemedText>
              </View>
            </View>
          </View>
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              {t("settings.appInformation")}
            </ThemedText>
            <View style={styles.card}>
              <View style={styles.row}>
                <ThemedText style={styles.label}>{t("version")}</ThemedText>
                <ThemedText style={styles.value}>1.0.0</ThemedText>
              </View>
              <View style={styles.row}>
                <ThemedText style={styles.label}>
                  {t("settings.platform")}
                </ThemedText>
                <ThemedText style={styles.value}>{Platform.OS}</ThemedText>
              </View>
              <View style={styles.row}>
                <ThemedText style={styles.label}>
                  {t("settings.developer")}
                </ThemedText>
                <ThemedText style={styles.value}>Carlos Ortiz</ThemedText>
              </View>
              <View style={styles.row}>
                <ThemedText style={styles.label}>
                  {t("settings.support")}
                </ThemedText>
                <ThemedText style={styles.value}>
                  cob3x85.apple@outlook.com
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Image Quality Section */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              {t("settings.imageQuality.title")}
            </ThemedText>
            <ThemedText
              style={[styles.sectionDescription, { color: theme.colors.text }]}
            >
              {t("settings.imageQuality.description")}
            </ThemedText>
            <View style={styles.card}>
              {(
                [
                  {
                    value: "high",
                    label: t("settings.imageQuality.high"),
                    size: "~500KB/image",
                  },
                  {
                    value: "medium",
                    label: t("settings.imageQuality.medium"),
                    size: "~250KB/image",
                  },
                  {
                    value: "low",
                    label: t("settings.imageQuality.low"),
                    size: "~150KB/image",
                  },
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
                  accessibilityState={{
                    checked: imageQuality === option.value,
                  }}
                  accessibilityLabel={`${option.label}, ${option.size}${
                    option.value === "medium" ? ", Recommended" : ""
                  }`}
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
                        {t("settings.imageQuality.recommended")}
                      </ThemedText>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
            <ThemedText
              style={[styles.qualityNote, { color: theme.colors.text }]}
            >
              {t("settings.imageQuality.note")}
            </ThemedText>
          </View>

          {/* User Guide Section */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              {t("settings.deleteAlert.title")}
            </ThemedText>
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
                  {Platform.OS === "ios" ? (
                    <IconSymbol
                      size={20}
                      name="trash.fill"
                      color={theme.colors.primary}
                      style={styles.rowIcon}
                    />
                  ) : (
                    <Ionicons
                      size={20}
                      name="trash"
                      color={theme.colors.primary}
                      style={styles.rowIcon}
                    />
                  )}
                  <View>
                    <ThemedText style={styles.label}>
                      {t("settings.deleteAlert.howTo")}
                    </ThemedText>
                    <ThemedText style={styles.sublabel}>
                      {t("settings.deleteAlert.description")}
                    </ThemedText>
                  </View>
                </View>
                <IconSymbol size={16} name="chevron.right" color="#999" />
              </Pressable>
            </View>
          </View>

          {/* Storage Section */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              {t("settings.storage.title")}
            </ThemedText>
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
                  {Platform.OS === "ios" ? (
                  <IconSymbol
                    size={20}
                    name="info.circle.fill"
                    color={theme.colors.primary}
                    style={styles.rowIcon}
                  /> ) : (
                    <Ionicons
                      size={20}
                      name="information-circle"
                      color={theme.colors.primary}
                      style={styles.rowIcon}
                    />
                  )}
                  <View>
                    <ThemedText style={styles.label}>
                      {t("settings.storage.imageStorageInfo")}
                    </ThemedText>
                    <ThemedText style={styles.sublabel}>
                      {t("settings.storage.description")}
                    </ThemedText>
                  </View>
                </View>
                <IconSymbol size={16} name="chevron.right" color="#999" />
              </Pressable>
            </View>
          </View>

          {/* Future Settings Placeholder */}
          <View style={[styles.section, { marginBottom: 100 }]}>
            <ThemedText style={styles.sectionTitle}>
              {t("comingSoon")}
            </ThemedText>
            <View style={styles.card}>
              <View style={[styles.row, styles.disabled]}>
                <ThemedText style={[styles.label, styles.disabledText]}>
                  - Localization: Portuguese.
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
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "white",
    fontFamily: "Slackey",
    fontSize: 24,
    fontWeight: "bold",
  },
  logoChip: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  logoImage: {
    width: 36,
    height: 36,
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
