import { HelloWave } from "@/components/hello-wave";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Image } from "expo-image";
import { View } from "react-native";
import { globalThemeStyles } from "../../config/theme/global-theme";
import { ImageSpinner } from "@/components/ui/image-spinner";

const headerImageUrl = require("@/assets/images/dbzBackground.jpg");

export default function AboutScreen() {
  const theme = useTheme();

      
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#f46d03", dark: "#f46d03" }}
      customBackgroundColor="white"
      headerImage={
        <Image
          source={headerImageUrl}
          style={globalThemeStyles.headerImageContainer}
          contentFit="fill"
        />
      }
    >
      <View style={[globalThemeStyles.titleContainer]}>
        <ThemedText type="title" style={{ color: "black" }}>
          Pop Kollection!
        </ThemedText>
        <HelloWave />
      </View>
      <View style={globalThemeStyles.stepContainer}>
        <ThemedText style={{ color: "black" }}>
          This is a pop vinyl figure companion app to help track your
          collection. You can add, edit, and remove items from your collection,
          as well as view details about each collectible.
        </ThemedText>
      </View>
      <View style={globalThemeStyles.stepContainer}>
        <ThemedText type="subtitle" style={{ color: "black" }}>
          Problem{" "}
        </ThemedText>
        <ThemedText style={{ color: "black" }}>
          Many pop vinyl collectors struggle to keep track of their ever-growing
          collections. With new releases and exclusive items, it can be
          challenging to remember which figures you own, where they are stored,
          and their condition.
        </ThemedText>
        <ThemedText type="subtitle" style={{ color: "black" }}>
          Solution{" "}
        </ThemedText>
        <ThemedText style={{ color: "black" }}>
          This app aims to solve that problem by providing an easy-to-use
          platform for managing your collection. Whether you&apos;re at a
          convention, browsing online marketplaces, or participating in
          auctions, having instant access to your collection data helps you make
          informed purchasing decisions and avoid costly duplicates.
        </ThemedText>
      </View>
      <View style={[globalThemeStyles.stepContainer, { marginBottom: 60 }]}>
        <ThemedText type="subtitle" style={{ color: "black" }}>
          Disclaimer{" "}
        </ThemedText>
        <ThemedText style={{ color: "black", fontStyle: "italic" }}>
          This app is not affiliated with, endorsed by, or sponsored by Funko,
          Inc. or any other vinyl figure manufacturer. All product names,
          trademarks, and registered trademarks are property of their respective
          owners.
        </ThemedText>
      </View>
    </ParallaxScrollView>
  );
}
