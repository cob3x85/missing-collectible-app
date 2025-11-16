import { ThemedText } from "@/components/themed-text";
import { Funko } from "@/database/schema";
import { useCreateFunko, useUpdateFunko } from "@/hooks/useFunkos";
import { images } from "@/services/images";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
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
  purchase_price: yup
    .number()
    .positive("Price must be a positive number")
    .max(999999, "Price is too high"),
  current_value: yup
    .number()
    .positive("Value must be a positive number")
    .max(999999, "Value is too high"),
  purchase_date: yup
    .string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  notes: yup.string().max(500, "Notes must be less than 500 characters"),
  hasProtectorCase: yup.boolean().optional(),
});

type FunkoFormData = {
  name: string;
  series: string;
  number: string;
  category: string;
  condition: "mint" | "near_mint" | "good" | "fair" | "poor";
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
  const [formData, setFormData] = useState<FunkoFormData>({
    name: initialData?.name || "",
    series: initialData?.series || "",
    number: initialData?.number || "",
    category: initialData?.category || "Pop!",
    condition: initialData?.condition || "mint",
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
      Alert.alert("Success", "Funko added successfully!");
      // Reset form
      setFormData({
        name: "",
        series: "",
        number: "",
        category: "Pop!",
        condition: "mint",
        purchase_price: "",
        current_value: "",
        purchase_date: "",
        notes: "",
        hasProtectorCase: false,
      });
      setImagePaths([]);
      setErrors({});
      onSuccess?.();
    },
    onError: (error: unknown) => {
      Alert.alert("Error", (error as Error).message || "Failed to add Funko");
    },
  });

  const updateFunko = useUpdateFunko({
    onSuccess: () => {
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
          purchase_price: formData.purchase_price
            ? parseFloat(formData.purchase_price)
            : undefined,
          current_value: formData.current_value
            ? parseFloat(formData.current_value)
            : undefined,
          purchase_date: formData.purchase_date || undefined,
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
          purchase_price: formData.purchase_price
            ? parseFloat(formData.purchase_price)
            : undefined,
          current_value: formData.current_value
            ? parseFloat(formData.current_value)
            : undefined,
          purchase_date: formData.purchase_date || undefined,
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
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        {/* <Pressable onPress={() => {}}>
          <ThemedText>Auto Fill</ThemedText>
        </Pressable> */}

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
          />
          {errors.notes && (
            <ThemedText style={styles.errorText}>{errors.notes}</ThemedText>
          )}
        </View>

        {/* Image Picker */}
        <View style={styles.fieldContainer}>
          <ThemedText style={styles.label}>Images</ThemedText>
          <Button title="Add Image" onPress={handlePickImage} />
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
    backgroundColor: Platform.OS === "web" ? "white" : "transparent",
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
