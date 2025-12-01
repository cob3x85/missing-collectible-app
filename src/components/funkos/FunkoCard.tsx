import { ThemedText } from "@/components/themed-text";
import { Funko } from "@/database/schema";
import { useDeleteFunko } from "@/hooks/useFunkos";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { FunkoDetail } from "./FunkoDetail";
import FunkoForm from "./FunkoForm";

// Helper function to get image URIs from Funko data
const getImageUris = (funko: Funko): string[] => {
  // Use image_data (base64 only, persists across updates)
  if (funko.image_data) {
    try {
      const base64Array = JSON.parse(funko.image_data);
      return base64Array.map(
        (base64: string) => `data:image/jpeg;base64,${base64}`
      );
    } catch (error) {
      console.warn("Failed to parse image_data:", error);
    }
  }

  return [];
};

export type FunkoCardProps = Funko & {};

export const FunkoCard = (funko: FunkoCardProps) => {
  const { id, name, number } = funko;
  const imageUris = getImageUris(funko);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { t } = useTranslation();

  const deleteFunko = useDeleteFunko({
    onSuccess: () => {
      setShowDeleteModal(false);
      Alert.alert(t("delete.success"), t("delete.success"));
    },
    onError: (error) => {
      Alert.alert(
        t("delete.error"),
        (error as Error).message || t("delete.failure")
      );
    },
  });

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowDeleteModal(true);
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowDetailModal(true);
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
        onPress={handlePress}
        onLongPress={handleLongPress}
      >
        {/* Number badge - top right */}
        {number && (
          <View style={styles.numberBadge}>
            <ThemedText style={styles.numberText}>{number}</ThemedText>
          </View>
        )}

        {/* Image - left aligned */}
        {imageUris.length > 0 && imageUris[0] ? (
          <Image
            source={{ uri: imageUris[0] }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <ThemedText style={styles.placeholderText}>{t("delete.noImage")}</ThemedText>
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
            <ThemedText style={styles.modalTitle}>{t("delete.title")}?</ThemedText>
            <ThemedText style={styles.modalMessage}>
              {t("delete.message", { field: name })}
            </ThemedText>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowDeleteModal(false);
                }}
              >
                <ThemedText style={styles.cancelButtonText}>{t("delete.cancel")}</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={handleDelete}
                disabled={deleteFunko.isPending}
              >
                <ThemedText style={styles.deleteButtonText}>
                  {deleteFunko.isPending ? t("delete.deleting") : t("delete.confirm")}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Detail Modal */}
      <FunkoDetail
        visible={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        funko={funko}
        onEdit={() => {
          setShowDetailModal(false);
          setShowEditModal(true);
        }}
      />

      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.editModalContainer}>
          <View style={styles.editModalHeader}>
            <ThemedText style={styles.editModalTitle}>{t("edit.title")}</ThemedText>
            <TouchableOpacity
              style={styles.editModalCloseButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setShowEditModal(false);
              }}
            >
              <ThemedText style={styles.editModalCloseText}>✕</ThemedText>
            </TouchableOpacity>
          </View>
          <FunkoForm
            mode="edit"
            initialData={funko}
            onSuccess={() => setShowEditModal(false)}
          />
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
  editIconOverlay: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(0, 122, 255, 0.9)",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  editIconText: {
    fontSize: 14,
    color: "white",
    fontWeight: "bold",
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
  editModalContainer: {
    flex: 1,
  },
  editModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  editModalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  editModalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  editModalCloseText: {
    fontSize: 20,
    color: "#666",
    fontWeight: "bold",
  },
});
