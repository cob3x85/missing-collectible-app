import { FunkoCard } from "@/components/funkos/FunkoCard";
import { SearchBar } from "@/components/search/SearchBar";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ImageSpinner } from "@/components/ui/image-spinner";
import { useInfiniteFunkos } from "@/hooks/useFunkos";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";
import { useNavigation, useTheme } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { GlassContainer, GlassView } from "expo-glass-effect";
import { Image } from "expo-image";
import { FlatList, Platform, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function HomeScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteFunkos(20);
  const insets = useSafeAreaInsets();
  const { playFeedback } = useHapticFeedback();

  // Flatten pages into single array
  const funkos = data?.pages.flatMap((page) => page.funkos) ?? [];

  const [fontsLoaded] = useFonts({
    Slackey: require("@/assets/fonts/Slackey/Slackey-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return <ImageSpinner />;
  }

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ImageSpinner />
      </View>
    );
  }

  if (!funkos || funkos.length === 0) {
    return (
      <GlassContainer style={styles.container}>
        <GlassView style={[styles.titleContainer, { paddingTop: insets.top }]}>
          <ThemedText type="subtitle" style={styles.textTitle}>
            Fun-Kollection
          </ThemedText>
          <View style={styles.headerRight}>
            <Image
              source={require("@/assets/images/missingfunko.png")}
              style={{ width: 80, height: 80 }}
              contentFit="scale-down"
            />
          </View>
        </GlassView>

        <GlassView style={styles.emptyContainer}>
          {Platform.OS === "web" ? (
            <FontAwesome
              name="inbox"
              size={80}
              color="#333333"
              style={styles.icon}
            />
          ) : (
            <IconSymbol
              size={80}
              name="tray.fill"
              color={theme.colors.text}
              style={styles.icon}
            />
          )}

          <ThemedText
            type="subtitle"
            style={[
              styles.emptyLabel,
              { marginBottom: 10, color: theme.colors.text },
            ]}
          >
            No Funkos Yet
          </ThemedText>
          <ThemedText
            style={[
              styles.emptyLabel,
              { marginBottom: 30, color: theme.colors.text },
            ]}
          >
            Start your collection by adding your first Funko!
          </ThemedText>

          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.addButtonPressed,
            ]}
            onPress={() => {
              playFeedback("medium");
              navigation.navigate("Add" as never);
            }}
          >
            {Platform.OS === "web" ? (
              <FontAwesome
                name="plus-circle"
                size={24}
                color="white"
                style={{ marginRight: 8 }}
              />
            ) : (
              <IconSymbol
                size={24}
                name="plus.circle.fill"
                color="white"
                style={{ marginRight: 8 }}
              />
            )}
            <ThemedText style={styles.addButtonText}>
              Add Your First Funko
            </ThemedText>
          </Pressable>
        </GlassView>
      </GlassContainer>
    );
  }

  const displayData = funkos && funkos.length > 0 ? funkos : [];

  return (
    <GlassContainer style={styles.container}>
      <GlassView style={[styles.titleContainer, { paddingTop: insets.top }]}>
        <ThemedText type="subtitle" style={styles.textTitle}>
          Fun-Kollection
        </ThemedText>
        <View style={styles.headerRight}>
          <Image
            source={require("@/assets/images/missingfunko.png")}
            style={{ width: 80, height: 80 }}
            contentFit="scale-down"
          />
        </View>
      </GlassView>

      <GlassView style={{ flex: 1 }}>
        <FlatList
          style={styles.flatList}
          contentContainerStyle={styles.flatListContent}
          keyExtractor={(item) => item.id}
          data={displayData}
          renderItem={({ item }) => <FunkoCard {...item} />}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View style={styles.footerLoader}>
                <ImageSpinner />
              </View>
            ) : null
          }
        />
      </GlassView>
      {Platform.OS === "ios" ? null : <SearchBar />}
    </GlassContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Platform.OS === "web" ? "white" : undefined,
  },
  titleContainer: {
    alignItems: "center",
    backgroundColor: "#f46d03",
    gap: 8,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  settingsButtonPressed: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    transform: [{ scale: 0.95 }],
  },
  textTitle: {
    color: "white",
    fontFamily: "Slackey",
    fontSize: 24,
    fontWeight: "bold",
  },
  flatList: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
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
    backgroundColor: "white",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f46d03",
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
  emptyLabel: {
    color: "#333333",
    fontSize: 18,
  },
  icon: {
    opacity: 0.5,
    marginBottom: 20,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
});
