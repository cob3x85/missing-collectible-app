import { SearchBar } from "@/components/search/search-bar";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { GlassContainer } from "expo-glass-effect";
import { Image } from "expo-image";
import { Alert, FlatList, StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const handleSearch = (query: string) => {
    if (query.trim()) {
      Alert.alert("Search", `Searching for: ${query}`);
      // TODO: Implement actual search functionality
    }
  };

  const DATA = [
    {
      id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
      title: "First Item",
    },
    {
      id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
      title: "Second Item",
    },
    {
      id: "58694a0f-3da1-471f-bd96-145571e29d72",
      title: "Third Item",
    },
  ];

  type ItemProps = { title: string };

  const renderHeader = () => (
    <View>
      {/* Header Image */}
      <Image
        source={require("@/assets/images/dbzBackground.jpg")}
        style={styles.headerImage}
      />

      {/* Title Section */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="subtitle">Fun-Kollection</ThemedText>
      </ThemedView>

      {/* Search Bar */}
      <GlassContainer style={{backgroundColor:"#f3d2a4ff", backgroundImage: require("@/assets/images/dbzBackground.jpg") }}>
        <SearchBar onSearch={handleSearch} style={styles.searchBar} />
      </GlassContainer>
    </View>
  );

  return (
    <FlatList
      data={DATA}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ThemedView style={styles.itemContainer}>
          <ThemedText>{item.title}</ThemedText>
        </ThemedView>
      )}
      ListHeaderComponent={renderHeader}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  headerImage: {
    backgroundColor: "orange",
    height: 200,
    width: "100%",
    resizeMode: "cover",
  },
  searchBar: {
    marginTop: 10,
    marginHorizontal: 10,
  },
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
});
