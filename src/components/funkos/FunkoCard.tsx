import { ThemedText } from "@/components/themed-text";
import { Funko } from "@/database/schema";
import * as Haptics from "expo-haptics";
import { Image, Pressable, StyleSheet } from "react-native";

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
      <Image source={{ uri: image_path }} style={styles.image} />
      <ThemedText style={styles.text}>{name}</ThemedText>
      {number && <ThemedText style={styles.text}>#{number}</ThemedText>}
    </Pressable>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    marginHorizontal: 10,
    backgroundColor: "#f5c2834e",
    height: 120,
    flex: 0.5,
    marginBottom: 25,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
});
