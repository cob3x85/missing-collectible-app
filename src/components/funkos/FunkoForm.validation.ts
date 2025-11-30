import { TFunction } from "i18next";
import * as yup from "yup";

export const getFunkoFormValidationSchema = (t: TFunction) =>
  yup.object().shape({
    name: yup
      .string()
      .required(t("validations.required", { field: "name" }))
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be less than 100 characters"),
    series: yup
      .string()
      .min(2, "Series must be at least 2 characters")
      .max(100, "Series must be less than 100 characters"),
    number: yup
      .string()
      .required("Item number is required")
      .matches(/^[0-9]+$/, "Number must contain only digits"),
    category: yup.string().max(50, "Category must be less than 50 characters"),
    condition: yup
      .string()
      .required("Condition is required")
      .oneOf(
        ["mint", "near_mint", "good", "fair", "poor"],
        t("validations.invalidCondition", { field: "condition" })
      ),
    size: yup
      .string()
      .oneOf(
        ["standard", "super_sized", "jumbo"],
        t("validations.invalidCondition", { field: "size" })
      )
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
          "limited_edition",
          "other",
        ],
        t("validations.invalidCondition", { field: "type" })
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
        t("validations.invalidCondition", { field: "variant" })
      )
      .optional(),
    purchase_price: yup
      .number()
      .transform((value, originalValue) =>
        originalValue === "" || originalValue === null ? null : value
      )
      .positive(t("validations.positiveNumber", { field: "purchase price" }))
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
