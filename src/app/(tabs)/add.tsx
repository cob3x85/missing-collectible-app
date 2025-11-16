import FunkoForm from "@/components/funkos/FunkoForm";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet } from "react-native";
import { globalThemeStyles } from "../../config/theme/global-theme";

const headerImageUrl = require("@/assets/images/dbzBackground.jpg");

export default function AddFunkoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#f46d03", dark: "#f46d03" }}
      headerImage={
        <Image
          source={headerImageUrl}
          style={globalThemeStyles.headerImageContainer}
          contentFit="fill"
        />
      }
    >
      <FunkoForm />
    </ParallaxScrollView>
  );
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
