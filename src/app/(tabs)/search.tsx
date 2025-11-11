import { SearchScreen } from "@/screens/SearchScreen";
import { GlassView } from "expo-glass-effect";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Search() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GlassView>
        <SearchScreen />
      </GlassView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
