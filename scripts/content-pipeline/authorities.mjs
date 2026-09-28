/**
 * AIExamResult.com - Official Examination Authorities Database & Resolver
 * Contains official government bodies, portals, recruitment agencies, and URL patterns.
 * Used for authoritative fact verification.
 */

export const OFFICIAL_AUTHORITIES = [
  // ── Central Recruiting Agencies ──
  {
    code: "SSC",
    name: "Staff Selection Commission (SSC)",
    portal: "https://ssc.gov.in",
    keywords: ["ssc", "staff selection commission", "cgl", "chsl", "mts", "ssc gd", "ssc je", "ssc cpo", "stenographer", "selection post"],
    address: { street: "Block No-12, CGO Complex, Lodhi Road", city: "New Delhi", state: "Delhi", pin: "110003" },
    state: "India",
    category: "latestJobs",
  },
  {
    code: "UPSC",
    name: "Union Public Service Commission (UPSC)",
    portal: "https://upsc.gov.in",
    keywords: ["upsc", "civil services", "ias", "ips", "ifs", "nda", "cds", "epfo", "capf", "engineering services", "ese", "cms", "geo-scientist"],
    address: { street: "Dholpur House, Shahjahan Road", city: "New Delhi", state: "Delhi", pin: "110069" },
    state: "India",
    category: "latestJobs",
  },
  {
    code: "RRB",
    name: "Railway Recruitment Board (RRB / RRC)",
    portal: "https://rrbcdg.gov.in",
    secondaryPortal: "https://indianrailways.gov.in",
    keywords: ["railway", "rrb", "rrc", "alp", "ntpc", "group d", "railway technician", "railway je", "railway apprentice", "paramedical rrb"],
    address: { street: "Rail Bhawan, Raisina Road", city: "New Delhi", state: "Delhi", pin: "110001" },
    state: "India",
    category: "latestJobs",
  },
  {
    code: "IBPS",
    name: "Institute of Banking Personnel Selection (IBPS)",
    portal: "https://ibps.in",
    keywords: ["ibps", "ibps po", "ibps clerk", "ibps rrb", "ibps so", "bank recruitment", "crp rrb", "crp clerk"],
    address: { street: "IBPS House, 90 Feet D.P. Road, Kandivali East", city: "Mumbai", state: "Maharashtra", pin: "400101" },
    state: "India",
    category: "latestJobs",
  },
  {
    code: "SBI",
    name: "State Bank of India (SBI)",
    portal: "https://sbi.co.in/web/careers",
    keywords: ["sbi po", "sbi clerk", "sbi specialist officer", "sbi cbo", "sbi junior associate"],
    address: { street: "State Bank Bhavan, Madame Cama Road", city: "Mumbai", state: "Maharashtra", pin: "400021" },
    state: "India",
    category: "latestJobs",
  },
  {
    code: "RBI",
    name: "Reserve Bank of India (RBI)",
    portal: "https://opportunities.rbi.org.in",
    keywords: ["rbi grade b", "rbi assistant", "rbi grade a", "reserve bank of india"],
    address: { street: "Shahid Bhagat Singh Road, Fort", city: "Mumbai", state: "Maharashtra", pin: "400001" },
    state: "India",
    category: "latestJobs",
  },
  {
    code: "NTA",
    name: "National Testing Agency (NTA)",
    portal: "https://nta.ac.in",
    keywords: ["nta", "neet ug", "jee main", "cuet ug", "cuet pg", "ugc net", "csir net", "cmat", "gpat", "swayam"],
    address: { street: "First Floor, NSIC-MDBP Building, Okhla Industrial Estate", city: "New Delhi", state: "Delhi", pin: "110020" },
    state: "India",
    category: "admissions",
  },
  {
    code: "CBSE",
    name: "Central Board of Secondary Education (CBSE)",
    portal: "https://cbse.gov.in",
    secondaryPortal: "https://cbseresults.nic.in",
    keywords: ["cbse", "cbse 10th", "cbse 12th", "cbse result", "ctet", "central board of secondary education"],
    address: { street: "Shiksha Kendra, 2 Community Centre, Preet Vihar", city: "Delhi", state: "Delhi", pin: "110092" },
    state: "India",
    category: "results",
  },

  // ── Uttar Pradesh Authorities ──
  {
    code: "UPPSC",
    name: "Uttar Pradesh Public Service Commission (UPPSC)",
    portal: "https://uppsc.up.nic.in",
    keywords: ["uppsc", "up pcs", "ro aro", "staff nurse uppsc", "gdc", "lt grade teacher up", "up combined state upper subordinate"],
    address: { street: "10, Kasturba Gandhi Marg", city: "Prayagraj", state: "Uttar Pradesh", pin: "211018" },
    state: "Uttar Pradesh",
    category: "latestJobs",
  },
  {
    code: "UPSSSC",
    name: "Uttar Pradesh Subordinate Services Selection Commission (UPSSSC)",
    portal: "https://upsssc.gov.in",
    keywords: ["upsssc", "pet", "upsssc pet", "lekhpal", "vdo", "junior assistant upsssc", "forest guard upsssc", "boring technician", "excise constable up"],
    address: { street: "Picup Bhawan, Vibhuti Khand, Gomti Nagar", city: "Lucknow", state: "Uttar Pradesh", pin: "226010" },
    state: "Uttar Pradesh",
    category: "latestJobs",
  },
  {
    code: "UPPRPB",
    name: "Uttar Pradesh Police Recruitment and Promotion Board (UPPRPB)",
    portal: "https://uppbpb.gov.in",
    keywords: ["up police", "up police constable", "up si", "uppbpb", "radio operator up police", "computer operator up police"],
    address: { street: "19-C, Vidhan Sabha Marg", city: "Lucknow", state: "Uttar Pradesh", pin: "226001" },
    state: "Uttar Pradesh",
    category: "latestJobs",
  },
  {
    code: "UPMSP",
    name: "Uttar Pradesh Madhyamik Shiksha Parishad (UPMSP)",
    portal: "https://upmsp.edu.in",
    secondaryPortal: "https://upresults.nic.in",
    keywords: ["up board", "upmsp", "up board 10th", "up board 12th", "highschool up board", "intermediate up board"],
    address: { street: "9, Sarojini Naidu Marg", city: "Prayagraj", state: "Uttar Pradesh", pin: "211001" },
    state: "Uttar Pradesh",
    category: "results",
  },

  // ── Bihar Authorities ──
  {
    code: "BPSC",
    name: "Bihar Public Service Commission (BPSC)",
    portal: "https://bpsc.bih.nic.in",
    keywords: ["bpsc", "bihar teacher", "tre", "bpsc tre", "bpsc cce", "69th bpsc", "70th bpsc", "headmaster bpsc"],
    address: { street: "15, Jawahar Lal Nehru Marg, Bailey Road", city: "Patna", state: "Bihar", pin: "800001" },
    state: "Bihar",
    category: "latestJobs",
  },
  {
    code: "BSSC",
    name: "Bihar Staff Selection Commission (BSSC)",
    portal: "https://bssc.bihar.gov.in",
    keywords: ["bssc", "cgl bihar", "inter level bssc", "stenographer bssc", "graduate level bssc"],
    address: { street: "PO Veterinary College", city: "Patna", state: "Bihar", pin: "800014" },
    state: "Bihar",
    category: "latestJobs",
  },
  {
    code: "BPSSC",
    name: "Bihar Police Subordinate Services Commission (BPSSC)",
    portal: "https://bpssc.bih.nic.in",
    keywords: ["bihar police si", "bpssc", "sub inspector bihar", "sergeant bihar"],
    address: { street: "Santosh Mansion, 'B' Block, Harding Road", city: "Patna", state: "Bihar", pin: "800001" },
    state: "Bihar",
    category: "latestJobs",
  },
  {
    code: "CSBC",
    name: "Central Selection Board of Constable, Bihar (CSBC)",
    portal: "https://csbc.bih.nic.in",
    keywords: ["csbc", "bihar police constable", "fireman bihar", "home guard bihar", "jail warder bihar"],
    address: { street: "Behind Harding Road, Secretariat", city: "Patna", state: "Bihar", pin: "800001" },
    state: "Bihar",
    category: "latestJobs",
  },
  {
    code: "BSEB",
    name: "Bihar School Examination Board (BSEB)",
    portal: "https://biharboardonline.bihar.gov.in",
    keywords: ["bihar board", "bseb", "matric bihar", "inter bihar", "bseb 10th", "bseb 12th", "stet bihar", "d.el.ed bihar"],
    address: { street: "Sinha Library Road", city: "Patna", state: "Bihar", pin: "800017" },
    state: "Bihar",
    category: "results",
  },

  // ── Rajasthan Authorities ──
  {
    code: "RPSC",
    name: "Rajasthan Public Service Commission (RPSC)",
    portal: "https://rpsc.rajasthan.gov.in",
    keywords: ["rpsc", "ras", "rts", "1st grade teacher rpsc", "2nd grade teacher rpsc", "rpsc si"],
    address: { street: "Ghoogra Ghati, Jaipur Road", city: "Ajmer", state: "Rajasthan", pin: "305001" },
    state: "Rajasthan",
    category: "latestJobs",
  },
  {
    code: "RSMSSB",
    name: "Rajasthan Staff Selection Board (RSMSSB)",
    portal: "https://rsmssb.rajasthan.gov.in",
    keywords: ["rsmssb", "rajasthan cet", "patwari", "gram sevak", "junior accountant rsmssb", "lab assistant rsmssb", "cho rajasthan"],
    address: { street: "Agriculture Management Premises, Durgapura", city: "Jaipur", state: "Rajasthan", pin: "302018" },
    state: "Rajasthan",
    category: "latestJobs",
  },
  {
    code: "RBSE",
    name: "Board of Secondary Education Rajasthan (RBSE)",
    portal: "https://rajeduboard.rajasthan.gov.in",
    secondaryPortal: "https://rajresults.nic.in",
    keywords: ["rbse", "rajasthan board", "rbse 10th", "rbse 12th", "reet"],
    address: { street: "Civil Lines", city: "Ajmer", state: "Rajasthan", pin: "305001" },
    state: "Rajasthan",
    category: "results",
  },

  // ── Madhya Pradesh Authorities ──
  {
    code: "MPPSC",
    name: "Madhya Pradesh Public Service Commission (MPPSC)",
    portal: "https://mppsc.mp.gov.in",
    keywords: ["mppsc", "mp pcs", "state service exam mp", "forest service mp"],
    address: { street: "Residency Area", city: "Indore", state: "Madhya Pradesh", pin: "452001" },
    state: "Madhya Pradesh",
    category: "latestJobs",
  },
  {
    code: "MPESB",
    name: "MP Employees Selection Board (MPESB / MPPEB)",
    portal: "https://esb.mp.gov.in",
    keywords: ["mpesb", "mppeb", "vyapam", "mp police constable", "mp patwari", "van rakshak mp", "jail prahari mp", "samvida shikshak mp"],
    address: { street: "Chayan Bhawan, Main Road No. 1, Chinar Park", city: "Bhopal", state: "Madhya Pradesh", pin: "462011" },
    state: "Madhya Pradesh",
    category: "latestJobs",
  },
  {
    code: "MPBSE",
    name: "Madhya Pradesh Board of Secondary Education (MPBSE)",
    portal: "https://mpbse.nic.in",
    secondaryPortal: "https://mpresults.nic.in",
    keywords: ["mp board", "mpbse", "mp board 10th", "mp board 12th"],
    address: { street: "Link Road 1, Shivaji Nagar", city: "Bhopal", state: "Madhya Pradesh", pin: "462011" },
    state: "Madhya Pradesh",
    category: "results",
  },

  // ── Defence & Armed Forces ──
  {
    code: "DEFENCE",
    name: "Ministry of Defence & Armed Forces",
    portal: "https://joinindianarmy.nic.in",
    secondaryPortal: "https://joinindiannavy.gov.in",
    keywords: ["indian army", "indian navy", "indian air force", "agniveer", "afcat", "teritorial army", "nda exam", "cds exam", "coast guard", "navik", "yantrik"],
    address: { street: "South Block, Integrated Defence Headquarters", city: "New Delhi", state: "Delhi", pin: "110011" },
    state: "India",
    category: "latestJobs",
  },

  // ── Other States & Specialized ──
  {
    code: "DSSSB",
    name: "Delhi Subordinate Services Selection Board (DSSSB)",
    portal: "https://dsssb.delhi.gov.in",
    keywords: ["dsssb", "tgt delhi", "pgt delhi", "prt dsssb", "jail warder dsssb", "dsssb various post"],
    address: { street: "FC-18, Institutional Area, Karkardooma", city: "Delhi", state: "Delhi", pin: "110092" },
    state: "Delhi",
    category: "latestJobs",
  },
  {
    code: "HSSC",
    name: "Haryana Staff Selection Commission (HSSC)",
    portal: "https://hssc.gov.in",
    keywords: ["hssc", "haryana cet", "haryana police", "group c hssc", "group d hssc", "htet"],
    address: { street: "Bays No. 67-70, Sector-2", city: "Panchkula", state: "Haryana", pin: "134151" },
    state: "Haryana",
    category: "latestJobs",
  },
  {
    code: "JSSC",
    name: "Jharkhand Staff Selection Commission (JSSC)",
    portal: "https://jssc.nic.in",
    keywords: ["jssc", "jssc cgl", "jharkhand police", "jssc excise constable", "jtet", "jssc pgttce"],
    address: { street: "Kalinagar, Chai Bagan, Namkum", city: "Ranchi", state: "Jharkhand", pin: "834010" },
    state: "Jharkhand",
    category: "latestJobs",
  },
  {
    code: "UKSSSC",
    name: "Uttarakhand Subordinate Service Selection Commission (UKSSSC)",
    portal: "https://sssc.uk.gov.in",
    keywords: ["uksssc", "ukpsc", "uttarakhand police", "van daroga uk", "vdo uksssc"],
    address: { street: "4 Subhash Road, Secretariat", city: "Dehradun", state: "Uttarakhand", pin: "248001" },
    state: "Uttarakhand",
    category: "latestJobs",
  },
  {
    code: "AIIMS",
    name: "All India Institute of Medical Sciences (AIIMS)",
    portal: "https://aiimsexams.ac.in",
    keywords: ["aiims", "norcet", "aiims nursing", "aiims mbbs", "aiims resident"],
    address: { street: "Sri Aurobindo Marg, Ansari Nagar", city: "New Delhi", state: "Delhi", pin: "110029" },
    state: "India",
    category: "latestJobs",
  },
];

/**
 * Intelligently resolve the authoritative recruitment/examination body
 * from a raw topic or exam title.
 */
export function resolveAuthority(title = "") {
  const lower = title.toLowerCase();

  for (const auth of OFFICIAL_AUTHORITIES) {
    for (const kw of auth.keywords) {
      const regex = new RegExp(`\\b${kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`, "i");
      if (regex.test(lower)) {
        return auth;
      }
    }
  }

  // Fallback generic Government Examination Authority
  return {
    code: "GOVT",
    name: "Government Examination & Recruitment Authority",
    portal: "https://www.india.gov.in",
    keywords: [],
    address: { street: "Central Secretariat", city: "New Delhi", state: "Delhi", pin: "110001" },
    state: "India",
    category: "latestJobs",
  };
}
