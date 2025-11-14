import { ThemedText } from "@/components/themed-text";
import { Funko } from "@/database/schema";
import * as Haptics from "expo-haptics";
import { Image, Pressable, StyleSheet, View } from "react-native";

export type FunkoCardProps = Pick<
  Funko,
  "id" | "name" | "image_path" | "number"
> & {};

export const FunkoCard = ({ id, name, image_path, number }: FunkoCardProps) => {
  return (
    <Pressable
      style={({ pressed }) => [styles.cardContainer, pressed && styles.pressed]}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        console.log("Pressed funko:", name, id);
        // Add navigation or action here
      }}
    >
      {/* Number badge - top right */}
      {number && (
        <View style={styles.numberBadge}>
          <ThemedText style={styles.numberText}>{number}</ThemedText>
        </View>
      )}

      {/* Image - left aligned */}
      <Image source={{ uri: image_path }} style={styles.image} />

      {/* Name - bottom row */}
      <ThemedText style={styles.text} numberOfLines={2}>
        {name}
      </ThemedText>
    </Pressable>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    flex: 1,
    marginHorizontal: 5,
    marginBottom: 15,
    backgroundColor: "#f5c2834e",
    minHeight: 200,
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: "relative",
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  numberBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "white",
    borderRadius: 20,
    borderColor:"red",
    borderWidth:1,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    zIndex: 10,
  },
  numberText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: "flex-start",
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  text: {
    color: "black",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "left",
    paddingHorizontal: 10,
    marginTop: "auto",
  },
});
