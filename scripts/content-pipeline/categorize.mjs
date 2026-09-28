/**
 * AIExamResult.com - Category & Search Intent Classification Engine
 * Maps topics to correct AIExamResult categories, search intents, states, and exam types.
 */

export const CATEGORY_MAP = {
  results: {
    key: "results",
    label: "Result",
    section: "results",
    path: "/results",
  },
  admitCards: {
    key: "admitCards",
    label: "Admit Card",
    section: "admit-card",
    path: "/admit-card",
  },
  latestJobs: {
    key: "latestJobs",
    label: "Latest Vacancy",
    section: "latest-jobs",
    path: "/latest-jobs",
  },
  answerKeys: {
    key: "answerKeys",
    label: "Answer Key",
    section: "answer-key",
    path: "/answer-key",
  },
  admissions: {
    key: "admissions",
    label: "Admissions",
    section: "admissions",
    path: "/admissions",
  },
  documents: {
    key: "documents",
    label: "Documents",
    section: "documents",
    path: "/documents",
  },
};

const STATE_KEYWORDS = [
  { state: "Uttar Pradesh", keywords: ["uttar pradesh", "up ", "upsssc", "uppsc", "upmsp", "uppbpb", "up police", "up bed", "up tet"] },
  { state: "Bihar", keywords: ["bihar", "bpsc", "bssc", "csbc", "bpssc", "bseb", "bihar police", "bihar teacher", "btet"] },
  { state: "Rajasthan", keywords: ["rajasthan", "rpsc", "rsmssb", "rbse", "reet", "rajasthan police", "raj cet"] },
  { state: "Madhya Pradesh", keywords: ["madhya pradesh", "mp ", "mppsc", "mpesb", "mppeb", "mpbse", "vyapam", "mp police"] },
  { state: "Delhi", keywords: ["delhi", "dsssb", "du ", "delhi police", "delhi high court"] },
  { state: "Haryana", keywords: ["haryana", "hssc", "hpsc", "hbse", "htet", "haryana police"] },
  { state: "Jharkhand", keywords: ["jharkhand", "jssc", "jpsc", "jac", "jtet", "jharkhand police"] },
  { state: "Uttarakhand", keywords: ["uttarakhand", "ukpsc", "uksssc", "ubse", "utet"] },
  { state: "Maharashtra", keywords: ["maharashtra", "mpsc", "msbshse", "maha police"] },
  { state: "West Bengal", keywords: ["west bengal", "wbpsc", "wbpolice"] },
  { state: "Punjab", keywords: ["punjab", "psssb", "ppsc"] },
  { state: "Chhattisgarh", keywords: ["chhattisgarh", "cgpsc", "cgvyapam"] },
];

const EXAM_TYPE_KEYWORDS = [
  { type: "SSC", keywords: ["ssc", "cgl", "chsl", "mts", "ssc gd", "cpo", "ssc je", "stenographer"] },
  { type: "UPSC", keywords: ["upsc", "civil services", "ias", "ips", "nda", "cds", "epfo", "capf"] },
  { type: "Railway", keywords: ["railway", "rrb", "rrc", "alp", "ntpc", "group d", "railway technician"] },
  { type: "Banking", keywords: ["ibps", "sbi", "rbi", "bank po", "bank clerk", "specialist officer"] },
  { type: "Teaching", keywords: ["teacher", "ctet", "uptet", "reet", "stet", "dsssb prt", "tgt", "pgt", "tre"] },
  { type: "Police", keywords: ["police", "constable", "sub inspector", "daroga", "si bharti", "havildar"] },
  { type: "Defence", keywords: ["army", "navy", "airforce", "agniveer", "afcat", "defence", "coast guard"] },
  { type: "Board Exam", keywords: ["board result", "10th result", "12th result", "matric", "intermediate", "high school", "cbse", "up board", "bseb", "rbse"] },
  { type: "Admission", keywords: ["admission", "entrance", "counselling", "neet", "jee", "cuet", "d.el.ed", "bed"] },
];

/**
 * Classify raw title into the appropriate category key, human label, intent, and filters.
 */
export function classifyTopic(title = "") {
  const t = title.toLowerCase().trim();

  let categoryKey = "latestJobs";
  let intent = "recruitment";

  // Intent & category heuristics
  if (/\b(admit\s*card|hall\s*ticket|call\s*letter|exam\s*city\s*slip)\b/i.test(t)) {
    categoryKey = "admitCards";
    intent = "admit-card";
  } else if (/\b(answer\s*key|response\s*sheet|objection\s*tracker|master\s*question\s*paper)\b/i.test(t)) {
    categoryKey = "answerKeys";
    intent = "answer-key";
  } else if (/\b(result|score\s*card|merit\s*list|cutoff|cut-off|selection\s*list|marksheet)\b/i.test(t) && !/\b(online\s*form|apply\s*online)\b/i.test(t)) {
    categoryKey = "results";
    intent = "result";
  } else if (/\b(admission|entrance\s*exam|counselling|seat\s*allotment|d\.?el\.?ed|b\.?ed)\b/i.test(t)) {
    categoryKey = "admissions";
    intent = "admission";
  } else if (/\b(syllabus|exam\s*pattern|certificate|verification|caste\s*certificate|domicile|income\s*certificate|ration\s*card)\b/i.test(t)) {
    categoryKey = "documents";
    intent = "syllabus";
  } else if (/\b(recruitment|vacancy|online\s*form|apply\s*online|bharti|posts|notification|apprentice)\b/i.test(t)) {
    categoryKey = "latestJobs";
    intent = "recruitment";
  }

  // Detect State
  let detectedState = "India";
  for (const s of STATE_KEYWORDS) {
    if (s.keywords.some((kw) => t.includes(kw))) {
      detectedState = s.state;
      break;
    }
  }

  // Detect Exam Type
  let detectedExamType = "Government Jobs";
  for (const e of EXAM_TYPE_KEYWORDS) {
    if (e.keywords.some((kw) => t.includes(kw))) {
      detectedExamType = e.type;
      break;
    }
  }

  return {
    categoryKey,
    categoryLabel: CATEGORY_MAP[categoryKey].label,
    section: CATEGORY_MAP[categoryKey].section,
    intent,
    state: detectedState,
    examType: detectedExamType,
  };
}
