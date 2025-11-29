// import the original type declarations
import "i18next";
// Import your translation JSON files
import en from "../../locales/en/us.json";
import es from "../../locales/es/mx.json";
import it from "../../locales/it/it.json";
import fr from "../../locales/fr/fr.json";
import de from "../../locales/de/de.json";


declare module "i18next" {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    resources: {
      en: typeof en;
      es: typeof es;
      it: typeof it;
      fr: typeof fr;
      de: typeof de; 
    };
  }
}
