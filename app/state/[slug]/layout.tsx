import type { Metadata } from "next";

const stateNames: Record<string, string> = {
  "uttar-pradesh": "Uttar Pradesh", bihar: "Bihar", rajasthan: "Rajasthan",
  "madhya-pradesh": "Madhya Pradesh", maharashtra: "Maharashtra", delhi: "Delhi",
  haryana: "Haryana", punjab: "Punjab", uttarakhand: "Uttarakhand",
  jharkhand: "Jharkhand", odisha: "Odisha", "west-bengal": "West Bengal",
  gujarat: "Gujarat", karnataka: "Karnataka", "tamil-nadu": "Tamil Nadu",
  "andhra-pradesh": "Andhra Pradesh", telangana: "Telangana", kerala: "Kerala",
  assam: "Assam", chhattisgarh: "Chhattisgarh",
  "himachal-pradesh": "Himachal Pradesh", "jammu-kashmir": "Jammu and Kashmir",
};

const stateDescriptions: Record<string, string> = {
  "uttar-pradesh": "UP Sarkari result 2026: Latest Uttar Pradesh government job notifications, exam results, admit cards and answer keys from UPSSSC, UPPSC, UP Police and other UP state exams.",
  bihar: "Bihar Sarkari result 2026: Latest Bihar government job notifications, exam results, admit cards and answer keys from BPSC, Bihar Police, Bihar Board and other Bihar state exams.",
  rajasthan: "Rajasthan Sarkari result 2026: Latest Rajasthan government job notifications, exam results, admit cards from RPSC, RSMSSB, Rajasthan Police and other state exams.",
  "madhya-pradesh": "MP Sarkari result 2026: Latest Madhya Pradesh government job notifications, exam results, admit cards from MPPSC, MP Police, MP Board and other state exams.",
  maharashtra: "Maharashtra Sarkari result 2026: Latest Maharashtra government job notifications, exam results, admit cards from MPSC, Maharashtra Police and other state exams.",
  delhi: "Delhi Sarkari result 2026: Latest Delhi government job notifications, exam results, admit cards from DSSSB, Delhi Police, Delhi High Court and other Delhi exams.",
  haryana: "Haryana Sarkari result 2026: Latest Haryana government job notifications, exam results, admit cards from HSSC, HPSC, Haryana Police and other state exams.",
  punjab: "Punjab Sarkari result 2026: Latest Punjab government job notifications, exam results, admit cards from PPSC, Punjab Police, PSSSB and other state exams.",
  uttarakhand: "Uttarakhand Sarkari result 2026: Latest Uttarakhand government job notifications, exam results, admit cards from UKPSC, UKSSSC, Uttarakhand Police and other state exams.",
  jharkhand: "Jharkhand Sarkari result 2026: Latest Jharkhand government job notifications, exam results, admit cards from JSSC, JPSC, Jharkhand Police and other state exams.",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const stateName = stateNames[slug] || slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const desc = stateDescriptions[slug] || `Latest ${stateName} Sarkari result, government job notifications, exam results, admit cards and answer key updates 2026.`;
  return {
    title: `${stateName} Sarkari Result 2026 - Govt Jobs, Admit Card, Answer Key`,
    description: desc,
    alternates: { canonical: `/state/${slug}` },
    openGraph: { title: `${stateName} Sarkari Result 2026 | All India Exam Result`, description: desc },
    twitter: { card: "summary_large_image", title: `${stateName} Sarkari Result 2026 | All India Exam Result`, description: desc },
    robots: { index: true, follow: true },
  };
}

export default function StateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
