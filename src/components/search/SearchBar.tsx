import { IconSymbol } from "@/components/ui/icon-symbol";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";
import { GlassView } from "expo-glass-effect";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

export const SearchBar = () => {
  const { playFeedback } = useHapticFeedback();
  const router = useRouter();
  return (
    <GlassView style={styles.container}>
      <Pressable
        style={styles.searchButton}
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
    borderColor: "rgba(64, 64, 64, 1)",
    borderWidth: 1,
  },
});
