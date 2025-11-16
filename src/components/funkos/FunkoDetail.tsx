import { Funko } from "@/database/schema";
import { useFunko } from "@/hooks/useFunkos";
import * as Haptics from "expo-haptics";
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "../themed-text";
import { IconSymbol } from "../ui/icon-symbol";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface FunkoDetailProps {
  visible: boolean;
  onClose: () => void;
  funko: Funko;
  onEdit?: () => void;
}

export const FunkoDetail = ({
  visible,
  onClose,
  funko,
  onEdit,
}: FunkoDetailProps) => {
  // Query fresh data from cache - this will auto-update when cache is invalidated
  const { data: freshFunko } = useFunko(funko.id);

  // Use fresh data if available, otherwise fall back to prop
  const currentFunko = freshFunko || funko;

  const {
    name,
    image_paths,
    number,
    series,
    category,
    condition,
    size,
    type,
    purchase_price,
    current_value,
    purchase_date,
    notes,
    has_protector_case,
  } = currentFunko;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.detailModalOverlay}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.detailModalContent}>
          <View style={styles.detailHeader}>
            <ThemedText style={styles.detailTitle}>{name}</ThemedText>
            <View style={styles.headerButtons}>
              {onEdit && (
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    onEdit();
                  }}
                >
                  <ThemedText style={styles.editButtonText}>
                    <IconSymbol
                      name="pencil.and.list.clipboard"
                      size={18}
                      color="white"
                    />
                  </ThemedText>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onClose();
                }}
              >
                <ThemedText style={styles.closeButtonText}>✕</ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={true}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Image Gallery */}
            {image_paths && image_paths.length > 0 && (
              <View style={styles.imageGallery} pointerEvents="box-none">
                <FlatList
                  data={image_paths}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={true}
                  snapToInterval={SCREEN_WIDTH - 40}
                  decelerationRate="fast"
                  keyExtractor={(item, index) => index.toString()}
                  scrollEnabled={image_paths.length > 1}
                  renderItem={({ item }) => (
                    <View style={styles.imageSlide}>
                      <Image
                        source={{ uri: item }}
                        style={styles.detailImage}
                        resizeMode="contain"
                      />
                    </View>
                  )}
                />
              </View>
            )}

            <View style={styles.detailInfo}>
              {number && (
                <View style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>Number:</ThemedText>
                  <ThemedText style={styles.detailValue}>{number}</ThemedText>
                </View>
              )}
              {series && (
                <View style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>Series:</ThemedText>
                  <ThemedText style={styles.detailValue}>{series}</ThemedText>
                </View>
              )}
              {category && (
                <View style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>Category:</ThemedText>
                  <ThemedText style={styles.detailValue}>{category}</ThemedText>
                </View>
              )}
              {condition && (
                <View style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>Condition:</ThemedText>
                  <ThemedText style={styles.detailValue}>
                    {condition.replace("_", " ")}
                  </ThemedText>
                </View>
              )}
              {size && (
                <View style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>Size:</ThemedText>
                  <ThemedText style={styles.detailValue}>
                    {size === "standard"
                      ? 'Standard (3.75")'
                      : size === "super_sized"
                      ? 'Super-Sized (6")'
                      : 'Jumbo (10")'}
                  </ThemedText>
                </View>
              )}
              {type && (
                <View style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>Type:</ThemedText>
                  <ThemedText style={styles.detailValue}>
                    {type
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </ThemedText>
                </View>
              )}
              {has_protector_case !== undefined && (
                <View style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>
                    Protector Case:
                  </ThemedText>
                  <ThemedText style={styles.detailValue}>
                    {has_protector_case ? "✓ Yes" : "No"}
                  </ThemedText>
                </View>
              )}
              {purchase_price && (
                <View style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>
                    Purchase Price:
                  </ThemedText>
                  <ThemedText style={styles.detailValue}>
                    ${purchase_price.toFixed(2)}
                  </ThemedText>
                </View>
              )}
              {current_value && (
                <View style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>
                    Current Value:
                  </ThemedText>
                  <ThemedText style={styles.detailValue}>
                    ${current_value.toFixed(2)}
                  </ThemedText>
                </View>
              )}
              {purchase_date && (
                <View style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>
                    Purchase Date:
                  </ThemedText>
                  <ThemedText style={styles.detailValue}>
                    {purchase_date}
                  </ThemedText>
                </View>
              )}
              {notes && (
                <View style={styles.detailRowColumn}>
                  <ThemedText style={styles.detailLabel}>Notes:</ThemedText>
                  <ThemedText style={styles.detailValueMultiline}>
                    {notes}
                  </ThemedText>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  detailModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  detailModalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
    padding: 20,
  },
  detailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  headerButtons: {
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  editButtonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 20,
    color: "#666",
    fontWeight: "bold",
  },
  imageGallery: {
    height: 300,
    marginBottom: 20,
  },
  imageSlide: {
    width: SCREEN_WIDTH - 40,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  detailImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  detailInfo: {
    gap: 12,
    paddingBottom: 20,
  },
  scrollContent: {
    flexGrow: 1,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detailRowColumn: {
    flexDirection: "column",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    gap: 8,
  },
  detailLabel: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  detailValue: {
    fontSize: 16,
    color: "#333",
  },
  detailValueMultiline: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
  },
});
