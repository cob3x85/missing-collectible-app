import { IconSymbol } from "@/components/ui/icon-symbol";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";
import { Host, Text } from "@expo/ui/swift-ui";
import { glassEffect } from "@expo/ui/swift-ui/modifiers";
import { GlassView } from "expo-glass-effect";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

export const SearchBar = () => {
  const { playFeedback } = useHapticFeedback();
  const router = useRouter();
  return (
    <GlassView>
      <Pressable
        style={styles.searchButton}
        onPress={() => {
          playFeedback("medium");
          router.push({
            pathname: "/search",
          });
        }}
      >
        <IconSymbol size={28} name="magnifyingglass" color="rgba(64,64,64,1)" />
      </Pressable>
      <Host style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text
          modifiers={[
            glassEffect({
              glass: {
                variant: "clear",
              },
            }),
          ]}
        >
          Search Bar Component
        </Text>
      </Host>
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
