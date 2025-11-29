import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const resources = {
  en: { translation: require("../locales/en/us.json") },
  es: { translation: require("../locales/es/mx.json") },
} as const;

// Set language to device language if supported, else fallback to 'en'
const locales = getLocales();
const deviceLanguageCode = locales[0]?.languageCode ?? "en";
const initialLanguage = ["en", "es"].includes(deviceLanguageCode)
  ? deviceLanguageCode
  : "en";

i18n.use(initReactI18next).init({
  debug: true,
  fallbackLng: "en",
  supportedLngs: ["en", "es"],
  lng: initialLanguage,
  resources,
  defaultNS: "translation",
});

export default i18n;
