export type CurrentAffairItem = {
  date: string;
  title: string;
  category: string;
  detail?: string;
};

export type QuizItem = {
  q: string;
  options: string[];
  answer: number;
};

export const currentAffairs: CurrentAffairItem[] = [
  // June 16, 2026
  { date: "June 16, 2026", title: "SSC CGL 2026 Online Form Released for 12,256 Posts", category: "Exam" },
  { date: "June 16, 2026", title: "UP B.Ed Result 2026 Declared at bujhansi.ac.in", category: "Result" },
  { date: "June 16, 2026", title: "UPSC Civil Services IAS/IFS Pre Result 2026 Out", category: "Result" },
  { date: "June 16, 2026", title: "UPSSSC Teacher Cadre JTC Eligibility Result 2026 Released", category: "Result" },
  { date: "June 16, 2026", title: "AIIMS NORCET 10th Seat Allotment Result 2026 Out", category: "Result" },
  { date: "June 16, 2026", title: "RRB ALP 01/2025 CBT-I Result 2026 Declared", category: "Result" },
  { date: "June 16, 2026", title: "DSSSB Various Post Online Form 2026 Started for 1979 Posts", category: "Exam" },
  { date: "June 16, 2026", title: "UPSSSC Lower PCS 2026 Online Form Available for 2516 Posts", category: "Exam" },
  { date: "June 16, 2026", title: "Allahabad High Court RO, ARO & CA Online Form 2026 Open", category: "Exam" },
  { date: "June 16, 2026", title: "NTA NEET UG 2026 Re-Exam Admit Card Released", category: "Admit Card" },
  { date: "June 16, 2026", title: "RRB NTPC 10+2 UG CBT-I Admit Card 2026 Issued", category: "Admit Card" },
  { date: "June 16, 2026", title: "SSC GD Constable Answer Key 2026 – Out", category: "Answer Key" },
  { date: "June 16, 2026", title: "MP Board 10th/12th Second Exam Result 2026 Declared", category: "Result" },
  { date: "June 16, 2026", title: "Bihar BTSC Pharmacist Result 2026 Out", category: "Result" },
  { date: "June 16, 2026", title: "UPSC CPF Assistant Commandant 2024 Reserve List Released", category: "Result" },
  { date: "June 16, 2026", title: "BRABU UG 1st Merit List 2026-30 Published", category: "Admission" },
  { date: "June 16, 2026", title: "BHU CHS SET Result 2026 Declared", category: "Result" },
  { date: "June 16, 2026", title: "UP Polytechnic JEECUP Answer Key 2026 Released", category: "Answer Key" },
  { date: "June 16, 2026", title: "Haryana HTET Exam Date 2026 Announced", category: "Exam" },
  { date: "June 16, 2026", title: "UPSC Engineering Services Mains Admit Card 2026 Out", category: "Admit Card" },

  // June 15, 2026
  { date: "June 15, 2026", title: "RRB NTPC Graduate Level CBT II Exam Date 2026 Announced", category: "Exam" },
  { date: "June 15, 2026", title: "DSSSB September Exam Date 2026 Released", category: "Exam" },
  { date: "June 15, 2026", title: "CSBC Bihar Police Constable Operator Exam City Details 2026", category: "Admit Card" },
  { date: "June 15, 2026", title: "RSSB Lab Assistant Answer Key 2026 – Out", category: "Answer Key" },
  { date: "June 15, 2026", title: "CTET September Online Correction/Edit Form 2026 Started", category: "Exam" },
  { date: "June 15, 2026", title: "Rajasthan State Eligibility Test SET Online Form 2026", category: "Exam" },
  { date: "June 15, 2026", title: "India's Foreign Exchange Reserves Cross $700 Billion Mark", category: "Economy" },
  { date: "June 15, 2026", title: "ISRO Successfully Launches NISAR Satellite Mission", category: "Science" },

  // June 14, 2026
  { date: "June 14, 2026", title: "PM Modi Launches ₹24,000 Cr National Infrastructure Project", category: "Economy" },
  { date: "June 14, 2026", title: "Supreme Court Upholds OBC Reservation in NEET PG 2026", category: "Education" },
  { date: "June 14, 2026", title: "Indian Navy Inducts New Stealth Destroyer INS Imphal", category: "Defence" },
  { date: "June 14, 2026", title: "India Tops ICC Test Championship Rankings", category: "Sports" },
  { date: "June 14, 2026", title: "UPSSSC Excise Constable Online Form 2026 (722 Posts)", category: "Exam" },
  { date: "June 14, 2026", title: "JIPMER Group A Non-Faculty Online Form 2026 Open", category: "Exam" },

  // June 13, 2026
  { date: "June 13, 2026", title: "India's GDP Growth Revised to 6.8% for FY 2025-26", category: "Economy" },
  { date: "June 13, 2026", title: "DRDO Successfully Test-Fires Advanced Air Defense Missile", category: "Defence" },
  { date: "June 13, 2026", title: "AIIMS Common Recruitment Exam CRE-5 Group B & C 2026", category: "Exam" },
  { date: "June 13, 2026", title: "Central Bank of India Apprentice Online Form 2026", category: "Exam" },
  { date: "June 13, 2026", title: "UPSSSC Junior Assistant Revised Answer Key 2026 Out", category: "Answer Key" },
  { date: "June 13, 2026", title: "NTA JIPMAT Answer Key 2026 Released", category: "Answer Key" },

  // June 12, 2026
  { date: "June 12, 2026", title: "New Education Policy 2026 Implementation in All States", category: "Education" },
  { date: "June 12, 2026", title: "UPSC Announces 2026 Exam Schedule Changes", category: "Exam" },
  { date: "June 12, 2026", title: "Coal India CIL Management Trainee Online Form 2026 Extended", category: "Exam" },
  { date: "June 12, 2026", title: "MPPSC Assistant Professor Online Form 2026 Started", category: "Exam" },
  { date: "June 12, 2026", title: "VKSU Ara UG Admission Online Form 2026-30", category: "Admission" },

  // June 11, 2026
  { date: "June 11, 2026", title: "SSC Releases Tentative Calendar for 2026-27", category: "Exam" },
  { date: "June 11, 2026", title: "India Wins 5 Gold Medals in Asian Athletics Championship", category: "Sports" },
  { date: "June 11, 2026", title: "NALCO Non Executive Various Post Online Form 2026 Extended", category: "Exam" },
  { date: "June 11, 2026", title: "UP CAHET Online Form 2026 Extended", category: "Exam" },
  { date: "June 11, 2026", title: "MUIT Lucknow Admissions 2026 Online Form", category: "Admission" },

  // June 10, 2026
  { date: "June 10, 2026", title: "Railway Budget: 5,000 New Stations to Be Upgraded", category: "Railway" },
  { date: "June 10, 2026", title: "Digital India 3.0 Launched with ₹50,000 Cr Outlay", category: "Technology" },
  { date: "June 10, 2026", title: "Allahabad High Court RO, ARO & CA Online Form 2026", category: "Exam" },
  { date: "June 10, 2026", title: "World Environment Day 2026: India Pledges Net Zero by 2050", category: "Environment" },
  { date: "June 10, 2026", title: "UPDELED 2026 Admissions Online Form Started", category: "Admission" },

  // June 9, 2026
  { date: "June 9, 2026", title: "7th Pay Commission DA Hike Expected in July", category: "Salary" },
  { date: "June 9, 2026", title: "RBI Keeps Repo Rate Unchanged at 6.25%", category: "Economy" },
  { date: "June 9, 2026", title: "RPSC Assistant Prosecution Officer APO Online Form 2026", category: "Exam" },
  { date: "June 9, 2026", title: "UPSSSC Vidhan Bhawan Guard/Fireman Online Form 2026", category: "Exam" },
  { date: "June 9, 2026", title: "CISF ASI Paramedical Post Online Form 2026", category: "Exam" },
  { date: "June 9, 2026", title: "Bank of Baroda Apprentices Online Form 2026 Extended", category: "Exam" },

  // June 8, 2026
  { date: "June 8, 2026", title: "NEET PG 2026 Exam Date Announced", category: "Exam" },
  { date: "June 8, 2026", title: "India-Middle East-Europe Corridor Gets Final Nod", category: "International" },
  { date: "June 8, 2026", title: "UPSC NDA II Online Form 2026 Released", category: "Exam" },
  { date: "June 8, 2026", title: "UPSC CDS II Online Form 2026 Released", category: "Exam" },
  { date: "June 8, 2026", title: "RPSC RAS Pre 2026 Online Form", category: "Exam" },

  // June 7, 2026
  { date: "June 7, 2026", title: "India Becomes World's 3rd Largest Solar Energy Producer", category: "Environment" },
  { date: "June 7, 2026", title: "Indian Army Agniveer CEE 2026 Admit Card Released", category: "Admit Card" },
  { date: "June 7, 2026", title: "UP Police SI DV/PST Admit Card 2026 Issued", category: "Admit Card" },
  { date: "June 7, 2026", title: "DRDO CEPTAM-11 Tier-II Admit Card 2026 Out", category: "Admit Card" },
];

export const quiz: QuizItem[] = [
  { q: "India's GDP growth revised to ___ for FY 2025-26", options: ["6.5%", "6.8%", "7.2%", "6.2%"], answer: 1 },
  { q: "Which organisation launched Digital India 3.0?", options: ["NITI Aayog", "Ministry of IT", "MeitY", "State Govt"], answer: 2 },
  { q: "DA hike under which pay commission?", options: ["6th", "7th", "8th", "5th"], answer: 1 },
  { q: "RBI kept repo rate unchanged at ___?", options: ["6.00%", "6.25%", "6.50%", "5.75%"], answer: 1 },
  { q: "SSC CGL 2026 is for how many posts?", options: ["10,256", "12,256", "15,000", "11,127"], answer: 1 },
  { q: "Which satellite mission did ISRO launch in June 2026?", options: ["Mangalyaan", "NISAR", "Chandrayaan", "Aditya"], answer: 1 },
  { q: "India's rank in ICC Test Championship as of June 2026?", options: ["1st", "2nd", "3rd", "4th"], answer: 0 },
  { q: "INS Imphal is a new stealth ___ inducted by Indian Navy?", options: ["Aircraft Carrier", "Destroyer", "Submarine", "Frigate"], answer: 1 },
  { q: "India become world's ___ largest solar energy producer in 2026?", options: ["2nd", "3rd", "4th", "5th"], answer: 1 },
  { q: "How many gold medals did India win in Asian Athletics?", options: ["3", "5", "7", "10"], answer: 1 },
];
