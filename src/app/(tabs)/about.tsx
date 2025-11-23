import { HelloWave } from "@/components/hello-wave";
import { ThemedText } from "@/components/themed-text";
import { ImageSpinner } from "@/components/ui/image-spinner";
import { useTheme } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { GlassContainer, GlassView } from "expo-glass-effect";
import { Image } from "expo-image";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AboutScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({
    Slackey: require("@/assets/fonts/Slackey/Slackey-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return <ImageSpinner />;
  }

  return (
    <GlassContainer style={styles.container}>
      <GlassView style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <ThemedText type="title" style={styles.headerTitle}>
            About
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

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <ThemedText type="title" style={styles.title}>
              Pop Kollection!
            </ThemedText>
            <HelloWave />
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.text}>
              This is a pop vinyl figure companion app to help track your
              collection. You can add, edit, and remove items from your
              collection, as well as view details about each collectible.
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.subtitle}>
              Problem
            </ThemedText>
            <ThemedText style={styles.text}>
              Many pop vinyl collectors struggle to keep track of their
              ever-growing collections. With new releases and exclusive items,
              it can be challenging to remember which figures you own, where
              they are stored, and their condition.
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.subtitle}>
              Solution
            </ThemedText>
            <ThemedText style={styles.text}>
              This app aims to solve that problem by providing an easy-to-use
              platform for managing your collection. Whether you&apos;re at a
              convention, browsing online marketplaces, or participating in
              auctions, having instant access to your collection data helps you
              make informed purchasing decisions and avoid costly duplicates.
            </ThemedText>
          </View>

          <View style={[styles.section, { marginBottom: 80 }]}>
            <ThemedText type="subtitle" style={styles.subtitle}>
              Disclaimer
            </ThemedText>
            <ThemedText style={[styles.text, { fontStyle: "italic" }]}>
              This app is not affiliated with, endorsed by, or sponsored by
              Funko, Inc. or any other vinyl figure manufacturer. All product
              names, trademarks, and registered trademarks are property of their
              respective owners.
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </GlassContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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
  scrollView: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    padding: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
  },
  title: {
    color: "black",
  },
  section: {
    marginBottom: 24,
  },
  subtitle: {
    color: "black",
    marginBottom: 8,
  },
  text: {
    color: "black",
    lineHeight: 24,
  },
});
