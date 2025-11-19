import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTheme } from "@react-navigation/native";
import { GlassContainer, GlassView } from "expo-glass-effect";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const handleImageStorageInfo = () => {
    Alert.alert(
      "Image Storage",
      "✅ FIXED: Images are now stored directly in the database as base64 and will persist across all app updates.\n\n" +
        "• Images persist through TestFlight updates\n" +
        "• Images persist through App Store updates\n" +
        "• Only lost if app is uninstalled\n\n" +
        "Previous images from file storage have been automatically migrated to the database.",
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
                      Learn about image persistence
                    </ThemedText>
                  </View>
                </View>
                <IconSymbol size={16} name="chevron.right" color="#999" />
              </Pressable>
            </View>

            {/* Success Banner */}
            <View style={styles.successBanner}>
              <IconSymbol
                size={20}
                name="checkmark.circle.fill"
                color="#34c759"
                style={styles.warningIcon}
              />
              <View style={styles.warningTextContainer}>
                <ThemedText style={styles.successTitle}>
                  ✅ Images Persistence Fixed
                </ThemedText>
                <ThemedText style={styles.warningText}>
                  Images now stored in database and persist across all app
                  updates. Existing images have been automatically migrated.
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Future Settings Placeholder */}
          <View style={[styles.section, { marginBottom: 100 }]}>
            <ThemedText style={styles.sectionTitle}>Coming Soon</ThemedText>
            <View style={styles.card}>
              <View style={[styles.row, styles.disabled]}>
                <ThemedText style={[styles.label, styles.disabledText]}>
                  Backup & Restore
                </ThemedText>
              </View>
              <View style={[styles.row, styles.disabled]}>
                <ThemedText style={[styles.label, styles.disabledText]}>
                  Save to Photo Library
                </ThemedText>
              </View>
              <View style={[styles.row, styles.disabled]}>
                <ThemedText style={[styles.label, styles.disabledText]}>
                  Export Collection
                </ThemedText>
              </View>
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
});
