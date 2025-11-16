import { IconSymbol } from "@/components/ui/icon-symbol";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";
import { GlassView } from "expo-glass-effect";
import { useRouter } from "expo-router";
import { Platform, Pressable, StyleSheet } from "react-native";

export const SearchBar = () => {
  const { playFeedback } = useHapticFeedback();
  const router = useRouter();

  // Detect iOS version for enhanced glass effect (Platform.Version is string on iOS)
  const isIOS18Plus =
    Platform.OS === "ios" &&
    typeof Platform.Version === "string" &&
    parseInt(Platform.Version, 10) >= 18;

  return (
    <GlassView style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.searchButton,
          pressed && styles.searchButtonPressed,
        ]}
        onPress={() => {
          playFeedback("medium");
          router.push({
            pathname: "/search",
          });
        }}
      >
        <IconSymbol size={28} name="magnifyingglass" color="black" />
      </Pressable>
    </GlassView>
  );
};

const styles = StyleSheet.create({
  container: {},
  searchButton: {
    borderRadius: 30,
    bottom: 30,
    padding: 15,
    position: "absolute",
    right: 30,
    borderColor: "rgba(64, 64, 64, 0.3)",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  searchButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
});
