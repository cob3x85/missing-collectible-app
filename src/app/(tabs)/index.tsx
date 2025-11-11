import { FunkoCard } from "@/components/funkos/FunkoCard";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ImageSpinner } from "@/components/ui/image-spinner";
import { useFunkos } from "@/hooks/useFunkos";
import { useTheme } from "@react-navigation/native";
import { GlassView } from "expo-glass-effect";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { FlatList, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFonts } from 'expo-font';

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { isLoading, data: funkos } = useFunkos();
  const insets = useSafeAreaInsets();

  const [fontsLoaded] = useFonts({
    'Slackey': require('@/assets/fonts/Slackey/Slackey-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null; // or a loading spinner
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={[styles.titleContainer, { paddingTop: insets.top }]}>
        <ThemedText
          type="subtitle"
          style={styles.textTitle}
        >
          Fun-Kollection
        </ThemedText>
        <Image
          source={require("@/assets/images/missingfunko.png")}
          style={{ width: 80, height: 80 }}
          contentFit="scale-down"
        />
      </ThemedView>

      {isLoading && (
        <ThemedView
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ImageSpinner />
        </ThemedView>
      )}

      <FlatList
        style={styles.flatList}
        keyExtractor={(item) => item.id}
        data={funkos}
        renderItem={({ item }) => <FunkoCard funko={item} />}
      />

      <GlassView>
        <Pressable
          style={styles.searchButton}
          onPress={() =>
            router.push({
              pathname: "/search",
            })
          }
        >
          <IconSymbol
            size={28}
            name="magnifyingglass"
            color={theme.colors.text}
          />
        </Pressable>
      </GlassView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  titleContainer: {
    alignItems: "center",
    backgroundColor: "#FFA500",
    gap: 8,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
  },
  textTitle: {
    color: "white",
    fontFamily:"Slackey",
    fontSize: 24,
    fontWeight: "bold",
  },
  searchButton: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 30,
    bottom: 30,
    padding: 15,
    position: "absolute",
    right: 30,
  },
  flatList: {
    flex: 1,
    padding: 15,
    width: "100%",
  },
});
