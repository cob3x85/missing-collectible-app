import { FunkoCard } from "@/components/funkos/FunkoCard";
import { ThemedView } from "@/components/themed-view";
import { globalThemeStyles } from "@/config/theme/global-theme";
import { useDebounceValue } from "@/hooks/useDebounceValue";
import { useFunkos, useSearchFunkos } from "@/hooks/useFunkos";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { debouncedValue } = useDebounceValue(searchQuery, 500);

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
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
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
    // backgroundColor: "#0f9af0b4",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
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
});
