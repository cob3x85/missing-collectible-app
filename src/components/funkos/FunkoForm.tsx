import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useCreateFunko, useUpdateFunko } from "@/hooks/useFunkos";
import { images } from "@/services/images";
import { FunkoFormData, FunkoFormProps } from "@/types/FunkoForms";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
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
import { getFunkoFormValidationSchema } from "./FunkoForm.validation";


const HOME_ROUTE = Platform.OS === "ios" ? "Home" : "index";

export default function FunkoForm({
  mode = "create",
  initialData,
  onSuccess,
}: FunkoFormProps) {
  const selectionColor = useThemeColor({}, "selectionColor");
  const scrollViewRef = useRef<ScrollView>(null);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const funkoValidationSchema = getFunkoFormValidationSchema(t);


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

  const [imagePaths, setImagePaths] = useState<string[]>(() => {
    if (initialData?.image_data) {
      try {
        const base64Array = JSON.parse(initialData.image_data);
        return base64Array.map(
          (base64: string) => `data:image/jpeg;base64,${base64}`
        );
      } catch (error) {
        console.warn("Failed to parse image_data:", error);
      }
    }
    return [];
  });
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

      // Load images from image_data (base64 only)
      if (initialData.image_data) {
        try {
          const base64Array = JSON.parse(initialData.image_data);
          setImagePaths(
            base64Array.map(
              (base64: string) => `data:image/jpeg;base64,${base64}`
            )
          );
        } catch (error) {
          console.warn("Failed to parse image_data:", error);
          setImagePaths([]);
        }
      } else {
        setImagePaths([]);
      }
    }
  }, [
    initialData?.id,
    initialData?.has_protector_case,
    initialData?.image_data,
  ]);

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
      navigation.navigate(HOME_ROUTE as never);
      Alert.alert(t("success.title"), t("success.itemAddedSuccessfully"));
      onSuccess?.();
    },
    onError: (error: unknown) => {
      Alert.alert(t("errors.title"), (error as Error).message || t("errors.itemAddFailed"));
    },
  });

  const updateFunko = useUpdateFunko({
    onSuccess: () => {
      // Navigate to Home screen
      navigation.navigate(HOME_ROUTE as never);
      Alert.alert(t("success.title"), t("success.itemUpdatedSuccessfully"));
      onSuccess?.();
    },
    onError: (error: unknown) => {
      Alert.alert(
        t("errors.title"),
        (error as Error).message || t("errors.itemUpdateFailed")
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
      Alert.alert(t("errors.title"), (error as Error).message || t("errors.imagePickFailed"));
    }
  };

  const handleTakePhoto = async () => {
    try {
      const path = await images.takePhoto();
      if (path) {
        setImagePaths((prev) => [...prev, path]);
      }
    } catch (error) {
      Alert.alert(t("errors.title"), (error as Error).message || t("errors.imageCaptureFailed"));
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

      // Convert data URI images to base64 strings for database storage
      const base64Images = imagePaths.map((path) => {
        // Extract base64 from data URI (data:image/jpeg;base64,xxx)
        if (path.startsWith("data:image")) {
          return path.split(",")[1]; // Get the base64 part
        }
        return path; // Keep legacy file paths as-is for backward compatibility
      });

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
          image_data:
            base64Images.length > 0 ? JSON.stringify(base64Images) : undefined,
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
          image_data:
            base64Images.length > 0 ? JSON.stringify(base64Images) : undefined,
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
        Alert.alert(t("validations.title"), err.errors[0]);
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
            {t("add.name")} <ThemedText style={styles.required}>*</ThemedText>
          </ThemedText>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            placeholder={t("add.placeholders.name")}
            placeholderTextColor="#666666"
            value={formData.name}
            onChangeText={(value) => updateField("name", value)}
            autoCapitalize="words"
            selectionColor={selectionColor}
            autoCorrect={false}
          />
          {errors.name && (
            <ThemedText style={styles.errorText}>{errors.name}</ThemedText>
          )}
        </View>

        {/* Series Field */}
        <View style={styles.fieldContainer}>
          <ThemedText style={styles.label}>{t("add.series")}
            <ThemedText style={styles.required}> *</ThemedText>
          </ThemedText>
          <TextInput
            style={[styles.input, errors.series && styles.inputError]}
            placeholder={t("add.placeholders.series")}
            placeholderTextColor="#666666"
            value={formData.series}
            onChangeText={(value) => updateField("series", value)}
            autoCapitalize="words"
            selectionColor={selectionColor}
            autoCorrect={false}
          />
          {errors.series && (
            <ThemedText style={styles.errorText}>{errors.series}</ThemedText>
          )}
        </View>

        {/* Number Field */}
        <View style={styles.fieldContainer}>
          <ThemedText style={styles.label}>
            {t("add.number")} <ThemedText style={styles.required}>*</ThemedText>
          </ThemedText>
          <TextInput
            style={[styles.input, errors.number && styles.inputError]}
            placeholder={t("add.placeholders.number")}
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
          <ThemedText style={styles.label}>{t("add.category")}</ThemedText>
          <TextInput
            style={[styles.input, errors.category && styles.inputError]}
            placeholder={t("add.placeholders.category")}
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
            {t("add.condition")}{" "}
            <ThemedText style={styles.required}>*</ThemedText>
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
                    {t(`add.options.condition.${condition}`)}
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
          <ThemedText style={styles.label}>{t("add.size")}</ThemedText>
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
                  {t(`add.options.size.${size}`)}
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
          <ThemedText style={styles.label}>{t("add.type")}</ThemedText>
          <View style={styles.conditionButtons}>
            {(
              [
                "standard_pop",
                "pop_deluxe",
                "pop_2pack",
                "soda",
                "limited_edition",
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
                  {t(`add.options.type.${type}`)}
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
          <ThemedText style={styles.label}>{t("add.variant")}</ThemedText>
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
                   {t(`add.options.variant.${variant}`)}
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
            <ThemedText style={styles.label}>
              {t("add.hasProtectorCase")}
            </ThemedText>
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
          <ThemedText style={styles.label}>{t("add.purchasePrice")}</ThemedText>
          <TextInput
            style={[styles.input, errors.purchase_price && styles.inputError]}
            placeholder={t("add.placeholders.purchasePrice")}
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
          <ThemedText style={styles.label}>{t("add.currentValue")}</ThemedText>
          <TextInput
            style={[styles.input, errors.current_value && styles.inputError]}
            placeholder={t("add.placeholders.currentValue")}
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
          <ThemedText style={styles.label}>{t("add.purchaseDate")}</ThemedText>
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
              {formData.purchase_date || t("add.placeholders.selectDate")}
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
                      {t("add.placeholders.dateSelected")}
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>

        {/* Notes Field */}
        <View style={styles.fieldContainer}>
          <ThemedText style={styles.label}>{t("add.notes")}</ThemedText>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              errors.notes && styles.inputError,
            ]}
            placeholder={t("add.placeholders.notes")}
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
          <ThemedText style={styles.label}>{t("add.images")}</ThemedText>
          <View style={styles.imageButtonsRow}>
            <TouchableOpacity
              style={[styles.addImageButton, styles.imageButtonHalf]}
              onPress={handlePickImage}
            >
              <View style={styles.addImageIcon}>
                <ThemedText style={styles.addImageIconText}>📷</ThemedText>
              </View>
              <ThemedText style={styles.addImageText}>
                {t("add.gallery")}
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.addImageButton, styles.imageButtonHalf]}
              onPress={handleTakePhoto}
            >
              <View style={styles.addImageIcon}>
                <ThemedText style={styles.addImageIconText}>📸</ThemedText>
              </View>
              <ThemedText style={styles.addImageText}>
                {t("add.camera")}
              </ThemedText>
            </TouchableOpacity>
          </View>
          {imagePaths.length > 0 && (
            <View style={styles.imagesList}>
              {imagePaths.map((path, index) => (
                <View key={index} style={styles.imageItem}>
                  <ThemedText style={styles.imagePathText}>
                    {t("add.image")} {index + 1} ✓
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
                ? t("add.placeholders.updating")
                : t("add.placeholders.adding")
              : mode === "edit"
              ? t("add.placeholders.updateItem")
              : t("add.placeholders.addItem")}
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
  imageButtonsRow: {
    flexDirection: "row",
    gap: 12,
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
  imageButtonHalf: {
    flex: 1,
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
