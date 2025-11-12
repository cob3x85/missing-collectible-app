import { Image } from "expo-image";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import FunkoForm from "@/components/funkos/FunkoForm";
import { globalThemeStyles } from "../../config/theme/global-theme";

const headerImageUrl = Platform.OS === "web"
? require("@/assets/images/funkollection-banner.jpeg")
: require("@/assets/images/dbzBackground.jpg");
export default function AddFunkoScreen() {
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
      <FunkoForm />
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
