import { FunkoCard } from "@/components/funkos/FunkoCard";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ImageSpinner } from "@/components/ui/image-spinner";
import { MOCK_FUNKOS } from "@/constants/mock-data";
import { useFunkos } from "@/hooks/useFunkos";
import { useTheme } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { useFonts } from "expo-font";
import { GlassView } from "expo-glass-effect";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { isLoading, data: funkos } = useFunkos();
  const insets = useSafeAreaInsets();

  const [fontsLoaded] = useFonts({
    Slackey: require("@/assets/fonts/Slackey/Slackey-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return <ImageSpinner />;
  }

  if (isLoading) {
    return (
      <ThemedView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ImageSpinner />
      </ThemedView>
    );
  }

  if (!funkos || funkos.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={[styles.titleContainer, { paddingTop: insets.top }]}>
          <ThemedText type="subtitle" style={styles.textTitle}>
            Fun-Kollection
          </ThemedText>
          <Image
            source={require("@/assets/images/missingfunko.png")}
            style={{ width: 80, height: 80 }}
            contentFit="scale-down"
          />
        </ThemedView>

        <View style={styles.emptyContainer}>
          <IconSymbol
            size={80}
            name="tray.fill"
            color={theme.colors.text}
            style={{ opacity: 0.3, marginBottom: 20 }}
          />
          <ThemedText type="subtitle" style={{ marginBottom: 10 }}>
            No Funkos Yet
          </ThemedText>
          <ThemedText style={{ marginBottom: 30, opacity: 0.7 }}>
            Start your collection by adding your first Funko!
          </ThemedText>

          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.addButtonPressed,
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push("/add");
            }}
          >
            <IconSymbol
              size={24}
              name="plus.circle.fill"
              color="white"
              style={{ marginRight: 8 }}
            />
            <ThemedText style={styles.addButtonText}>Add Your First Funko</ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    );
  }

  // Use real data if available, otherwise use mock data
  const displayData = funkos && funkos.length > 0 ? funkos : MOCK_FUNKOS;

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={[styles.titleContainer, { paddingTop: insets.top }]}>
        <ThemedText type="subtitle" style={styles.textTitle}>
          Fun-Kollection
        </ThemedText>
        <Image
          source={require("@/assets/images/missingfunko.png")}
          style={{ width: 80, height: 80 }}
          contentFit="scale-down"
        />
      </ThemedView>

      <FlatList
        style={styles.flatList}
        contentContainerStyle={styles.flatListContent}
        keyExtractor={(item) => item.id}
        data={displayData}
        renderItem={({ item }) => <FunkoCard {...item} />}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
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
    fontFamily: "Slackey",
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
    width: "100%",
  },
  flatListContent: {
    padding: 15,
  },
  row: {
    justifyContent: "space-between",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFA500",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
  addButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
