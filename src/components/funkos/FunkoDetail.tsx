import { Funko } from "@/database/schema";
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

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface FunkoDetailProps {
  visible: boolean;
  onClose: () => void;
  funko: Funko;
}

export const FunkoDetail = ({ visible, onClose, funko }: FunkoDetailProps) => {
  const {
    name,
    image_paths,
    number,
    series,
    category,
    condition,
    purchase_price,
    current_value,
    purchase_date,
    notes,
  } = funko;

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
                  showsHorizontalScrollIndicator={false}
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
