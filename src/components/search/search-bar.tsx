import { Ionicons } from "@expo/vector-icons";
import { GlassView } from "expo-glass-effect";
import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  style?: any;
  glassProps?: {
    tintColor?: string;
    isInteractive?: boolean;
  };
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search Funkos...",
  style,
  glassProps = { tintColor: "rgba(255, 255, 255, 0.8)", isInteractive: true },
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    if (onSearch) {
      onSearch("");
    }
  };

  return (
    <View style={[styles.container, style]}>
      <GlassView
        style={styles.glassContainer}
        tintColor={glassProps.tintColor}
        isInteractive={glassProps.isInteractive}
      >
        <View style={styles.searchInputContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder={placeholder}
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </GlassView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  glassContainer: {
    borderRadius: 25,
    padding: 2, // Small padding for the glass effect border
    overflow: "hidden", // Ensure the glass effect respects border radius
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Semi-transparent for glass effect
    borderRadius: 23, // Slightly smaller to account for glass container padding
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)", // Semi-transparent border
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 0, // Remove default padding to center text
  },
  clearButton: {
    marginLeft: 10,
    padding: 2,
  },
});
