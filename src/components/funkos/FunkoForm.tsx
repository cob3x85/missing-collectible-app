import { ThemedText } from "@/components/themed-text";
import { Funko, FunkoSize, FunkoType, FunkoVariant } from "@/database/schema";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useCreateFunko, useUpdateFunko } from "@/hooks/useFunkos";
import { images } from "@/services/images";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as yup from "yup";

// Yup validation schema
const funkoValidationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Funko name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  series: yup
    .string()
    .min(2, "Series must be at least 2 characters")
    .max(100, "Series must be less than 100 characters"),
  number: yup
    .string()
    .required("Funko number is required")
    .matches(/^[0-9]+$/, "Number must contain only digits"),
  category: yup.string().max(50, "Category must be less than 50 characters"),
  condition: yup
    .string()
    .required("Condition is required")
    .oneOf(
      ["mint", "near_mint", "good", "fair", "poor"],
      "Invalid condition selected"
    ),
  size: yup
    .string()
    .oneOf(["standard", "super_sized", "jumbo"], "Invalid size selected")
    .optional(),
  type: yup
    .string()
    .oneOf(
      [
        "standard_pop",
        "pop_ride",
        "pop_town",
        "pop_moment",
        "pop_album",
        "pop_comic_cover",
        "pop_deluxe",
        "pop_2pack",
        "pop_3pack",
        "pop_keychain",
        "pop_tee",
        "soda",
        "vinyl_gold",
        "other",
      ],
      "Invalid type selected"
    )
    .optional(),
  variant: yup
    .string()
    .oneOf(
      [
        "normal",
        "chase",
        "chrome",
        "flocked",
        "glow_in_the_dark",
        "metallic",
        "translucent",
        "glitter",
        "blacklight",
        "diamond",
        "scented",
        "exclusive",
        "limited_edition",
        "other",
      ],
      "Invalid variant selected"
    )
    .optional(),
  purchase_price: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === null ? null : value
    )
    .positive("Price must be a positive number")
    .max(999999, "Price is too high")
    .nullable()
    .optional(),
  current_value: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === null ? null : value
    )
    .positive("Value must be a positive number")
    .max(999999, "Value is too high")
    .nullable()
    .optional(),
  purchase_date: yup
    .string()
    .transform((value) => (value === "" ? null : value))
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .nullable()
    .optional(),
  notes: yup.string().max(500, "Notes must be less than 500 characters"),
  hasProtectorCase: yup.boolean().optional(),
});

type FunkoFormData = {
  name: string;
  series: string;
  number: string;
  category: string;
  condition: "mint" | "near_mint" | "good" | "fair" | "poor";
  size: FunkoSize;
  type: FunkoType;
  variant: FunkoVariant;
  purchase_price: string;
  current_value: string;
  purchase_date: string;
  notes: string;
  hasProtectorCase: boolean;
};

interface FunkoFormProps {
  mode?: "create" | "edit";
  initialData?: Funko;
  onSuccess?: () => void;
}

export default function FunkoForm({
  mode = "create",
  initialData,
  onSuccess,
}: FunkoFormProps) {
  const selectionColor = useThemeColor({}, "selectionColor");
  const scrollViewRef = useRef<ScrollView>(null);
  const navigation = useNavigation();

  const [formData, setFormData] = useState<FunkoFormData>({
    name: initialData?.name || "",
    series: initialData?.series || "",
    number: initialData?.number || "",
    category: initialData?.category || "Pop!",
    condition: initialData?.condition || "mint",
    size: initialData?.size || "standard",
    type: initialData?.type || "standard_pop",
    variant: initialData?.variant || "normal",
    purchase_price: initialData?.purchase_price
      ? initialData.purchase_price.toString()
      : "",
    current_value: initialData?.current_value
      ? initialData.current_value.toString()
      : "",
    purchase_date: initialData?.purchase_date || "",
    notes: initialData?.notes || "",
    hasProtectorCase: initialData?.has_protector_case ?? false,
  });

  const [imagePaths, setImagePaths] = useState<string[]>(
    initialData?.image_paths || []
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Sync form state when initialData changes (important for edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        series: initialData.series || "",
        number: initialData.number || "",
        category: initialData.category || "Pop!",
        condition: initialData.condition || "mint",
        size: initialData.size || "standard",
        type: initialData.type || "standard_pop",
        variant: initialData.variant || "normal",
        purchase_price: initialData.purchase_price
          ? initialData.purchase_price.toString()
          : "",
        current_value: initialData.current_value
          ? initialData.current_value.toString()
          : "",
        purchase_date: initialData.purchase_date || "",
        notes: initialData.notes || "",
        hasProtectorCase: initialData.has_protector_case ?? false,
      });
      setImagePaths(initialData.image_paths || []);
    }
  }, [initialData?.id, initialData?.has_protector_case]);

  const createFunko = useCreateFunko({
    onSuccess: () => {
      // Reset form
      setFormData({
        name: "",
        series: "",
        number: "",
        category: "Pop!",
        condition: "mint",
        size: "standard",
        type: "standard_pop",
        variant: "normal",
        purchase_price: "",
        current_value: "",
        purchase_date: "",
        notes: "",
        hasProtectorCase: false,
      });
      setImagePaths([]);
      setErrors({});
      // Navigate to Home screen
      navigation.navigate("Home" as never);
      Alert.alert("Success", "Funko added successfully!");
      onSuccess?.();
    },
    onError: (error: unknown) => {
      Alert.alert("Error", (error as Error).message || "Failed to add Funko");
    },
  });

  const updateFunko = useUpdateFunko({
    onSuccess: () => {
      // Navigate to Home screen
      navigation.navigate("Home" as never);
      Alert.alert("Success", "Funko updated successfully!");
      onSuccess?.();
    },
    onError: (error: unknown) => {
      Alert.alert(
        "Error",
        (error as Error).message || "Failed to update Funko"
      );
    },
  });

  const handlePickImage = async () => {
    try {
      const path = await images.pickImageFromLibrary();
      if (path) {
        setImagePaths((prev) => [...prev, path]);
      }
    } catch (error) {
      Alert.alert("Error", (error as Error).message || "Failed to pick image");
    }
  };

  const handleRemoveImage = (index: number) => {
    setImagePaths((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      // Clear previous errors
      setErrors({});

      // Validate form data
      await funkoValidationSchema.validate(formData, { abortEarly: false });

      // If validation passes, create or update the Funko
      if (mode === "edit" && initialData) {
        const updateData = {
          name: formData.name,
          series: formData.series || undefined,
          number: formData.number,
          category: formData.category || undefined,
          condition: formData.condition,
          size: formData.size,
          type: formData.type,
          variant: formData.variant,
          purchase_price: formData.purchase_price
            ? parseFloat(formData.purchase_price)
            : null,
          current_value: formData.current_value
            ? parseFloat(formData.current_value)
            : null,
          purchase_date: formData.purchase_date || null,
          notes: formData.notes || undefined,
          has_protector_case: formData.hasProtectorCase,
          image_paths: imagePaths.length > 0 ? imagePaths : undefined,
        };
        updateFunko.mutate({
          id: initialData.id,
          updates: updateData,
        });
      } else {
        createFunko.mutate({
          name: formData.name,
          series: formData.series || undefined,
          number: formData.number,
          category: formData.category || undefined,
          condition: formData.condition,
          size: formData.size,
          type: formData.type,
          variant: formData.variant,
          purchase_price: formData.purchase_price
            ? parseFloat(formData.purchase_price)
            : null,
          current_value: formData.current_value
            ? parseFloat(formData.current_value)
            : null,
          purchase_date: formData.purchase_date || null,
          notes: formData.notes || undefined,
          has_protector_case: formData.hasProtectorCase,
          image_paths: imagePaths.length > 0 ? imagePaths : undefined,
        });
      }
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        // Collect all validation errors
        const validationErrors: Record<string, string> = {};
        err.inner.forEach((error) => {
          if (error.path) {
            validationErrors[error.path] = error.message;
          }
        });
        setErrors(validationErrors);

        // Show first error in alert
        Alert.alert("Validation Error", err.errors[0]);
      }
    }
  };

  const updateField = (field: keyof FunkoFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    // On Android, the picker closes automatically after selection
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      // Format date as YYYY-MM-DD
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      updateField("purchase_date", formattedDate);
    }
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const closeDatePicker = () => {
    setShowDatePicker(false);
  };

  const getDateValue = (): Date => {
    if (formData.purchase_date) {
      const date = new Date(formData.purchase_date);
      return isNaN(date.getTime()) ? new Date() : date;
    }
    return new Date();
  };

  return (
    <ScrollView ref={scrollViewRef} style={styles.container}>
      <View style={styles.formContainer}>
        {/* Name Field */}
        <View style={styles.fieldContainer}>
          <ThemedText style={styles.label}>
            Name <ThemedText style={styles.required}>*</ThemedText>
          </ThemedText>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            placeholder="Enter Funko name"
            placeholderTextColor="#666666"
            value={formData.name}
            onChangeText={(value) => updateField("name", value)}
            autoCapitalize="words"
            selectionColor={selectionColor}
          />
          {errors.name && (
            <ThemedText style={styles.errorText}>{errors.name}</ThemedText>
          )}
        </View>

        {/* Series Field */}
        <View style={styles.fieldContainer}>
          <ThemedText style={styles.label}>Series</ThemedText>
          <TextInput
            style={[styles.input, errors.series && styles.inputError]}
            placeholder="Enter series name"
            placeholderTextColor="#666666"
            value={formData.series}
            onChangeText={(value) => updateField("series", value)}
            autoCapitalize="words"
            selectionColor={selectionColor}
          />
          {errors.series && (
            <ThemedText style={styles.errorText}>{errors.series}</ThemedText>
          )}
        </View>

        {/* Number Field */}
        <View style={styles.fieldContainer}>
          <ThemedText style={styles.label}>
            Number <ThemedText style={styles.required}>*</ThemedText>
          </ThemedText>
          <TextInput
            style={[styles.input, errors.number && styles.inputError]}
            placeholder="Enter Funko number (e.g., 001)"
            placeholderTextColor="#666666"
            value={formData.number}
            onChangeText={(value) => updateField("number", value)}
            keyboardType="numeric"
            selectionColor={selectionColor}
          />
          {errors.number && (
            <ThemedText style={styles.errorText}>{errors.number}</ThemedText>
          )}
        </View>

        {/* Category Field */}
        <View style={styles.fieldContainer}>
          <ThemedText style={styles.label}>Category</ThemedText>
          <TextInput
            style={[styles.input, errors.category && styles.inputError]}
            placeholder="Enter category (e.g., Pop!, Soda)"
            placeholderTextColor="#666666"
            value={formData.category}
            onChangeText={(value) => updateField("category", value)}
            autoCapitalize="words"
            selectionColor={selectionColor}
          />
          {errors.category && (
            <ThemedText style={styles.errorText}>{errors.category}</ThemedText>
          )}
        </View>

        {/* Condition Field */}
        <View style={styles.fieldContainer}>
          <ThemedText style={styles.label}>
            Condition <ThemedText style={styles.required}>*</ThemedText>
          </ThemedText>
          <View style={styles.conditionButtons}>
            {(["mint", "near_mint", "good", "fair", "poor"] as const).map(
              (condition) => (
                <TouchableOpacity
                  key={condition}
                  style={[
                    styles.conditionButton,
                    formData.condition === condition &&
                      styles.conditionButtonActive,
                  ]}
                  onPress={() => updateField("condition", condition)}
                >
                  <ThemedText
                    style={[
                      styles.conditionButtonText,
                      formData.condition === condition &&
                        styles.conditionButtonTextActive,
                    ]}
                  >
                    {condition.replace("_", " ")}
                  </ThemedText>
                </TouchableOpacity>
              )
            )}
          </View>
          {errors.condition && (
            <ThemedText style={styles.errorText}>{errors.condition}</ThemedText>
          )}
        </View>

        {/* Size Field */}
        <View style={styles.fieldContainer}>
          <ThemedText style={styles.label}>Size</ThemedText>
          <View style={styles.conditionButtons}>
            {(["standard", "super_sized", "jumbo"] as const).map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.conditionButton,
                  formData.size === size && styles.conditionButtonActive,
                ]}
                onPress={() => updateField("size", size)}
              >
                <ThemedText
                  style={[
                    styles.conditionButtonText,
                    formData.size === size && styles.conditionButtonTextActive,
                  ]}
                >
                  {size === "standard"
                    ? 'Standard (3.75")'
                    : size === "super_sized"
                    ? 'Super (6")'
                    : 'Jumbo (10")'}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
          {errors.size && (
            <ThemedText style={styles.errorText}>{errors.size}</ThemedText>
          )}
        </View>

        {/* Type Field */}
        <View style={styles.fieldContainer}>
          <ThemedText style={styles.label}>Type</ThemedText>
          <View style={styles.conditionButtons}>
            {(
              [
                "standard_pop",
                "pop_ride",
                "pop_town",
                "pop_moment",
                "pop_deluxe",
                "pop_2pack",
                "soda",
                "other",
              ] as const
            ).map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.conditionButton,
                  formData.type === type && styles.conditionButtonActive,
                ]}
                onPress={() => updateField("type", type)}
              >
                <ThemedText
                  style={[
                    styles.conditionButtonText,
                    formData.type === type && styles.conditionButtonTextActive,
                  ]}
                >
                  {type
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
          {errors.type && (
            <ThemedText style={styles.errorText}>{errors.type}</ThemedText>
          )}
        </View>

        {/* Variant Field */}
        <View style={styles.fieldContainer}>
          <ThemedText style={styles.label}>Variant</ThemedText>
          <View style={styles.conditionButtons}>
            {(
              [
                "normal",
                "chase",
                "chrome",
                "flocked",
                "glow_in_the_dark",
                "metallic",
                "translucent",
                "glitter",
                "blacklight",
                "diamond",
                "exclusive",
                "other",
              ] as const
            ).map((variant) => (
              <TouchableOpacity
                key={variant}
                style={[
                  styles.conditionButton,
                  formData.variant === variant && styles.conditionButtonActive,
                ]}
                onPress={() => updateField("variant", variant)}
              >
                <ThemedText
                  style={[
                    styles.conditionButtonText,
                    formData.variant === variant &&
                      styles.conditionButtonTextActive,
                  ]}
                >
                  {variant === "glow_in_the_dark"
                    ? "GITD"
                    : variant
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
          {errors.variant && (
            <ThemedText style={styles.errorText}>{errors.variant}</ThemedText>
          )}
        </View>

        {/* Has Protector Case Toggle */}
        <View style={styles.fieldContainer}>
          <View style={styles.toggleRow}>
            <ThemedText style={styles.label}>Has Protector Case</ThemedText>
            <Switch
              key={`protector-${initialData?.id}-${formData.hasProtectorCase}`}
              value={Boolean(formData.hasProtectorCase)}
              onValueChange={(value) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setFormData((prev) => ({
                  ...prev,
                  hasProtectorCase: Boolean(value),
                }));
              }}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={formData.hasProtectorCase ? "#007AFF" : "#f4f3f4"}
              ios_backgroundColor="#e0e0e0"
            />
          </View>
        </View>

        {/* Purchase Price Field */}
        <View style={styles.fieldContainer}>
          <ThemedText style={styles.label}>Purchase Price</ThemedText>
          <TextInput
            style={[styles.input, errors.purchase_price && styles.inputError]}
            placeholder="Enter purchase price"
            placeholderTextColor="#666666"
            value={formData.purchase_price}
            onChangeText={(value) => updateField("purchase_price", value)}
            keyboardType="decimal-pad"
            selectionColor={selectionColor}
          />
          {errors.purchase_price && (
            <ThemedText style={styles.errorText}>
              {errors.purchase_price}
            </ThemedText>
          )}
        </View>

        {/* Current Value Field */}
        <View style={styles.fieldContainer}>
          <ThemedText style={styles.label}>Current Value</ThemedText>
          <TextInput
            style={[styles.input, errors.current_value && styles.inputError]}
            placeholder="Enter current value"
            placeholderTextColor="#666666"
            value={formData.current_value}
            onChangeText={(value) => updateField("current_value", value)}
            keyboardType="decimal-pad"
            selectionColor={selectionColor}
          />
          {errors.current_value && (
            <ThemedText style={styles.errorText}>
              {errors.current_value}
            </ThemedText>
          )}
        </View>

        {/* Purchase Date Field */}
        <View style={styles.fieldContainer}>
          <ThemedText style={styles.label}>Purchase Date</ThemedText>
          <TouchableOpacity
            style={[styles.input, errors.purchase_date && styles.inputError]}
            onPress={openDatePicker}
          >
            <ThemedText
              style={[
                styles.dateText,
                !formData.purchase_date && styles.datePlaceholder,
              ]}
            >
              {formData.purchase_date || "Select date"}
            </ThemedText>
          </TouchableOpacity>
          {errors.purchase_date && (
            <ThemedText style={styles.errorText}>
              {errors.purchase_date}
            </ThemedText>
          )}

          {showDatePicker && (
            <>
              <DateTimePicker
                value={getDateValue()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleDateChange}
                maximumDate={new Date()}
                textColor="black"
                themeVariant="light"
              />
              {Platform.OS === "ios" && (
                <View style={styles.datePickerButtons}>
                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={closeDatePicker}
                  >
                    <ThemedText style={styles.datePickerButtonText}>
                      Done
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>

        {/* Notes Field */}
        <View style={styles.fieldContainer}>
          <ThemedText style={styles.label}>Notes</ThemedText>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              errors.notes && styles.inputError,
            ]}
            placeholder="Add any additional notes"
            placeholderTextColor="#666666"
            value={formData.notes}
            onChangeText={(value) => updateField("notes", value)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            selectionColor={selectionColor}
          />
          {errors.notes && (
            <ThemedText style={styles.errorText}>{errors.notes}</ThemedText>
          )}
        </View>

        {/* Image Picker */}
        <View style={styles.fieldContainer}>
          <ThemedText style={styles.label}>Images</ThemedText>
          <TouchableOpacity
            style={styles.addImageButton}
            onPress={handlePickImage}
          >
            <View style={styles.addImageIcon}>
              <ThemedText style={styles.addImageIconText}>+</ThemedText>
            </View>
            <ThemedText style={styles.addImageText}>Add Image</ThemedText>
          </TouchableOpacity>
          {imagePaths.length > 0 && (
            <View style={styles.imagesList}>
              {imagePaths.map((path, index) => (
                <View key={index} style={styles.imageItem}>
                  <ThemedText style={styles.imagePathText}>
                    Image {index + 1} ✓
                  </ThemedText>
                  <TouchableOpacity
                    onPress={() => handleRemoveImage(index)}
                    style={styles.removeButton}
                  >
                    <ThemedText style={styles.removeButtonText}>×</ThemedText>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={createFunko.isPending || updateFunko.isPending}
        >
          <ThemedText style={styles.submitButtonText}>
            {createFunko.isPending || updateFunko.isPending
              ? mode === "edit"
                ? "Updating..."
                : "Adding..."
              : mode === "edit"
              ? "Update Funko"
              : "Add Funko"}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  formContainer: {
    padding: 20,
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "black",
  },
  required: {
    color: "red",
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#000",
  },
  inputError: {
    borderColor: "red",
    borderWidth: 2,
  },
  textArea: {
    minHeight: 100,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
  conditionButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  conditionButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    minWidth: 80,
    alignItems: "center",
  },
  conditionButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  conditionButtonText: {
    fontSize: 14,
    textTransform: "capitalize",
    color: "#333333",
  },
  conditionButtonTextActive: {
    color: "white",
    fontWeight: "600",
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addImageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  addImageIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
  },
  addImageIconText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 28,
  },
  addImageText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "600",
  },
  imagesList: {
    marginTop: 8,
    gap: 8,
  },
  imageItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 8,
  },
  imagePathText: {
    fontSize: 14,
    color: "green",
  },
  removeButton: {
    backgroundColor: "#ff3b30",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  removeButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 16,
    color: "black",
  },
  datePlaceholder: {
    color: "#999",
  },
  datePickerButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: 10,
  },
  datePickerButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 12,
    paddingHorizontal: 20,
  },
  datePickerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
