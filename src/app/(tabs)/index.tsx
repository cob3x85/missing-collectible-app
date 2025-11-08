import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { db } from "@/services/db";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";



export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const insets = useSafeAreaInsets();

  const { isLoading , data: funkoNamesList } = useQuery({
    queryKey: ["funkos", "all"],
    queryFn: () => db.searchFunkos(searchQuery),
    enabled: searchQuery.trim().length >= 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const funkoNameList = useMemo(() => {
    if (!isNaN(Number(searchQuery))) {
// Filtar by Funko number logic can go here
console.log("Searching by Funko number:", searchQuery);
    }
    if (searchQuery.trim().length === 0 || searchQuery.trim().length < 3) {
      return [];
    }

    return funkoNamesList?.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

}, [searchQuery]);

if (isLoading){
  return (
    <>
      <ActivityIndicator size="large" color="#0000ff" />
      <ThemedText>Loading Funkos...</ThemedText>
    </>
  );
}

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header with search text */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="subtitle">Fun-Kollection</ThemedText>
        <ThemedText style={styles.searchResultsText}>
          Typing: "{searchQuery}"
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
            onChangeText={text => setSearchQuery(text)}
            autoFocus={false}
            autoCorrect={false}
            autoCapitalize="none"
            spellCheck={false}
          />
        </View>
        <View>

          <ThemedText>{JSON.stringify(funkoNameList, null, 2)}</ThemedText>
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
