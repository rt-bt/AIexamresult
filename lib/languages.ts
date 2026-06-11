export type LangCode = "en" | "hi" | "ta" | "pa" | "mr" | "gu" | "bn" | "kn" | "ml" | "te" | "or";

export interface LangInfo {
  code: LangCode;
  name: string;
  native: string;
  states: string[];
}

export const languages: LangInfo[] = [
  { code: "en", name: "English", native: "English", states: [] },
  { code: "hi", name: "Hindi", native: "हिन्दी", states: ["uttar-pradesh", "bihar", "madhya-pradesh", "rajasthan", "haryana", "delhi", "himachal-pradesh", "uttarakhand", "jharkhand", "chhattisgarh"] },
  { code: "ta", name: "Tamil", native: "தமிழ்", states: ["tamil-nadu"] },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ", states: ["punjab"] },
  { code: "mr", name: "Marathi", native: "मराठी", states: ["maharashtra", "goa"] },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી", states: ["gujarat"] },
  { code: "bn", name: "Bengali", native: "বাংলা", states: ["west-bengal", "assam"] },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ", states: ["karnataka"] },
  { code: "ml", name: "Malayalam", native: "മലയാളം", states: ["kerala"] },
  { code: "te", name: "Telugu", native: "తెలుగు", states: ["andhra-pradesh", "telangana"] },
  { code: "or", name: "Odia", native: "ଓଡ଼ିଆ", states: ["odisha"] },
];

export const stateToLang: Record<string, LangCode> = {};
for (const lang of languages) {
  for (const state of lang.states) {
    stateToLang[state] = lang.code;
  }
}

export function getLangForState(stateSlug: string): LangCode {
  return stateToLang[stateSlug] || "hi";
}
