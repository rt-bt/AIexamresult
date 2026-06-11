"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type Lang = "en" | "hi";

const translations: Record<Lang, Record<string, string>> = {
  en: {
    "site.name": "All India Exam Result",
    "site.tagline": "Find verified Sarkari results, government jobs, admit cards & answer keys — all in one blazing-fast portal.",
    "nav.results": "Results",
    "nav.latest-jobs": "Latest Jobs",
    "nav.admit-card": "Admit Card",
    "nav.answer-key": "Answer Key",
    "nav.admissions": "Admissions",
    "nav.syllabus": "Syllabus",
    "nav.bookmarks": "Bookmarks",
    "nav.search": "Search",
    "search.placeholder": "Search exam, result, job...",
    "search.results-for": "results found for",
    "search.no-results": "No results found for",
    "search.try-different": "Try a different keyword",
    "hero.title": "Your Gateway to Government Exam Results",
    "hero.trusted": "Trusted exam intelligence since 2024",
    "stats.results": "Results Tracked",
    "stats.jobs": "Active Job Posts",
    "stats.admit-cards": "Admit Card Alerts",
    "trending.title": "Trending Now",
    "trending.subtitle": "Most viewed posts today",
    "latest.title": "Latest Updates",
    "latest.subtitle": "Newest exam notifications and job alerts",
    "bookmarks.title": "Saved Posts",
    "bookmarks.empty": "No saved posts yet",
    "bookmarks.hint": "Bookmark posts to read later",
    "bookmarks.save": "Save for Later",
    "bookmarks.saved": "Saved",
    "bookmarks.remove": "Remove bookmark",
    "bookmarks.count": "posts saved",
    "footer.disclaimer": "Disclaimer: This is an independent information portal. All data is sourced from publicly available government notifications and sarkariexam.com.",
    "footer.copyright": "All rights reserved.",
    "filter.all": "All",
    "filter.filters": "Filters",
    "filter.sort-newest": "Newest First",
    "filter.sort-oldest": "Oldest First",
    "state.title": "State-wise Exam Results & Jobs",
    "state.desc": "Find government jobs, results and admit cards by state",
    "state.posts-found": "posts found for",
    "new.badge": "NEW",
    "view-all": "View All",
    "official-website": "Visit Official Website",
    "important-dates": "Important Dates",
    "application-fee": "Application Fee",
    "important-links": "Important Links",
    "share": "Share",
    "telegram.title": "Join Telegram",
    "telegram.desc": "Get instant exam alerts and result notices.",
    "telegram.btn": "Join Channel",
    "post.not-found": "Post not found",
    "post.not-found-desc": "The page you are looking for does not exist.",
    "coming-soon": "Coming Soon",
    "coming-soon-desc": "Updates for this section will appear shortly.",
  },
  hi: {
    "site.name": "अखिल भारत परीक्षा परिणाम",
    "site.tagline": "सरकारी परिणाम, सरकारी नौकरियां, एडमिट कार्ड और उत्तर कुंजी — सब एक तेज़ पोर्टल पर।",
    "nav.results": "परिणाम",
    "nav.latest-jobs": "नवीनतम नौकरियां",
    "nav.admit-card": "एडमिट कार्ड",
    "nav.answer-key": "उत्तर कुंजी",
    "nav.admissions": "प्रवेश",
    "nav.syllabus": "सिलेबस",
    "nav.bookmarks": "बुकमार्क",
    "nav.search": "खोजें",
    "search.placeholder": "परीक्षा, परिणाम, नौकरी खोजें...",
    "search.results-for": "परिणाम मिले",
    "search.no-results": "के लिए कोई परिणाम नहीं मिला",
    "search.try-different": "कोई दूसरा कीवर्ड आज़माएं",
    "hero.title": "सरकारी परीक्षा परिणामों का प्रवेश द्वार",
    "hero.trusted": "2024 से विश्वसनीय परीक्षा जानकारी",
    "stats.results": "परिणाम ट्रैक किए गए",
    "stats.jobs": "सक्रिय नौकरी पोस्ट",
    "stats.admit-cards": "एडमिट कार्ड अलर्ट",
    "trending.title": "ट्रेंडिंग",
    "trending.subtitle": "आज के सबसे देखे जा रहे पोस्ट",
    "latest.title": "नवीनतम अपडेट",
    "latest.subtitle": "नई परीक्षा सूचनाएं और नौकरी अलर्ट",
    "bookmarks.title": "सेव किए गए पोस्ट",
    "bookmarks.empty": "अभी तक कोई पोस्ट सेव नहीं किया",
    "bookmarks.hint": "बाद में पढ़ने के लिए पोस्ट सेव करें",
    "bookmarks.save": "बाद के लिए सेव करें",
    "bookmarks.saved": "सेव हो गया",
    "bookmarks.remove": "बुकमार्क हटाएं",
    "bookmarks.count": "पोस्ट सेव",
    "footer.disclaimer": "अस्वीकरण: यह एक स्वतंत्र सूचना पोर्टल है। सभी डेटा सार्वजनिक रूप से उपलब्ध सरकारी सूचनाओं और sarkariexam.com से लिया गया है।",
    "footer.copyright": "सर्वाधिकार सुरक्षित।",
    "filter.all": "सभी",
    "filter.filters": "फ़िल्टर",
    "filter.sort-newest": "नए पहले",
    "filter.sort-oldest": "पुराने पहले",
    "state.title": "राज्यवार परीक्षा परिणाम और नौकरियां",
    "state.desc": "राज्य के अनुसार सरकारी नौकरियां, परिणाम और एडमिट कार्ड खोजें",
    "state.posts-found": "पोस्ट मिले",
    "new.badge": "नया",
    "view-all": "सभी देखें",
    "official-website": "आधिकारिक वेबसाइट देखें",
    "important-dates": "महत्वपूर्ण तिथियां",
    "application-fee": "आवेदन शुल्क",
    "important-links": "महत्वपूर्ण लिंक",
    "share": "शेयर करें",
    "telegram.title": "टेलीग्राम ज्वाइन करें",
    "telegram.desc": "तुरंत परीक्षा अलर्ट और परिणाम सूचनाएं प्राप्त करें।",
    "telegram.btn": "चैनल ज्वाइन करें",
    "post.not-found": "पोस्ट नहीं मिला",
    "post.not-found-desc": "आप जिस पेज की तलाश कर रहे हैं वह मौजूद नहीं है।",
    "coming-soon": "जल्द आ रहा है",
    "coming-soon-desc": "इस सेक्शन के अपडेट जल्द दिखाई देंगे।",
  },
};

type LangContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
};

const LangContext = createContext<LangContextType>({
  lang: "en",
  setLang: () => {},
  t: (k) => k,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("aier_lang") as Lang | null;
    if (saved === "en" || saved === "hi") setLangState(saved);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("aier_lang", l); } catch {}
  }, []);

  const t = useCallback((key: string): string => translations[lang][key] || key, [lang]);

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
