// import the original type declarations
import "i18next";
// Import your translation JSON files
import en from "../../locales/en/us.json";
import es from "../../locales/es/mx.json";

declare module "i18next" {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    resources: {
      en: typeof en;
      es: typeof es;
    };
  }
}
