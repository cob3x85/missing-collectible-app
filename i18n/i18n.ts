import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const resources = {
  en: { translation: require("../locales/en/us.json") },
  es: { translation: require("../locales/es/mx.json") },
  it: { translation: require("../locales/it/it.json") },
  fr: { translation: require("../locales/fr/fr.json") },
  de: { translation: require("../locales/de/de.json") },
} as const;

// Get device locale and extract base language (e.g., 'es' from 'es-MX')
const locales = getLocales();
const deviceLanguageTag = locales[0]?.languageTag ?? "en";
const baseDeviceLanguage = deviceLanguageTag.split("-")[0];

const supportedLanguages = ["en", "es", "it", "fr", "de"];
const initialLanguage = supportedLanguages.includes(baseDeviceLanguage)
  ? baseDeviceLanguage
  : "en";

i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: "en",
  supportedLngs: supportedLanguages,
  defaultNS: "translation",
  debug: true,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;