import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

export const ImageSpinner = () => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      })
    ).start();
  }, [rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("@/assets/images/missingfunko.png")}
        style={[styles.image, { transform: [{ rotate }] }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { justifyContent: "center", alignItems: "center" },
  image: { width: 50, height: 50 },
});
