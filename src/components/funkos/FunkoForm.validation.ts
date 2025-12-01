import { TFunction } from "i18next";
import * as yup from "yup";

export const getFunkoFormValidationSchema = (t: TFunction) =>
  yup.object().shape({
    name: yup
      .string()
      .required(t("validations.required", { field: "Name" }))
      .min(2, t("validations.minLength", { field: "Name", min: 2 }))
      .max(100, t("validations.maxLength", { field: "Name", max: 100 })),
    series: yup
      .string()
      .required(t("validations.required", { field: "Series" }))
      .min(2, t("validations.minLength", { field: "Series", min: 2 }))
      .max(100, t("validations.maxLength", { field: "Series", max: 100 })),
    number: yup
      .string()
      .required(t("validations.required", { field: "Number" }))
      .matches(/^[0-9]+$/, t("validations.onlyDigits", { field: "Number" })),
    category: yup.string().max(50, t("validations.maxLength", { field: "Category", max: 50 })),
    condition: yup
      .string()
      .required(t("validations.required", { field: "Condition" }))
      .oneOf(
        ["mint", "near_mint", "good", "fair", "poor"],
        t("validations.invalidCondition", { field: "Condition" })
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
      //   .max(999999, "Price is too high")
      .nullable()
      .optional(),
    current_value: yup
      .number()
      .transform((value, originalValue) =>
        originalValue === "" || originalValue === null ? null : value
      )
      .positive(t("validations.positiveNumber", { field: "current value" }))
      //   .max(999999, "Value is too high")
      .nullable()
      .optional(),
    purchase_date: yup
      .string()
      .transform((value) => (value === "" ? null : value))
      .matches(/^\d{4}-\d{2}-\d{2}$/, t("validations.dateFormat"))
      .nullable()
      .optional(),
    notes: yup.string().max(500, t("validations.notesLength", { max: 500 })),
    hasProtectorCase: yup.boolean().optional(),
  });
