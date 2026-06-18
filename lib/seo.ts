import type { Metadata } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aiexamresult.com";
export const SITE_NAME = "All India Exam Result";

export function makeMetadata(title: string, description: string, path: string, ogDesc?: string): Metadata {
  const canonical = path === "/" ? "/" : path;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description: ogDesc || description,
      url: `${SITE_URL}${path}`,
      siteName: SITE_NAME,
      locale: "en_IN",
      images: [{ url: `${SITE_URL}/og-image.svg`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description: ogDesc || description,
      images: [`${SITE_URL}/og-image.svg`],
    },
    robots: { index: true, follow: true },
  };
}

export const examSlugs = [
  "ssc", "ssc-cgl", "ssc-chsl", "ssc-mts", "ssc-gd", "ssc-je", "ssc-stenographer", "ssc-cpo",
  "upsc", "upsc-cse", "upsc-ifs", "upsc-nda", "upsc-cds", "upsc-epfo", "upsc-capf",
  "railway", "rrb-ntpc", "rrb-alp", "rrb-group-d", "rrb-je",
  "banking", "ibps-po", "ibps-clerk", "ibps-rrb", "sbi-po", "sbi-clerk", "rbi-grade-b",
  "teaching-exams", "ctet", "uptet", "reet", "bihar-teacher",
  "defence-exams", "indian-army", "indian-navy", "indian-airforce",
  "state-govt-jobs", "up-govt-jobs", "bihar-govt-jobs", "rajasthan-govt-jobs", "mp-govt-jobs", "maharashtra-govt-jobs",
  "board-exams", "cbse-result", "bseb-result", "up-board-result", "rbse-result",
];

export const examNames: Record<string, string> = {
  ssc: "SSC",
  "ssc-cgl": "SSC CGL", "ssc-chsl": "SSC CHSL", "ssc-mts": "SSC MTS", "ssc-gd": "SSC GD Constable",
  "ssc-je": "SSC JE", "ssc-stenographer": "SSC Stenographer", "ssc-cpo": "SSC CPO",
  upsc: "UPSC", "upsc-cse": "UPSC Civil Services", "upsc-ifs": "UPSC IFS",
  "upsc-nda": "UPSC NDA", "upsc-cds": "UPSC CDS", "upsc-epfo": "UPSC EPFO", "upsc-capf": "UPSC CAPF",
  railway: "Railway RRB", "rrb-ntpc": "RRB NTPC", "rrb-alp": "RRB ALP", "rrb-group-d": "RRB Group D", "rrb-je": "RRB JE",
  banking: "Banking", "ibps-po": "IBPS PO", "ibps-clerk": "IBPS Clerk", "ibps-rrb": "IBPS RRB",
  "sbi-po": "SBI PO", "sbi-clerk": "SBI Clerk", "rbi-grade-b": "RBI Grade B",
  "teaching-exams": "Teaching Exams", ctet: "CTET", uptet: "UPTET", reet: "REET", "bihar-teacher": "Bihar Teacher",
  "defence-exams": "Defence Exams", "indian-army": "Indian Army", "indian-navy": "Indian Navy", "indian-airforce": "Indian Air Force",
  "state-govt-jobs": "State Govt Jobs", "up-govt-jobs": "UP Govt Jobs", "bihar-govt-jobs": "Bihar Govt Jobs",
  "rajasthan-govt-jobs": "Rajasthan Govt Jobs", "mp-govt-jobs": "MP Govt Jobs", "maharashtra-govt-jobs": "Maharashtra Govt Jobs",
  "board-exams": "Board Exams", "cbse-result": "CBSE Result", "bseb-result": "Bihar Board Result",
  "up-board-result": "UP Board Result", "rbse-result": "RBSE Result",
};

export const examDescriptions: Record<string, string> = {
  ssc: "Find latest SSC exams 2026 notifications, application forms, admit cards, answer keys and results for CGL, CHSL, MTS, GD, JE, CPO and Stenographer recruitment.",
  "ssc-cgl": "SSC CGL 2026: Get notification, application dates, eligibility, exam pattern, syllabus, admit card, answer key and result for Combined Graduate Level exam.",
  "ssc-chsl": "SSC CHSL 2026: Complete guide for Combined Higher Secondary Level exam including application form, dates, eligibility, admit card and result.",
  "ssc-mts": "SSC MTS 2026: Get Multi Tasking Staff recruitment notification, online application, exam date, admit card, answer key and result updates.",
  "ssc-gd": "SSC GD Constable 2026: Find GD Constable recruitment notification, application form, physical test, written exam, admit card and result details.",
  railway: "Railway RRB 2026: Latest railway recruitment notifications for NTPC, ALP, Group D and JE posts. Get application dates, admit card, answer key and result.",
  "rrb-ntpc": "RRB NTPC 2026: Railway NTPC graduate and undergraduate recruitment notification, online application, exam date, admit card and result updates.",
  banking: "Banking Jobs 2026: Latest bank recruitment notifications for IBPS PO, Clerk, RRB, SBI PO, Clerk and RBI Grade B. Get exam dates and results.",
  upsc: "UPSC 2026: Union Public Service Commission exam notifications for Civil Services, NDA, CDS, EPFO and CAPF. Get application dates and results.",
  ctet: "CTET 2026: Central Teacher Eligibility Test notification, application form, exam date, admit card, answer key and result for teaching jobs.",
  neet: "NEET UG 2026: National Eligibility cum Entrance Test for medical admissions. Get application form, exam date, admit card, answer key and result.",
};

export const states = [
  "uttar-pradesh", "bihar", "rajasthan", "maharashtra", "madhya-pradesh", "delhi",
  "west-bengal", "tamil-nadu", "karnataka", "gujarat", "odisha", "jharkhand",
  "uttarakhand", "haryana", "punjab", "andhra-pradesh", "telangana", "kerala",
  "assam", "chhattisgarh", "himachal-pradesh", "jammu-kashmir",
];

export const stateNames: Record<string, string> = {
  "uttar-pradesh": "Uttar Pradesh", "bihar": "Bihar", "rajasthan": "Rajasthan",
  "maharashtra": "Maharashtra", "madhya-pradesh": "Madhya Pradesh", "delhi": "Delhi",
  "west-bengal": "West Bengal", "tamil-nadu": "Tamil Nadu", "karnataka": "Karnataka",
  "gujarat": "Gujarat", "odisha": "Odisha", "jharkhand": "Jharkhand",
  "uttarakhand": "Uttarakhand", "haryana": "Haryana", "punjab": "Punjab",
  "andhra-pradesh": "Andhra Pradesh", "telangana": "Telangana", "kerala": "Kerala",
  "assam": "Assam", "chhattisgarh": "Chhattisgarh", "himachal-pradesh": "Himachal Pradesh",
  "jammu-kashmir": "Jammu and Kashmir",
};
