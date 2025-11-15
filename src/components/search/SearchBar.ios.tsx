import { IconSymbol } from "@/components/ui/icon-symbol";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { Host } from "@expo/ui/swift-ui";

export const SearchBar = () => {
  const { playFeedback } = useHapticFeedback();
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.searchButton,
          pressed && styles.pressed,
        ]}
        onPress={() => {
          playFeedback("medium");
          router.push({
            pathname: "/search",
          });
        }}
      >
        <IconSymbol size={28} name="magnifyingglass" color="rgba(64,64,64,1)" />
      </Pressable>
    </View>
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
  pressed: {
    opacity: 0.4,
    transform: [{ scale: 0.98 }],
  },
});
