import { FunkoCard } from "@/components/funkos/FunkoCard";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ImageSpinner } from "@/components/ui/image-spinner";
import { globalThemeStyles } from "@/config/theme/global-theme";
import { useDebounceValue } from "@/hooks/useDebounceValue";
import { useFunkos, useSearchFunkos } from "@/hooks/useFunkos";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { GlassView } from "expo-glass-effect";
import { Image } from "expo-image";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { debouncedValue } = useDebounceValue(searchQuery, 500);

  const [fontsLoaded] = useFonts({
    Slackey: require("@/assets/fonts/Slackey/Slackey-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return <ImageSpinner />;
  }

  const { data: allFunkos = [], isLoading: isLoadingAll } = useFunkos();

  const shouldSearch = debouncedValue.trim().length >= 3;

  // This will only change when debouncedValue changes (after 500ms)
  const { data: searchResults = [], isLoading: isSearching } = useSearchFunkos(
    shouldSearch ? debouncedValue : ""
  );

  // Display logic: show all funkos initially, switch to search results when searching
  const displayList = shouldSearch ? searchResults : allFunkos;
  const isLoading = shouldSearch ? isSearching : isLoadingAll;

  return (
    <ThemedView style={styles.container}>
      <GlassView style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <ThemedText type="title" style={styles.headerTitle}>
            Search
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

      <View style={styles.searchInputContainer} pointerEvents="auto">
        <Ionicons
          name="search"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Type anything..."
          placeholderTextColor="#666"
          value={searchQuery}
          cursorColor={"black"}
          onChangeText={(text) => setSearchQuery(text)}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#dd7d16" />
        </View>
      ) : displayList.length === 0 && shouldSearch ? (
        <View style={styles.emptyContainer}>
          <IconSymbol
            size={80}
            name="magnifyingglass"
            color="#ccc"
            style={styles.emptyIcon}
          />
          <ThemedText type="subtitle" style={styles.emptyTitle}>
            No Results Found
          </ThemedText>
          <ThemedText style={styles.emptyMessage}>
            No items match "{searchQuery}"
          </ThemedText>
          <ThemedText style={styles.emptyHint}>
            Try different keywords or check your spelling
          </ThemedText>
        </View>
      ) : displayList.length === 0 && !shouldSearch ? (
        <View style={styles.emptyContainer}>
          <IconSymbol
            size={80}
            name="tray.fill"
            color="#ccc"
            style={styles.emptyIcon}
          />
          <ThemedText type="subtitle" style={styles.emptyTitle}>
            No Items Available
          </ThemedText>
          <ThemedText style={styles.emptyMessage}>
            Your collection is empty
          </ThemedText>
          <ThemedText style={styles.emptyHint}>
            Add your first item from the Add tab to get started
          </ThemedText>
        </View>
      ) : (
        <FlatList
          style={styles.flatList}
          contentContainerStyle={styles.flatListContent}
          keyExtractor={(item) => item.id}
          data={displayList}
          renderItem={({ item }) => <FunkoCard {...item} />}
          numColumns={2}
          columnWrapperStyle={globalThemeStyles.row}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    paddingVertical: 0,
    height: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    padding: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyIcon: {
    opacity: 0.5,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyHint: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});
