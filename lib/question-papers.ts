export interface QuestionPaper {
  id: string;
  exam: string;
  examSlug: string;
  year: number;
  title: string;
  type: "Prelims" | "Mains" | "Both";
  hasAnswerKey: boolean;
  hasSolution: boolean;
  pdfs: { label: string; url: string }[];
  sourceLabel: string;
}

const papers: QuestionPaper[] = [
  {
    id: "upsc-cse-prelims-2024",
    exam: "UPSC Civil Services",
    examSlug: "upsc-cse",
    year: 2024,
    title: "Civil Services (Preliminary) Examination 2024",
    type: "Prelims",
    hasAnswerKey: true,
    hasSolution: false,
    pdfs: [
      { label: "General Studies Paper I", url: "https://upsc.gov.in/sites/default/files/2024-06/CS-Prelims-2024-GS-1-Eng-22062024.pdf" },
      { label: "General Studies Paper II (CSAT)", url: "https://upsc.gov.in/sites/default/files/2024-06/CS-Prelims-2024-GS-2-Eng-22062024.pdf" },
    ],
    sourceLabel: "UPSC Official"
  },
  {
    id: "upsc-cse-mains-2024",
    exam: "UPSC Civil Services",
    examSlug: "upsc-cse",
    year: 2024,
    title: "Civil Services (Main) Examination 2024",
    type: "Mains",
    hasAnswerKey: false,
    hasSolution: false,
    pdfs: [
      { label: "Essay Paper", url: "https://upsc.gov.in/sites/default/files/2024-12/CSM-2024-Essay-English-18122024.pdf" },
      { label: "General Studies Paper I", url: "https://upsc.gov.in/sites/default/files/2024-12/CSM-2024-GS-1-English-18122024.pdf" },
      { label: "General Studies Paper II", url: "https://upsc.gov.in/sites/default/files/2024-12/CSM-2024-GS-2-English-18122024.pdf" },
      { label: "General Studies Paper III", url: "https://upsc.gov.in/sites/default/files/2024-12/CSM-2024-GS-3-English-18122024.pdf" },
      { label: "General Studies Paper IV", url: "https://upsc.gov.in/sites/default/files/2024-12/CSM-2024-GS-4-English-18122024.pdf" },
    ],
    sourceLabel: "UPSC Official"
  },
  {
    id: "upsc-cse-prelims-2023",
    exam: "UPSC Civil Services",
    examSlug: "upsc-cse",
    year: 2023,
    title: "Civil Services (Preliminary) Examination 2023",
    type: "Prelims",
    hasAnswerKey: true,
    hasSolution: false,
    pdfs: [
      { label: "General Studies Paper I", url: "https://upsc.gov.in/sites/default/files/2023-06/CS-Prelims-2023-GS-1-English-22062023.pdf" },
      { label: "General Studies Paper II (CSAT)", url: "https://upsc.gov.in/sites/default/files/2023-06/CS-Prelims-2023-GS-2-English-22062023.pdf" },
    ],
    sourceLabel: "UPSC Official"
  },
  {
    id: "upsc-cse-mains-2023",
    exam: "UPSC Civil Services",
    examSlug: "upsc-cse",
    year: 2023,
    title: "Civil Services (Main) Examination 2023",
    type: "Mains",
    hasAnswerKey: false,
    hasSolution: false,
    pdfs: [
      { label: "Essay Paper", url: "https://upsc.gov.in/sites/default/files/2023-12/CSM-2023-Essay-English-19122023.pdf" },
      { label: "General Studies Paper I", url: "https://upsc.gov.in/sites/default/files/2023-12/CSM-2023-GS-1-English-19122023.pdf" },
      { label: "General Studies Paper II", url: "https://upsc.gov.in/sites/default/files/2023-12/CSM-2023-GS-2-English-19122023.pdf" },
      { label: "General Studies Paper III", url: "https://upsc.gov.in/sites/default/files/2023-12/CSM-2023-GS-3-English-19122023.pdf" },
      { label: "General Studies Paper IV", url: "https://upsc.gov.in/sites/default/files/2023-12/CSM-2023-GS-4-English-19122023.pdf" },
    ],
    sourceLabel: "UPSC Official"
  },
  {
    id: "upsc-nda-1-2024",
    exam: "UPSC NDA",
    examSlug: "upsc-nda",
    year: 2024,
    title: "NDA & NA Examination (I) 2024",
    type: "Prelims",
    hasAnswerKey: true,
    hasSolution: false,
    pdfs: [
      { label: "Mathematics Paper", url: "https://upsc.gov.in/sites/default/files/2024-06/NDA-1-2024-Maths-English-22062024.pdf" },
      { label: "General Ability Test", url: "https://upsc.gov.in/sites/default/files/2024-06/NDA-1-2024-GAT-English-22062024.pdf" },
    ],
    sourceLabel: "UPSC Official"
  },
  {
    id: "upsc-cds-2-2024",
    exam: "UPSC CDS",
    examSlug: "upsc-cds",
    year: 2024,
    title: "CDS Examination (II) 2024",
    type: "Prelims",
    hasAnswerKey: true,
    hasSolution: false,
    pdfs: [
      { label: "English Paper", url: "https://upsc.gov.in/sites/default/files/2024-09/CDS-2-2024-English-08092024.pdf" },
      { label: "General Knowledge", url: "https://upsc.gov.in/sites/default/files/2024-09/CDS-2-2024-GK-08092024.pdf" },
      { label: "Elementary Mathematics", url: "https://upsc.gov.in/sites/default/files/2024-09/CDS-2-2024-Maths-08092024.pdf" },
    ],
    sourceLabel: "UPSC Official"
  },
  {
    id: "ssc-cgl-2024",
    exam: "SSC CGL",
    examSlug: "ssc-cgl",
    year: 2024,
    title: "Combined Graduate Level Examination 2024 (Tier I)",
    type: "Prelims",
    hasAnswerKey: true,
    hasSolution: false,
    pdfs: [
      { label: "Download from SSC Official", url: "https://ssc.gov.in/for-candidates/previous-year-question-paper" },
    ],
    sourceLabel: "SSC Official"
  },
  {
    id: "ssc-cgl-2023",
    exam: "SSC CGL",
    examSlug: "ssc-cgl",
    year: 2023,
    title: "Combined Graduate Level Examination 2023 (Tier I & II)",
    type: "Both",
    hasAnswerKey: true,
    hasSolution: false,
    pdfs: [
      { label: "Download from SSC Official", url: "https://ssc.gov.in/for-candidates/previous-year-question-paper" },
    ],
    sourceLabel: "SSC Official"
  },
  {
    id: "ssc-chsl-2024",
    exam: "SSC CHSL",
    examSlug: "ssc-chsl",
    year: 2024,
    title: "Combined Higher Secondary Level Examination 2024 (Tier I)",
    type: "Prelims",
    hasAnswerKey: true,
    hasSolution: false,
    pdfs: [
      { label: "Download from SSC Official", url: "https://ssc.gov.in/for-candidates/previous-year-question-paper" },
    ],
    sourceLabel: "SSC Official"
  },
  {
    id: "ssc-gd-2024",
    exam: "SSC GD Constable",
    examSlug: "ssc-gd",
    year: 2024,
    title: "SSC GD Constable Examination 2024",
    type: "Prelims",
    hasAnswerKey: true,
    hasSolution: false,
    pdfs: [
      { label: "Download from SSC Official", url: "https://ssc.gov.in/for-candidates/previous-year-question-paper" },
    ],
    sourceLabel: "SSC Official"
  },
  {
    id: "ssc-mts-2024",
    exam: "SSC MTS",
    examSlug: "ssc-mts",
    year: 2024,
    title: "SSC Multi-Tasking Staff Examination 2024",
    type: "Prelims",
    hasAnswerKey: true,
    hasSolution: false,
    pdfs: [
      { label: "Download from SSC Official", url: "https://ssc.gov.in/for-candidates/previous-year-question-paper" },
    ],
    sourceLabel: "SSC Official"
  },
  {
    id: "jee-main-2025",
    exam: "JEE Main",
    examSlug: "jee-main",
    year: 2025,
    title: "JEE Main 2025 (Session 1 & 2) - All Shifts",
    type: "Prelims",
    hasAnswerKey: true,
    hasSolution: true,
    pdfs: [
      { label: "JEE Main 2025 Session 1 Papers (Jan)", url: "https://jeemain.nta.nic.in/" },
      { label: "JEE Main 2025 Session 2 Papers (Apr)", url: "https://jeemain.nta.nic.in/" },
    ],
    sourceLabel: "NTA Official"
  },
  {
    id: "jee-main-2024",
    exam: "JEE Main",
    examSlug: "jee-main",
    year: 2024,
    title: "JEE Main 2024 (Session 1 & 2) - All Shifts",
    type: "Both",
    hasAnswerKey: true,
    hasSolution: true,
    pdfs: [
      { label: "Official NTA Page", url: "https://jeemain.nta.nic.in/" },
    ],
    sourceLabel: "NTA Official"
  },
  {
    id: "neet-ug-2024",
    exam: "NEET UG",
    examSlug: "neet-ug",
    year: 2024,
    title: "NEET (UG) 2024 - All Codes (Q, R, S, T)",
    type: "Prelims",
    hasAnswerKey: true,
    hasSolution: false,
    pdfs: [
      { label: "NEET Official Documents", url: "https://neet.nta.nic.in/documents/" },
    ],
    sourceLabel: "NTA Official"
  },
  {
    id: "neet-ug-2023",
    exam: "NEET UG",
    examSlug: "neet-ug",
    year: 2023,
    title: "NEET (UG) 2023 - All Codes",
    type: "Prelims",
    hasAnswerKey: true,
    hasSolution: false,
    pdfs: [
      { label: "NEET Official Documents", url: "https://neet.nta.nic.in/documents/" },
    ],
    sourceLabel: "NTA Official"
  },
  {
    id: "cuet-ug-2024",
    exam: "CUET UG",
    examSlug: "cuet-ug",
    year: 2024,
    title: "CUET (UG) 2024 Question Papers",
    type: "Prelims",
    hasAnswerKey: true,
    hasSolution: false,
    pdfs: [
      { label: "CUET Official Website", url: "https://cuet.nta.nic.in/" },
    ],
    sourceLabel: "NTA Official"
  },
  {
    id: "ctet-2024",
    exam: "CTET",
    examSlug: "ctet",
    year: 2024,
    title: "CTET July 2024 - Paper I & II",
    type: "Both",
    hasAnswerKey: true,
    hasSolution: false,
    pdfs: [
      { label: "CTET Official", url: "https://ctet.nic.in/" },
    ],
    sourceLabel: "CTET Official"
  },
  {
    id: "ibps-po-2024",
    exam: "IBPS PO",
    examSlug: "ibps-po",
    year: 2024,
    title: "IBPS PO 2024 Prelims & Mains",
    type: "Both",
    hasAnswerKey: true,
    hasSolution: false,
    pdfs: [
      { label: "IBPS Official", url: "https://ibps.in/" },
    ],
    sourceLabel: "IBPS Official"
  },
  {
    id: "ibps-clerk-2024",
    exam: "IBPS Clerk",
    examSlug: "ibps-clerk",
    year: 2024,
    title: "IBPS Clerk 2024 Prelims & Mains",
    type: "Both",
    hasAnswerKey: true,
    hasSolution: false,
    pdfs: [
      { label: "IBPS Official", url: "https://ibps.in/" },
    ],
    sourceLabel: "IBPS Official"
  },
  {
    id: "sbi-po-2024",
    exam: "SBI PO",
    examSlug: "sbi-po",
    year: 2024,
    title: "SBI PO 2024 Prelims & Mains",
    type: "Both",
    hasAnswerKey: true,
    hasSolution: false,
    pdfs: [
      { label: "SBI Official", url: "https://sbi.co.in/" },
    ],
    sourceLabel: "SBI Official"
  },
  {
    id: "rrb-ntpc-2024",
    exam: "RRB NTPC",
    examSlug: "rrb-ntpc",
    year: 2024,
    title: "RRB NTPC Graduate & Undergraduate 2024",
    type: "Prelims",
    hasAnswerKey: true,
    hasSolution: false,
    pdfs: [
      { label: "RRB Official Website", url: "https://indianrailways.gov.in/" },
    ],
    sourceLabel: "RRB Official"
  },
  {
    id: "rrb-group-d-2024",
    exam: "RRB Group D",
    examSlug: "rrb-group-d",
    year: 2024,
    title: "RRB Group D 2024 CBT",
    type: "Prelims",
    hasAnswerKey: true,
    hasSolution: false,
    pdfs: [
      { label: "RRB Official Website", url: "https://indianrailways.gov.in/" },
    ],
    sourceLabel: "RRB Official"
  },
  {
    id: "rrb-alp-2024",
    exam: "RRB ALP",
    examSlug: "rrb-alp",
    year: 2024,
    title: "RRB ALP 2024 CBT",
    type: "Prelims",
    hasAnswerKey: true,
    hasSolution: false,
    pdfs: [
      { label: "RRB Official Website", url: "https://indianrailways.gov.in/" },
    ],
    sourceLabel: "RRB Official"
  },
  {
    id: "bpsc-2024",
    exam: "BPSC",
    examSlug: "bpsc",
    year: 2024,
    title: "BPSC 69th Combined Preliminary Exam 2024",
    type: "Prelims",
    hasAnswerKey: true,
    hasSolution: false,
    pdfs: [
      { label: "BPSC Official", url: "https://bpsc.bih.nic.in/" },
    ],
    sourceLabel: "BPSC Official"
  },
  {
    id: "uppsc-pcs-2024",
    exam: "UPPSC PCS",
    examSlug: "uppsc-pcs",
    year: 2024,
    title: "UPPSC Combined State/Upper Subordinate Services 2024",
    type: "Prelims",
    hasAnswerKey: true,
    hasSolution: false,
    pdfs: [
      { label: "UPPSC Official", url: "https://uppsc.up.nic.in/" },
    ],
    sourceLabel: "UPPSC Official"
  },
  {
    id: "cbse-10-2024",
    exam: "CBSE Class 10",
    examSlug: "cbse-class-10",
    year: 2024,
    title: "CBSE Class 10 Board Exam 2024",
    type: "Both",
    hasAnswerKey: true,
    hasSolution: false,
    pdfs: [
      { label: "CBSE Academic", url: "https://cbse.gov.in/" },
    ],
    sourceLabel: "CBSE Official"
  },
  {
    id: "cbse-12-2024",
    exam: "CBSE Class 12",
    examSlug: "cbse-class-12",
    year: 2024,
    title: "CBSE Class 12 Board Exam 2024",
    type: "Both",
    hasAnswerKey: true,
    hasSolution: false,
    pdfs: [
      { label: "CBSE Academic", url: "https://cbse.gov.in/" },
    ],
    sourceLabel: "CBSE Official"
  },
  {
    id: "gate-2025",
    exam: "GATE",
    examSlug: "gate",
    year: 2025,
    title: "GATE 2025 - All Papers",
    type: "Prelims",
    hasAnswerKey: true,
    hasSolution: false,
    pdfs: [
      { label: "GATE Official", url: "https://gate2025.iisc.ac.in/" },
    ],
    sourceLabel: "GATE Official"
  },
  {
    id: "gate-2024",
    exam: "GATE",
    examSlug: "gate",
    year: 2024,
    title: "GATE 2024 - All Papers",
    type: "Prelims",
    hasAnswerKey: true,
    hasSolution: false,
    pdfs: [
      { label: "GATE Previous Papers", url: "https://gate.iitk.ac.in/" },
    ],
    sourceLabel: "GATE Official"
  },
  {
    id: "upsc-epfo-2024",
    exam: "UPSC EPFO",
    examSlug: "upsc-epfo",
    year: 2024,
    title: "UPSC EPFO Enforcement Officer 2024",
    type: "Prelims",
    hasAnswerKey: true,
    hasSolution: false,
    pdfs: [
      { label: "UPSC Official", url: "https://upsc.gov.in/examinations/previous-question-papers" },
    ],
    sourceLabel: "UPSC Official"
  },
  {
    id: "afcat-2025",
    exam: "AFCAT",
    examSlug: "afcat",
    year: 2025,
    title: "AFCAT 2025 (1 & 2)",
    type: "Prelims",
    hasAnswerKey: true,
    hasSolution: false,
    pdfs: [
      { label: "AFCAT Official", url: "https://afcat.cdac.in/" },
    ],
    sourceLabel: "AFCAT Official"
  },
  {
    id: "uppsc-ro-aro-2024",
    exam: "UPPSC RO/ARO",
    examSlug: "uppsc-ro-aro",
    year: 2024,
    title: "UPPSC RO/ARO Preliminary Exam 2024",
    type: "Prelims",
    hasAnswerKey: true,
    hasSolution: false,
    pdfs: [
      { label: "UPPSC Official", url: "https://uppsc.up.nic.in/" },
    ],
    sourceLabel: "UPPSC Official"
  },
];

export function getAllPapers(): QuestionPaper[] {
  return papers;
}

export function getPapersByExam(examSlug: string): QuestionPaper[] {
  return papers.filter((p) => p.examSlug === examSlug);
}

export function getPapersByYear(year: number): QuestionPaper[] {
  return papers.filter((p) => p.year === year);
}

export function getUniqueExams(): { slug: string; name: string }[] {
  const seen = new Set<string>();
  return papers
    .filter((p) => {
      if (seen.has(p.examSlug)) return false;
      seen.add(p.examSlug);
      return true;
    })
    .map((p) => ({ slug: p.examSlug, name: p.exam }));
}

export function getUniqueYears(): number[] {
  return [...new Set(papers.map((p) => p.year))].sort((a, b) => b - a);
}
