import { HelloWave } from "@/components/hello-wave";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@react-navigation/native";
import { Image } from "expo-image";
import { Platform, StyleSheet, View } from "react-native";
import { globalThemeStyles } from "../../config/theme/global-theme";
import { GlassView } from "expo-glass-effect";

const headerImageUrl = Platform.OS === "web"
  ? require("@/assets/images/funkollection-banner.jpeg")
  : require("@/assets/images/dbzBackground.jpg");
export default function AboutScreen() {
  const theme = useTheme();
  const content = (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#f46d03", dark: "#f46d03" }}
      headerImage={
        <Image
          source={headerImageUrl}
          style={globalThemeStyles.headerImageContainer}
          contentFit={Platform.OS === "web" ? "fill" : "fill"}
        />
      }
    >
      <View style={[globalThemeStyles.titleContainer]}>
        <ThemedText type="title">Fun-Kollection!</ThemedText>
        <HelloWave />
      </View>
      <View>
        <ThemedText>
          This is a Funko companion app to help track your collection. You can
          add, edit, and remove Funkos from your collection, as well as view
          details about each Funko.
        </ThemedText>
      </View>
      <View style={globalThemeStyles.stepContainer}>
        <ThemedText type="subtitle">Problem </ThemedText>
        <ThemedText>
          Many Funko collectors struggle to keep track of their ever-growing
          collections. With new releases and exclusive items, it can be
          challenging to remember which Funkos you own, where they are stored,
          and their condition.
        </ThemedText>
        <ThemedText type="subtitle">Solution </ThemedText>
        <ThemedText>
          This app aims to solve that problem by providing an easy-to-use
          platform for managing your Funko collection. Whether you&apos;re at a
          convention, browsing online marketplaces, or participating in
          auctions, having instant access to your collection data helps you make
          informed purchasing decisions and avoid costly duplicates.
        </ThemedText>
      </View>
    </ParallaxScrollView>
  );

  if (Platform.OS === "web") {
    return (
      <View style={styles.webContainer}>
        <View style={styles.webContent}>{content}</View>
      </View>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  webContent: {
    width: "100%",
    maxWidth: 1200,
    flex: 1,
  },
});
