"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { LangCode } from "@/lib/languages";

type Translations = Record<string, string>;

const translations: Record<LangCode, Translations> = {
  en: {
    "site.name": "All India Exam Result",
    "site.tagline": "Find verified Sarkari results, government jobs, admit cards & answer keys — all in one blazing-fast portal.",
    "nav.results": "Results", "nav.result": "Result", "nav.latest-jobs": "Latest Vacancy", "nav.latest-job": "Latest Vacancy", "nav.admit-card": "Admit Card",
    "nav.answer-key": "Answer Key", "nav.admissions": "Admissions", "nav.syllabus": "Syllabus",
    "nav.bookmarks": "Bookmarks", "nav.search": "Search",
    "nav.home": "Home", "nav.exam": "Exam", "nav.study-hub": "Study Hub", "nav.tools": "Tools",
    "nav.contact-us": "Contact Us", "nav.about-us": "About Us",
    "nav.current-affairs": "Current Affairs", "nav.mock-test": "Mock Test", "nav.iq-test": "IQ Test", "nav.calendar": "Calendar",
    "search.placeholder": "Search exam, result, job...",
    "hero.title": "Your Gateway to Government Exam Results",
    "hero.trusted": "Trusted exam intelligence since 2024",
    "trending.title": "Trending Now", "latest.title": "Latest Updates",
    "view-all": "View All", "share": "Share",
    "official-website": "Visit Official Website",
    "telegram.title": "Join Telegram", "telegram.btn": "Join Channel",
  },
  hi: {
    "site.name": "अखिल भारत परीक्षा परिणाम",
    "site.tagline": "सरकारी परीणाम, नौकरियां, एडमिट कार्ड और उत्तर कुंजी — सब एक पोर्टल पर।",
    "nav.results": "परिणाम", "nav.result": "परिणाम", "nav.latest-jobs": "नौकरियां", "nav.latest-job": "लेटेस्ट जॉब", "nav.admit-card": "एडमिट कार्ड",
    "nav.answer-key": "उत्तर कुंजी", "nav.admissions": "प्रवेश", "nav.syllabus": "सिलेबस",
    "nav.bookmarks": "बुकमार्क", "nav.search": "खोजें",
    "nav.home": "होम", "nav.exam": "परीक्षा", "nav.study-hub": "स्टडी हब", "nav.tools": "टूल",
    "nav.contact-us": "संपर्क करें", "nav.about-us": "हमारे बारे में",
    "nav.current-affairs": "करंट अफेयर्स", "nav.mock-test": "मॉक टेस्ट", "nav.iq-test": "IQ टेस्ट", "nav.calendar": "कैलेंडर",
    "search.placeholder": "परीक्षा, परिणाम, नौकरी खोजें...",
    "hero.title": "सरकारी परीक्षा परिणामों का प्रवेश द्वार",
    "hero.trusted": "2024 से विश्वसनीय",
    "trending.title": "ट्रेंडिंग", "latest.title": "नवीनतम अपडेट",
    "view-all": "सभी देखें", "share": "शेयर करें",
    "official-website": "आधिकारिक वेबसाइट",
    "telegram.title": "टेलीग्राम ज्वाइन करें", "telegram.btn": "चैनल ज्वाइन करें",
  },
  ta: {
    "site.name": "அகில இந்திய தேர்வு முடிவுகள்",
    "site.tagline": "அரசு தேர்வு முடிவுகள், வேலைகள், அனுமதி அட்டைகள் — எல்லாமே ஒரே இடத்தில்.",
    "nav.results": "முடிவுகள்", "nav.latest-jobs": "அரசு வேலைகள்", "nav.admit-card": "அனுமதி அட்டை",
    "nav.answer-key": "விடையமைப்பு", "nav.admissions": "சேர்க்கை", "nav.syllabus": "பாடத்திட்டம்",
    "nav.bookmarks": "புத்தகக்குறி", "nav.search": "தேடல்",
    "search.placeholder": "தேர்வு, முடிவு, வேலை தேடுங்கள்...",
    "hero.title": "அரசு தேர்வு முடிவுகளுக்கான வாயில்",
    "hero.trusted": "2024 முதல் நம்பகமான தேர்வு தகவல்",
    "trending.title": "இப்போது ட்ரென்டிங்", "latest.title": "சமீபத்திய பதிவுகள்",
    "view-all": "எல்லாம் பார்க்க", "share": "பகிர்",
    "official-website": "அதிகாரப்பூர்வ இணையதளம்",
    "telegram.title": "டெலிகிராம் சேரவும்", "telegram.btn": "சேனல் சேரவும்",
  },
  pa: {
    "site.name": "ਅਖ਼ਿਲ ਭਾਰਤ ਪ੍ਰੀਖਿਆ ਨਤੀਜ਼",
    "site.tagline": "ਸਰਕਾਰੀ ਨਤੀਜ਼ੇ, ਨੌਕਰੀਆਂ, ਪ੍ਰਵੇਸ਼ ਕਾਰਡ — ਸਭ ਇੱਕ ਥਾਂ।",
    "nav.results": "ਨਤੀਜ਼", "nav.latest-jobs": "ਨੌਕਰੀਆਂ", "nav.admit-card": "ਪ੍ਰਵੇਸ਼ ਕਾਰਡ",
    "nav.answer-key": "ਉੱਤਰ ਕੁੰਜੀ", "nav.admissions": "ਦਾਖਲਾ", "nav.syllabus": "ਸਿਲੇਬਸ",
    "nav.bookmarks": "ਬੁੱਕਮਾਰਕ", "nav.search": "ਖੋਜ",
    "search.placeholder": "ਪ੍ਰੀਖਿਆ, ਨਤੀਜ਼ਾ, ਨੌਕਰੀ ਖੋਜੋ...",
    "hero.title": "ਸਰਕਾਰੀ ਪ੍ਰੀਖਿਆ ਨਤੀਜਿਆਂ ਲਈ ਪ੍ਰਵੇਸ਼ ਦੁਆਰਾ",
    "hero.trusted": "2024 ਤੋਂ ਭਰੋਸੇਯੋਗ",
    "trending.title": "ਟ੍ਰੈਂਡਿੰਗ", "latest.title": "ਤਾਜ਼ਾ ਅਪਡੇਟ",
    "view-all": "ਸਭ ਦੇਖੋ", "share": "ਸ਼ੇਅਰ ਕਰੋ",
    "official-website": "ਅਧਿਕਾਰਿਕ ਵੈੱਬਸਾਈਟ",
    "telegram.title": "ਟੈਲੀਗ੍ਰਾਮ ਚੈਨਲ ਜੁਆਈਨ ਕਰੋ", "telegram.btn": "ਚੈਨਲ ਜੁਆਈਨ ਕਰੋ",
  },
  mr: {
    "site.name": "अखिल भारतीय परीक्षा निकाल",
    "site.tagline": "सरकारी निकाल, नोकर्या, प्रवेश पत्र आणि उत्तर तक्ते — सगळे एकाच ठिकाणी.",
    "nav.results": "निकाल", "nav.latest-jobs": "नोकर्या", "nav.admit-card": "प्रवेश पत्र",
    "nav.answer-key": "उत्तर तक्ता", "nav.admissions": "प्रवेश", "nav.syllabus": "अभ्यासक्रम",
    "nav.bookmarks": "बुकमार्क", "nav.search": "शोध",
    "search.placeholder": "परीक्षा, निकाल, नोकरी शोधा...",
    "hero.title": "सरकारी परीक्षा निकालांसाठी द्वार",
    "hero.trusted": "2024 पासून विश्वासार्ह",
    "trending.title": "ट्रेंडिंग", "latest.title": "ताज्या अपडेट्स",
    "view-all": "सर्व पाहा", "share": "शेअर करा",
    "official-website": "अधिकृत वेबसाइट",
    "telegram.title": "टेलीग्रामवर सामील व्हा", "telegram.btn": "चैनल जॉइन करा",
  },
  gu: {
    "site.name": "અખિલ ભારતીય પરીક્ષા પરિણામ",
    "site.tagline": "સરકારી પરિણામો, નોકરીઓ, પ્રવેશ કાર્ડ — બધું એક જગ્યાએ.",
    "nav.results": "પરિણામો", "nav.latest-jobs": "નોકરીઓ", "nav.admit-card": "પ્રવેશ કાર્ડ",
    "nav.answer-key": "જવાબ ચાવી", "nav.admissions": "પ્રવેશ", "nav.syllabus": "અભ્યાસક્રમ",
    "nav.bookmarks": "બુકમાર્ક", "nav.search": "શોધ",
    "search.placeholder": "પરીક્ષા, પરિણામ, નોકરી શોધો...",
    "hero.title": "સરકારી પરીક્ષા પરિણામો માટે દ્વાર",
    "hero.trusted": "2024 થી વિશ્વસનીય",
    "trending.title": "ટ્રેન્ડિંગ", "latest.title": "તાજા અપડેટ",
    "view-all": "બધું જુઓ", "share": "શેર કરો",
    "official-website": "સત્તાવાર વેબસાઇટ",
    "telegram.title": "ટેલીગ્રામ જોડાઓ", "telegram.btn": "ચેનલ જોડાઓ",
  },
  bn: {
    "site.name": "অখিল ভারতীয় পরীক্ষা ফলাফল",
    "site.tagline": "সরকারি ফলাফল, চাকরি, প্রবেশপত্র — সব এক জায়গায়।",
    "nav.results": "ফলাফল", "nav.latest-jobs": "চাকরি", "nav.admit-card": "প্রবেশপত্র",
    "nav.answer-key": "উত্তর পত্র", "nav.admissions": "ভর্তি", "nav.syllabus": "সিলেবাস",
    "nav.bookmarks": "বুকমার্ক", "nav.search": "খোঁজ",
    "search.placeholder": "পরীক্ষা, ফলাফল, চাকরি খুঁজুন...",
    "hero.title": "সরকারি পরীক্ষার ফলাফলের দ্বার",
    "hero.trusted": "2024 থেকে বিশ্বস্ত",
    "trending.title": "ট্রেন্ডিং", "latest.title": "সাম্প্রতিক আপডেট",
    "view-all": "সব দেখুন", "share": "শেয়ার করুন",
    "official-website": "অফিসিয়াল ওয়েবসাইট",
    "telegram.title": "টেলিগ্রামে যোগ দিন", "telegram.btn": "চ্যানেল জয়েন করুন",
  },
  kn: {
    "site.name": "ಅಖಿಲ ಭಾರತ ಪರೀಕ್ಷೆ ಫಲಿತಾಂಶ",
    "site.tagline": "ಸರ್ಕಾರಿ ಫಲಿತಾಂಶ, ಉದ್ಯೋಗ, ಪ್ರವೇಶ ಕಾರ್ಡ್ — ಎಲ್ಲಾ ಒಂದೇ ಜಾಗದಲ್ಲಿ.",
    "nav.results": "ಫಲಿತಾಂಶ", "nav.latest-jobs": "ಉದ್ಯೋಗ", "nav.admit-card": "ಪ್ರವೇಶ ಕಾರ್ಡ್",
    "nav.answer-key": "ಉತ್ತರ ಪತ್ರ", "nav.admissions": "ಭರ್ತಿ", "nav.syllabus": "ಪಠ್ಯಕ್ರಮ",
    "nav.bookmarks": "ಬುಕ್‌ಮಾರ್ಕ್", "nav.search": "ಹುಡುಕು",
    "search.placeholder": "ಪರೀಕ್ಷೆ, ಫಲಿತಾಂಶ, ಉದ್ಯೋಗ ಹುಡುಕಿ...",
    "hero.title": "ಸರ್ಕಾರಿ ಪರೀಕ್ಷೆ ಫಲಿತಾಂಶಗಳಿಗೆ ಪ್ರವೇಶ",
    "hero.trusted": "2024 ರಿಂದ ವಿಶ್ವಾಸಾರ್ಹ",
    "trending.title": "ಟ್ರೆಂಡಿಂಗ್", "latest.title": "ಇತ್ತೀಚಿನ ನವೀಕರಣ",
    "view-all": "ಎಲ್ಲಾ ನೋಡಿ", "share": "ಹಂಚಿಕೊಳ್ಳಿ",
    "official-website": "ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್",
    "telegram.title": "ಟೆಲಿಗ್ರಾಮ್ ಸೇರಿ", "telegram.btn": "ಚಾನಲ್ ಸೇರಿ",
  },
  ml: {
    "site.name": "അഖില ഇന്ത്യൻ പരീക്ഷ ഫലം",
    "site.tagline": "സർക്കാർ ഫലം, ജോലികൾ, അഡ്മിറ്റ് കാർഡ് — എല്ലാം ഒരിടത്ത്.",
    "nav.results": "ഫലം", "nav.latest-jobs": "ജോലികൾ", "nav.admit-card": "അഡ്മിറ്റ് കാർഡ്",
    "nav.answer-key": "ഉത്തര കീ", "nav.admissions": "ചേർക്കൽ", "nav.syllabus": "സിലബസ്",
    "nav.bookmarks": "ബുക്ക്മാർക്ക്", "nav.search": "തിരയൽ",
    "search.placeholder": "പരീക്ഷ, ഫലം, ജോലി തിരയൂ...",
    "hero.title": "സർക്കാർ പരീക്ഷ ഫലങ്ങൾക്കുള്ള കവാടം",
    "hero.trusted": "2024 മുതൽ വിശ്വാസ്യം",
    "trending.title": "ട്രെൻഡിങ്", "latest.title": "ഏറ്റവും പുതിയ അപ്‌ഡേറ്റ്",
    "view-all": "എല്ലാം കാണുക", "share": "ഷെയർ ചെയ്യുക",
    "official-website": "ഔദ്യോഗിക വെബ്‌സൈറ്റ്",
    "telegram.title": "ടെലിഗ്രാം ചേരുക", "telegram.btn": "ചാനൽ ചേരുക",
  },
  te: {
    "site.name": "అఖిల భారత పరీక్ష ఫలితం",
    "site.tagline": "ప్రభుత్వ ఫలితాలు, ఉద్యోగాలు, ప్రవేశ కార్డులు — అన్నీ ఒకే చోట.",
    "nav.results": "ఫలితాలు", "nav.latest-jobs": "ఉద్యోగాలు", "nav.admit-card": "ప్రవేశ కార్డు",
    "nav.answer-key": "జవాబు కీ", "nav.admissions": "ప్రవేశాలు", "nav.syllabus": "సిలబస్",
    "nav.bookmarks": "బుక్‌మార్క్", "nav.search": "వెతుకు",
    "search.placeholder": "పరీక్ష, ఫలితం, ఉద్యోగం వెతుకు...",
    "hero.title": "ప్రభుత్వ పరీక్ష ఫలితాలకు మార్గం",
    "hero.trusted": "2024 నుండి విశ్వసనీయం",
    "trending.title": "ట్రెండింగ్", "latest.title": "తాజా అప్‌డేట్",
    "view-all": "అన్నీ చూడండి", "share": "షేర్ చేయండి",
    "official-website": "అధికారిక వెబ్‌సైట్",
    "telegram.title": "టెలిగ్రామ్ జాయిన్ చేయండి", "telegram.btn": "చానెల్ జాయిన్ చేయండి",
  },
  or: {
    "site.name": "ଅଖିଲ ଭାରତ ପରୀକ୍ଷା ଫଳାଫଳ",
    "site.tagline": "ସରକାରୀ ଫଳାଫଳ, ଚାକରି, ପ୍ରବେଶ ପତ୍ର — ସବୁ ଗୋଟିଏ ସ୍ଥାନରେ।",
    "nav.results": "ଫଳାଫଳ", "nav.latest-jobs": "ଚାକରି", "nav.admit-card": "ପ୍ରବେଶ ପତ୍ର",
    "nav.answer-key": "ଉତ୍ତର ଚାବି", "nav.admissions": "ଭର୍ତି", "nav.syllabus": "ପାଠ୍ୟକ�ମ",
    "nav.bookmarks": "ବୁକ୍‌ମାର୍କ", "nav.search": "ଖୋଜ",
    "search.placeholder": "ପରୀକ୍ଷା, ଫଳାଫଳ, ଚାକରି ଖୋଜ...",
    "hero.title": "ସରକାରୀ ପରୀକ୍ଷା ଫଳାଫଳର ଦ୍ଵାର",
    "hero.trusted": "2024 ଠାରୁ ବିଶ୍ଵସ୍ତ",
    "trending.title": "ଟ୍ରେଣ୍ଡିଂ", "latest.title": "ତାଜା ଅପଡେଟ",
    "view-all": "ସବୁ ଦେଖନ୍ତୁ", "share": "ଶେର କରନ୍ତୁ",
    "official-website": "ଅଧିକୃତ ୱେବସାଇଟ",
    "telegram.title": "ଟେଲିଗ୍ରାମ୍ ଯୋଗାଡନ୍ତୁ", "telegram.btn": "ଚାନେଲ୍ ଯୋଗାଡନ୍ତୁ",
  },
};

type LangContextType = {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  t: (key: string) => string;
};

const LangContext = createContext<LangContextType>({
  lang: "en",
  setLang: () => {},
  t: (k) => k,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("en");

  useEffect(() => {
    const saved = localStorage.getItem("aier_lang") as LangCode | null;
    if (saved && translations[saved]) {
      setLangState(saved);
    }
  }, []);

  const setLang = useCallback((l: LangCode) => {
    setLangState(l);
    try { localStorage.setItem("aier_lang", l); } catch {}
  }, []);

  const t = useCallback((key: string): string => translations[lang]?.[key] || translations.en[key] || key, [lang]);

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

export type { LangCode };
