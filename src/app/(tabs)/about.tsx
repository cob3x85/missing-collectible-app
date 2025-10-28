import { HelloWave } from "@/components/hello-wave";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Image } from "expo-image";
import { globalThemeStyles } from "../../config/theme/global-theme";

export default function AboutScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#dd7d16ff", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/dbzBackground.jpg")}
          style={globalThemeStyles.headerImageContainer}
        />
      }
    >
      <ThemedView style={globalThemeStyles.titleContainer}>
        <ThemedText type="title">Fun-Kollection!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView>
        <ThemedText>
          This is a Funko companion app to help track your collection. You can
          add, edit, and remove Funkos from your collection, as well as view
          details about each Funko.
        </ThemedText>
      </ThemedView>
      <ThemedView style={globalThemeStyles.stepContainer}>
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
      </ThemedView>
    </ParallaxScrollView>
  );
}
