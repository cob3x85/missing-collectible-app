import React from "react";
// import { StyleSheet } from 'react-native';
// import { Link } from 'expo-router';
import { Image } from "expo-image";

import ParallaxScrollView from "@/components/parallax-scroll-view";
// import { ThemedText } from '@/components/themed-text';
// import { ThemedView } from '@/components/themed-view';
// import { HelloWave } from '@/components/hello-wave';
import FunkoForm from "@/screens/FunkoForm";
import { globalThemeStyles } from "../../config/theme/global-theme";

export default function AddFunkoScreen() {
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
      <FunkoForm />
    </ParallaxScrollView>
  );
}
