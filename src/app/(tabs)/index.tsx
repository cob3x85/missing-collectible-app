import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const insets = useSafeAreaInsets();

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header with search text */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="subtitle">Fun-Kollection</ThemedText>
        <ThemedText style={styles.searchResultsText}>
          Typing: "{searchQuery}"
        </ThemedText>
        <ThemedText style={styles.searchResultsText}>
          Debounced: "{debouncedSearchQuery}"
        </ThemedText>
      </ThemedView>

      {/* Simple Search Input */}
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
            onChangeText={setSearchQuery}
            autoFocus={false}
            autoCorrect={false}
            autoCapitalize="none"
            spellCheck={false}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ee791951",
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
