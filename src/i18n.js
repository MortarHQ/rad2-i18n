import { createI18n } from "vue-i18n";
import en_us from "./ftbqkeys/kubejs/assets/kubejs/lang/en_us.json";

// create i18n instance with options
export const i18n = createI18n({
  locale: "en_us",
  fallbackLocale: "en_us",
  messages: {
    en_us,
  },
});
