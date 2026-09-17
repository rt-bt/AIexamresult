import type { Metadata } from "next";

const stateNames: Record<string, string> = {
  "uttar-pradesh": "Uttar Pradesh", up: "Uttar Pradesh",
  bihar: "Bihar",
  rajasthan: "Rajasthan",
  "madhya-pradesh": "Madhya Pradesh", mp: "Madhya Pradesh",
  maharashtra: "Maharashtra",
  delhi: "Delhi",
  haryana: "Haryana",
  punjab: "Punjab",
  uttarakhand: "Uttarakhand", uk: "Uttarakhand",
  jharkhand: "Jharkhand",
  odisha: "Odisha",
  "west-bengal": "West Bengal", wb: "West Bengal",
  gujarat: "Gujarat",
  karnataka: "Karnataka",
  "tamil-nadu": "Tamil Nadu", tn: "Tamil Nadu",
  "andhra-pradesh": "Andhra Pradesh", ap: "Andhra Pradesh",
  telangana: "Telangana",
  kerala: "Kerala",
  assam: "Assam",
  chhattisgarh: "Chhattisgarh",
  "himachal-pradesh": "Himachal Pradesh", hp: "Himachal Pradesh",
  "jammu-kashmir": "Jammu and Kashmir", jk: "Jammu and Kashmir",
};

const stateDescriptions: Record<string, string> = {
  "uttar-pradesh": "UP Sarkari result 2026: Latest Uttar Pradesh government job notifications, exam results, admit cards and answer keys from UPSSSC, UPPSC, and UP Police.",
  up: "UP Sarkari result 2026: Latest Uttar Pradesh government job notifications, exam results, admit cards and answer keys from UPSSSC, UPPSC, and UP Police.",
  bihar: "Bihar Sarkari result 2026: Latest Bihar government job notifications, exam results, admit cards and answer keys from BPSC, Bihar Police, and Bihar Board.",
  rajasthan: "Rajasthan Sarkari result 2026: Latest Rajasthan government job notifications, exam results, admit cards from RPSC, RSMSSB, Rajasthan Police and state exams.",
  "madhya-pradesh": "MP Sarkari result 2026: Latest Madhya Pradesh government job notifications, exam results, admit cards from MPPSC, MP Police, MP Board and state exams.",
  mp: "MP Sarkari result 2026: Latest Madhya Pradesh government job notifications, exam results, admit cards from MPPSC, MP Police, MP Board and state exams.",
  maharashtra: "Maharashtra Sarkari result 2026: Latest Maharashtra government job notifications, exam results, admit cards from MPSC, Maharashtra Police and state exams.",
  delhi: "Delhi Sarkari result 2026: Latest Delhi government job notifications, exam results, admit cards from DSSSB, Delhi Police, High Court and Delhi exams.",
  haryana: "Haryana Sarkari result 2026: Latest Haryana government job notifications, exam results, admit cards from HSSC, HPSC, Haryana Police and state exams.",
  punjab: "Punjab Sarkari result 2026: Latest Punjab government job notifications, exam results, admit cards from PPSC, Punjab Police, PSSSB and state exams.",
  uttarakhand: "Uttarakhand Sarkari result 2026: Latest Uttarakhand government job notifications, exam results, admit cards from UKPSC, UKSSSC, and Uttarakhand Police.",
  uk: "Uttarakhand Sarkari result 2026: Latest Uttarakhand government job notifications, exam results, admit cards from UKPSC, UKSSSC, and Uttarakhand Police.",
  jharkhand: "Jharkhand Sarkari result 2026: Latest Jharkhand government job notifications, exam results, admit cards from JSSC, JPSC, Jharkhand Police and state exams.",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const stateName = stateNames[slug] || slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const desc = stateDescriptions[slug] || `Check latest ${stateName} government job notifications, Sarkari exam results, admit cards, and answer keys 2026 at All India Exam Result.`;
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
