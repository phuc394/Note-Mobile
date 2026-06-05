import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import vi from "./vi.json";

export const LANGUAGE_STORAGE_KEY = "note_mobile_language";
export const LANGUAGE_OPTIONS = [
  { code: "vi", label: "Tiếng Việt" },
  { code: "en", label: "English" },
];

const resources = {
  en: { translation: en },
  vi: { translation: vi },
};

const getDeviceLanguage = () => {
  const languageCode = Localization.getLocales?.()[0]?.languageCode;
  return languageCode === "vi" ? "vi" : "en";
};

export const initI18n = async () => {
  const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
  const language = savedLanguage || getDeviceLanguage();

  if (!i18n.isInitialized) {
    await i18n.use(initReactI18next).init({
      compatibilityJSON: "v4",
      resources,
      lng: language,
      fallbackLng: "en",
      react: {
        useSuspense: false,
      },
      interpolation: {
        escapeValue: false,
      },
    });
    return i18n;
  }

  await i18n.changeLanguage(language);
  return i18n;
};

export const changeAppLanguage = async (language) => {
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  await i18n.changeLanguage(language);
};

initI18n();

export default i18n;
