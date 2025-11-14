import { ThemedText } from "@/components/themed-text";
import { Funko } from "@/database/schema";
import { useDeleteFunko } from "@/hooks/useFunkos";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export type FunkoCardProps = Pick<
  Funko,
  "id" | "name" | "image_paths" | "number"
> & {};

export const FunkoCard = ({
  id,
  name,
  image_paths,
  number,
}: FunkoCardProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const deleteFunko = useDeleteFunko({
    onSuccess: () => {
      setShowDeleteModal(false);
      Alert.alert("Success", "Funko deleted successfully!");
    },
    onError: (error) => {
      Alert.alert(
        "Error",
        (error as Error).message || "Failed to delete Funko"
      );
    },
  });

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    deleteFunko.mutate(id);
  };

  return (
    <>
      <Pressable
        style={({ pressed }) => [
          styles.cardContainer,
          pressed && styles.pressed,
        ]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          console.log("Pressed funko:", name, id, image_paths) ;
          // Add navigation or action here
        }}
        onLongPress={handleLongPress}
      >
        {/* Number badge - top right */}
        {number && (
          <View style={styles.numberBadge}>
            <ThemedText style={styles.numberText}>{number}</ThemedText>
          </View>
        )}

        {/* Image - left aligned */}
        {image_paths && image_paths.length > 0 && image_paths[0] ? (
          <Image
            source={{ uri: image_paths[0] }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <ThemedText style={styles.placeholderText}>No Image</ThemedText>
          </View>
        )}

        {/* Name - bottom row */}
        <ThemedText style={styles.text} numberOfLines={2}>
          {name}
        </ThemedText>
      </Pressable>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Delete Funko?</ThemedText>
            <ThemedText style={styles.modalMessage}>
              Are you sure you want to delete "{name}"? This action cannot be
              undone.
            </ThemedText>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowDeleteModal(false);
                }}
              >
                <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={handleDelete}
                disabled={deleteFunko.isPending}
              >
                <ThemedText style={styles.deleteButtonText}>
                  {deleteFunko.isPending ? "Deleting..." : "Delete"}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
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
    borderColor: "red",
    borderWidth: 1,
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
  imagePlaceholder: {
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 12,
    color: "#999",
  },
  text: {
    color: "black",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "left",
    paddingHorizontal: 10,
    marginTop: "auto",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    margin: 20,
    minWidth: 300,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#e0e0e0",
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "#ff3b30",
  },
  deleteButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
