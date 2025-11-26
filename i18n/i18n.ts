import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const defaultNS = "ns1";
export const resources = {
  en: {
    ns1: require("../locales/en/us.json"),
  },
  es: {
    ns2: require("../locales/es/mx.json"),
  },
} as const;

i18n.use(initReactI18next).init({
  debug: true,
  fallbackLng: "en",
  lng: "en",
  supportedLngs: ["en", "es"],
  ns: ["ns1", "ns2"],
  defaultNS,
  resources,
});

export default i18n;
