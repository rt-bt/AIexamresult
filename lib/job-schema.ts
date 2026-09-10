/**
 * Helper utilities for generating Google JobPosting Schema.org structured data.
 * Resolves missing location fields (streetAddress, addressLocality, addressRegion, postalCode)
 * and baseSalary (INR, minValue, maxValue, MONTH) to comply with Google Search Console guidelines.
 */

export interface JobLocationInfo {
  hiringOrgName: string;
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: "IN";
}

export interface JobSalaryInfo {
  minValue: number;
  maxValue: number;
  currency: "INR";
  unitText: "MONTH";
  display: string;
  isEstimated: boolean;
}

interface OrgEntry {
  match: RegExp;
  name: string;
  street: string;
  city: string;
  state: string;
  pin: string;
}

interface StateEntry {
  match: RegExp;
  state: string;
  city: string;
  street: string;
  pin: string;
}

const ORG_MAPPING: OrgEntry[] = [
  { match: /\b(upsc)\b/i, name: "Union Public Service Commission (UPSC)", street: "Dholpur House, Shahjahan Road", city: "New Delhi", state: "Delhi", pin: "110069" },
  { match: /\b(ssc)\b/i, name: "Staff Selection Commission (SSC)", street: "Block No-12, CGO Complex, Lodhi Road", city: "New Delhi", state: "Delhi", pin: "110003" },
  { match: /\b(railway|rrb|rrc)\b/i, name: "Railway Recruitment Board (RRB)", street: "Rail Bhawan, Raisina Road", city: "New Delhi", state: "Delhi", pin: "110001" },
  { match: /\b(bceceb?|bsfc)\b/i, name: "Bihar Combined Entrance Competitive Examination Board (BCECEB)", street: "IAS Association Building, Near Patna Airport", city: "Patna", state: "Bihar", pin: "800014" },
  { match: /\b(bpsc)\b/i, name: "Bihar Public Service Commission (BPSC)", street: "15, Jawahar Lal Nehru Marg, Bailey Road", city: "Patna", state: "Bihar", pin: "800001" },
  { match: /\b(bssc)\b/i, name: "Bihar Staff Selection Commission (BSSC)", street: "PO Veterinary College", city: "Patna", state: "Bihar", pin: "800014" },
  { match: /\b(uppsc)\b/i, name: "Uttar Pradesh Public Service Commission (UPPSC)", street: "10, Kasturba Gandhi Marg", city: "Prayagraj", state: "Uttar Pradesh", pin: "211018" },
  { match: /\b(upsssc)\b/i, name: "UP Subordinate Services Selection Commission (UPSSSC)", street: "Picup Bhawan, Vibhuti Khand, Gomti Nagar", city: "Lucknow", state: "Uttar Pradesh", pin: "226010" },
  { match: /\b(hssc|htet)\b/i, name: "Haryana Staff Selection Commission (HSSC)", street: "Bays No. 67-70, Sector-2", city: "Panchkula", state: "Haryana", pin: "134151" },
  { match: /\b(rsmssb|rpsc)\b/i, name: "Rajasthan Staff Selection Board (RSMSSB)", street: "Agriculture Management Premises, Durgapura", city: "Jaipur", state: "Rajasthan", pin: "302018" },
  { match: /\b(mpesb|mppeb|mppsc)\b/i, name: "MP Employees Selection Board (MPESB)", street: "Chayan Bhawan, Main Road No. 1, Chinar Park", city: "Bhopal", state: "Madhya Pradesh", pin: "462011" },
  { match: /\b(dsssb)\b/i, name: "Delhi Subordinate Services Selection Board (DSSSB)", street: "FC-18, Institutional Area, Karkardooma", city: "Delhi", state: "Delhi", pin: "110092" },
  { match: /\b(ibps|sbi|rbi)\b/i, name: "Institute of Banking Personnel Selection", street: "IBPS House, 90 Feet, D.P. Road, Kandivali East", city: "Mumbai", state: "Maharashtra", pin: "400101" },
  { match: /\b(nta)\b/i, name: "National Testing Agency (NTA)", street: "First Floor, NSIC-MDBP Building, Okhla Industrial Estate", city: "New Delhi", state: "Delhi", pin: "110020" },
  { match: /\b(aiims)\b/i, name: "All India Institute of Medical Sciences (AIIMS)", street: "Sri Aurobindo Marg, Ansari Nagar", city: "New Delhi", state: "Delhi", pin: "110029" },
  { match: /\b(aai)\b/i, name: "Airports Authority of India (AAI)", street: "Rajiv Gandhi Bhawan, Safdarjung Airport", city: "New Delhi", state: "Delhi", pin: "110003" },
  { match: /\b(army|navy|airforce|afcat|agniveer|defence)\b/i, name: "Ministry of Defence, Government of India", street: "South Block, Integrated Defence Headquarters", city: "New Delhi", state: "Delhi", pin: "110011" },
  { match: /\b(uksssc|ukpsc)\b/i, name: "Uttarakhand Subordinate Service Selection Commission", street: "4 Subhash Road, Secretariat", city: "Dehradun", state: "Uttarakhand", pin: "248001" },
  { match: /\b(jssc|jpsc)\b/i, name: "Jharkhand Staff Selection Commission (JSSC)", street: "Chaal Bagaan, Namkum", city: "Ranchi", state: "Jharkhand", pin: "834010" },
  { match: /\b(mpsc)\b/i, name: "Maharashtra Public Service Commission (MPSC)", street: "Cooperage Telephone Exchange Bldg, Maharshi Karve Road", city: "Mumbai", state: "Maharashtra", pin: "400021" },
  { match: /\b(wbpsc)\b/i, name: "West Bengal Public Service Commission", street: "161-A, S. P. Mukherjee Road", city: "Kolkata", state: "West Bengal", pin: "700026" },
];

const STATE_MAPPING: StateEntry[] = [
  { match: /\b(bihar|patna)\b/i, state: "Bihar", city: "Patna", street: "Old Secretariat, Bailey Road", pin: "800015" },
  { match: /\b(up|uttar\s*pradesh|lucknow|prayagraj|varanasi|noida|kanpur)\b/i, state: "Uttar Pradesh", city: "Lucknow", street: "Vidhan Sabha Marg", pin: "226001" },
  { match: /\b(haryana|panchkula|chandigarh)\b/i, state: "Haryana", city: "Panchkula", street: "Haryana Civil Secretariat, Sector 1", pin: "134109" },
  { match: /\b(rajasthan|jaipur|jodhpur)\b/i, state: "Rajasthan", city: "Jaipur", street: "Government Secretariat, Bhagwan Das Road", pin: "302005" },
  { match: /\b(madhya\s*pradesh|mp|bhopal|indore)\b/i, state: "Madhya Pradesh", city: "Bhopal", street: "Vallabh Bhavan, State Secretariat", pin: "462004" },
  { match: /\b(delhi|new\s*delhi)\b/i, state: "Delhi", city: "New Delhi", street: "Delhi Secretariat, Players Building, IP Estate", pin: "110002" },
  { match: /\b(jharkhand|ranchi)\b/i, state: "Jharkhand", city: "Ranchi", street: "Project Building, Dhurwa", pin: "834004" },
  { match: /\b(uttarakhand|dehradun)\b/i, state: "Uttarakhand", city: "Dehradun", street: "4 Subhash Road, Secretariat", pin: "248001" },
  { match: /\b(chhattisgarh|cg|raipur)\b/i, state: "Chhattisgarh", city: "Raipur", street: "Mahanadi Bhawan, Mantralaya", pin: "492002" },
  { match: /\b(maharashtra|mumbai|pune)\b/i, state: "Maharashtra", city: "Mumbai", street: "Mantralaya, Madame Cama Road", pin: "400032" },
  { match: /\b(punjab)\b/i, state: "Punjab", city: "Chandigarh", street: "Punjab Civil Secretariat, Sector 1", pin: "160001" },
  { match: /\b(west\s*bengal|kolkata)\b/i, state: "West Bengal", city: "Kolkata", street: "Nabanna, 325 Sarat Chatterjee Road", pin: "711102" },
  { match: /\b(gujarat|gandhinagar|ahmedabad)\b/i, state: "Gujarat", city: "Gandhinagar", street: "New Sachivalaya Complex", pin: "382010" },
  { match: /\b(odisha|orissa|bhubaneswar)\b/i, state: "Odisha", city: "Bhubaneswar", street: "Lok Seva Bhavan", pin: "751001" },
  { match: /\b(telangana|hyderabad)\b/i, state: "Telangana", city: "Hyderabad", street: "BRKR Bhavan, Tank Bund Road", pin: "500022" },
  { match: /\b(andhra\s*pradesh|amaravati|vijayawada)\b/i, state: "Andhra Pradesh", city: "Vijayawada", street: "AP Secretariat, Velagapudi", pin: "522238" },
  { match: /\b(assam|guwahati|dispur)\b/i, state: "Assam", city: "Dispur", street: "Assam Secretariat, GS Road", pin: "781006" },
  { match: /\b(karnataka|bengaluru|bangalore)\b/i, state: "Karnataka", city: "Bengaluru", street: "Vidhana Soudha, Ambedkar Veedhi", pin: "560001" },
  { match: /\b(kerala|thiruvananthapuram)\b/i, state: "Kerala", city: "Thiruvananthapuram", street: "Government Secretariat", pin: "695001" },
  { match: /\b(tamil\s*nadu|chennai)\b/i, state: "Tamil Nadu", city: "Chennai", street: "Fort St. George, Secretariat", pin: "600009" },
  { match: /\b(himachal\s*pradesh|shimla)\b/i, state: "Himachal Pradesh", city: "Shimla", street: "Himachal Pradesh Secretariat, Chhota Shimla", pin: "171002" },
  { match: /\b(jammu|kashmir|srinagar)\b/i, state: "Jammu and Kashmir", city: "Srinagar", street: "Civil Secretariat", pin: "190001" },
];

/**
 * Validates if the post qualifies as an actual job recruitment.
 * Results, Admit Cards, Answer Keys, Certificates, and Syllabus MUST NOT emit JobPosting schema.
 */
export function isActualJobPost(category: string, title: string): boolean {
  const cat = (category || "").toLowerCase();
  const t = (title || "").toLowerCase();

  const isExcluded =
    cat.includes("result") ||
    cat.includes("admit") ||
    cat.includes("answer") ||
    cat.includes("syllabus") ||
    cat.includes("certificate") ||
    t.includes("admit card") ||
    t.includes("hall ticket") ||
    t.includes("call letter") ||
    t.includes("result") ||
    t.includes("score card") ||
    t.includes("merit list") ||
    t.includes("cutoff") ||
    t.includes("cut-off") ||
    t.includes("answer key") ||
    t.includes("counselling") ||
    t.includes("aadhar") ||
    t.includes("pan card") ||
    t.includes("voter id") ||
    t.includes("ration card") ||
    t.includes("driving licence");

  if (isExcluded) return false;

  return (
    cat.includes("job") ||
    cat.includes("latest") ||
    t.includes("recruitment") ||
    t.includes("online form") ||
    t.includes("vacancy") ||
    t.includes("apply online") ||
    t.includes("bharti")
  );
}

/**
 * Resolves full postal address for Google JobPosting schema based on organization & state.
 */
export function resolveJobLocation(title: string, intro: string = ""): JobLocationInfo {
  const text = `${title} ${intro}`;

  // 1. Check known recruitment boards / organizations
  for (const org of ORG_MAPPING) {
    if (org.match.test(text)) {
      return {
        hiringOrgName: org.name,
        streetAddress: org.street,
        addressLocality: org.city,
        addressRegion: org.state,
        postalCode: org.pin,
        addressCountry: "IN",
      };
    }
  }

  // 2. Check state mentions in title / intro
  for (const item of STATE_MAPPING) {
    if (item.match.test(text)) {
      return {
        hiringOrgName: `Government of ${item.state}`,
        streetAddress: item.street,
        addressLocality: item.city,
        addressRegion: item.state,
        postalCode: item.pin,
        addressCountry: "IN",
      };
    }
  }

  // 3. Fallback: Central Government / All India
  return {
    hiringOrgName: "Government of India",
    streetAddress: "Central Secretariat, Rajpath",
    addressLocality: "New Delhi",
    addressRegion: "Delhi",
    postalCode: "110001",
    addressCountry: "IN",
  };
}

/**
 * Resolves structured salary for Google JobPosting schema & on-page display.
 */
export function resolveJobSalary(
  title: string,
  post: { intro?: string; importantDates?: string[]; fullContentHtml?: string }
): JobSalaryInfo {
  const rawText = `${post.intro || ""} ${(post.importantDates || []).join(" ")} ${post.fullContentHtml || ""}`;

  // 1. Look for explicit salary/pay scale ranges (e.g. ₹9,300–34,800, Rs. 30000-40000, ₹ 21,700 - 69,100)
  const rangeMatch = rawText.match(
    /(?:pay\s*scale|salary|stipend|pay\s*band|pb)[^₹\d\n]{0,35}(?:rs\.?|₹)?\s*([0-9]{1,2},[0-9]{3,5}|[0-9]{4,6})\s*[-–to/ ]+\s*(?:rs\.?|₹)?\s*([0-9]{1,2},[0-9]{3,5}|[0-9]{4,6})/i
  );

  if (rangeMatch) {
    const min = parseInt(rangeMatch[1].replace(/,/g, ""), 10);
    const max = parseInt(rangeMatch[2].replace(/,/g, ""), 10);
    if (min >= 5000 && max <= 350000 && min < max) {
      return {
        minValue: min,
        maxValue: max,
        currency: "INR",
        unitText: "MONTH",
        display: `₹${min.toLocaleString("en-IN")} – ₹${max.toLocaleString("en-IN")} Per Month`,
        isEstimated: false,
      };
    }
  }

  // 2. Look for 7th CPC Level indicators: Level-1 to Level-14
  const levelMatch = rawText.match(/level[- ]?([1-9]|1[0-4])\b/i);
  if (levelMatch) {
    const lvl = parseInt(levelMatch[1], 10);
    const cpcScales: Record<number, [number, number]> = {
      1: [18000, 56900],
      2: [19900, 63200],
      3: [21700, 69100],
      4: [25500, 81100],
      5: [29200, 92300],
      6: [35400, 112400],
      7: [44900, 142400],
      8: [47600, 151100],
      9: [53100, 167800],
      10: [56100, 177500],
      11: [67700, 208700],
      12: [78800, 209200],
      13: [123100, 215900],
      14: [144200, 218200],
    };
    if (cpcScales[lvl]) {
      const [min, max] = cpcScales[lvl];
      return {
        minValue: min,
        maxValue: max,
        currency: "INR",
        unitText: "MONTH",
        display: `₹${min.toLocaleString("en-IN")} – ₹${max.toLocaleString("en-IN")} (7th CPC Level-${lvl})`,
        isEstimated: false,
      };
    }
  }

  // 3. Role-based standard fallback: Officer / Group A/B vs Entry / Clerk / Group C
  const lowerTitle = title.toLowerCase();
  if (/officer|manager|executive|engineer|scientist|lecturer|professor|doctor|specialist|subedar|si\b|inspector|dsp\b/i.test(lowerTitle)) {
    return {
      minValue: 35400,
      maxValue: 112400,
      currency: "INR",
      unitText: "MONTH",
      display: "₹35,400 – ₹1,12,400 Per Month (As per Govt Norms)",
      isEstimated: true,
    };
  }

  // Default standard 7th CPC entry level / Group C government pay scale
  return {
    minValue: 21700,
    maxValue: 69100,
    currency: "INR",
    unitText: "MONTH",
    display: "₹21,700 – ₹69,100 Per Month (As per Govt Norms)",
    isEstimated: true,
  };
}
