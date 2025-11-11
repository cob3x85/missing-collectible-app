import { ThemedText } from "@/components/themed-text";
import { useFunkos, useSearchFunkos } from "@/hooks/useFunkos";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const SearchScreen = () => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Display all funkos when search is empty
  const {
    data: allFunkos,
    isLoading: isLoadingAll,
    error: errorAll,
  } = useFunkos();

  // Use the custom hook for searching (only when 3+ characters)
  const {
    isLoading: isLoadingSearch,
    data: funkoNamesList,
    error: errorSearch,
  } = useSearchFunkos(searchQuery);

  // Display all funkos if search is empty, otherwise show search results
  const displayList =
    searchQuery.trim().length > 3 ? funkoNamesList : allFunkos;

  const isLoading = isLoadingSearch || isLoadingAll;

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <ActivityIndicator size="large" color="#dd7d16" />
      </View>
    );
  }

  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchInputContainer}>
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
          onChangeText={(text) => setSearchQuery(text)}
          autoFocus={false}
          autoCorrect={false}
          autoCapitalize="none"
          spellCheck={false}
        />
      </View>
      <View>
        <ThemedText>{JSON.stringify(displayList, null, 2)}</ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ee191951",
  },
  titleContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  searchResultsText: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#666",
  },
  searchContainer: {
    padding: 10,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 0,
  },
});
