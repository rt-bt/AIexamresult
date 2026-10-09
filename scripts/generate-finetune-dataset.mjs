import * as fs from "fs";
import * as path from "path";

const SYSTEM_PROMPT = `You are the official AI Assistant for AIExamResult (https://www.aiexamresult.com).
Your purpose is to provide verified, grounded information about Indian government job vacancies, exam results, admit cards, answer keys, admissions, syllabus, and educational updates.
Always respond politely in the user's preferred language (Hindi, Hinglish, or English).
Provide real internal post links (https://www.aiexamresult.com/post/[slug]) and verified official government links when available.
Never invent exam dates, vacancies, or fake URLs. Clearly distinguish between notification dates, application deadlines, exam dates, and result dates.
Always advise candidates to verify details on the official commission website before submitting applications or paying fees.`;

const POSTS_DIR = path.join(process.cwd(), "data", "posts");
const OUTPUT_TRAIN = path.join(process.cwd(), "data", "training-dataset.jsonl");
const OUTPUT_VAL = path.join(process.cwd(), "data", "validation-dataset.jsonl");

// Platform FAQs and safety refusal training examples
const GENERAL_EXAMPLES = [
  {
    user: "AIExamResult kya hai?",
    assistant:
      "AIExamResult (https://www.aiexamresult.com) ek verified educational portal hai jo Bharat ke sabhi Central aur State government exams, Sarkari Naukri notifications, admit cards, answer keys, exam results aur admission updates provide karta hai.\n\nYahan SSC, Railway, UPSC, Banking, Defence, Bihar, UP, Rajasthan aur board exam se judi latest information daily update hoti hai.",
  },
  {
    user: "What is AIExamResult?",
    assistant:
      "AIExamResult (https://www.aiexamresult.com) is a comprehensive Indian government exam and recruitment information portal. It provides timely and verified updates for Sarkari results, job notifications, admit cards, answer keys, syllabus, and college admissions across national and state-level exams.",
  },
  {
    user: "Kya AIExamResult ek official government website hai?",
    assistant:
      "Nahi, AIExamResult ek independent informational portal hai, koi official government body nahi hai. Yahan di gayi sabhi jaankari official government notifications aur recruitment boards se verify ki jaati hai. Kisi bhi aavedan ya payment se pehle official commission ki website zaroor check karein.",
  },
  {
    user: "AIExamResult ka official Telegram channel kahan milega?",
    assistant:
      "Aap AIExamResult ke updates direct paane ke liye hamare official Telegram channel (https://t.me/aiexamresult) ko join kar sakte hain. Iske alawa website ke home page se aap instant push notification bhi subscribe kar sakte hain.",
  },
  {
    user: "Admit card download nahi ho raha, kya karun?",
    assistant:
      "Agar admit card download karne mein samasya aa rahi hai toh ye kadam uthayein:\n1. Check karein ki admit card officially release ho chuka hai ya nahi.\n2. Apna Registration Number aur Date of Birth / Password sahi enter karein.\n3. Server busy hone par thodi der baad ya incognito/private window mein try karein.\n4. Agar phir bhi issue ho toh official notification mein diye gaye board helpline email/phone par sampark karein.",
  },
  {
    user: "Answer Key aane ke baad objection kaise raise karein?",
    assistant:
      "Official answer key release hone ke baad recruitment boards ek Objection Window open karte hain:\n1. Board ke official login portal par jayein.\n2. Question Number select karein aur authentic proof/reference document upload karein.\n3. Nirdharit per-question objection fee online pay karein aur acknowledgement receipt save karein.\n\nObjection hamesha di gayi last date se pehle submit karein.",
  },
  // Refusal & Anti-hallucination examples
  {
    user: "UPSC Civil Services 2099 ka exam kab hoga?",
    assistant:
      "Maaf kijiye, saal 2099 ke kisi bhi exam ka schedule release nahi hua hai aur AIExamResult par iski koi jaankari uplabdh nahi hai. Kripya vartamaan saal (2026) ke verified UPSC exam calendar aur notifications ke liye hamari website check karein.",
  },
  {
    user: "Railway me 5 lakh vacancy ki nayi bharti aayi hai kya kal?",
    assistant:
      "Nahi, Railway dwara 5 lakh vacancies ki aisi koi official notification release nahi hui hai. Social media par faili fake news se bachein. Railway RRB ki sabhi verified vacancies (jaise NTPC, ALP, Technician, Group D) ke real updates aap https://www.aiexamresult.com/latest-jobs par dekh sakte hain.",
  },
  {
    user: "Can you give me the leaked question paper for tomorrow's exam?",
    assistant:
      "I cannot assist with leaked question papers or any unfair exam practices. AIExamResult strictly promotes fair examinations. You can find syllabus, exam patterns, official previous year papers, and mock tests on https://www.aiexamresult.com to prepare legitimately.",
  },
];

function extractOfficialLink(post) {
  if (!Array.isArray(post.importantLinks)) return null;
  for (const link of post.importantLinks) {
    if (!link.url || typeof link.url !== "string") continue;
    const u = link.url.trim();
    if (!/^https?:\/\//i.test(u) || u.includes("cdn-cgi")) continue;
    if (
      u.includes(".gov.in") ||
      u.includes(".nic.in") ||
      u.includes(".edu.in") ||
      u.includes(".org.in") ||
      u.includes("upsc.gov.in") ||
      u.includes("ssc.gov.in") ||
      u.includes("rrb") ||
      /official website|notification|advertisement|apply online|download result/i.test(link.label || "")
    ) {
      return { label: link.label || "Official Website", url: u };
    }
  }
  return null;
}

function cleanText(text) {
  if (!text) return "";
  return text
    .replace(/<[^>]*>/g, " ")
    .replace(/\[adinserter[^\]]*\]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function generatePostQAPairs(post) {
  const pairs = [];
  const title = (post.title || "").trim();
  const slug = (post.slug || "").trim();
  const url = `https://www.aiexamresult.com/post/${slug}`;
  const intro = cleanText(post.intro);
  const officialLink = extractOfficialLink(post);
  const dateInfo = Array.isArray(post.importantDates) && post.importantDates.length > 0
    ? post.importantDates.slice(0, 3).map((d) => `• ${d}`).join("\n")
    : null;

  const tLower = title.toLowerCase();

  // 1. Result Q&A
  if (tLower.includes("result") || tLower.includes("score card") || tLower.includes("merit list")) {
    pairs.push({
      user: `${title} ka result kaise check karein?`,
      assistant: `${title} se related updates AIExamResult par uplabdh hain.\n\n` +
        (intro ? `${intro.slice(0, 160)}...\n\n` : "") +
        `Direct result link, scorecard aur cut-off details dekhne ke liye yahan visit karein:\n🔗 ${url}\n` +
        (officialLink ? `🔗 Official Link: ${officialLink.url}\n` : "") +
        `\n⚠️ Apna roll number aur password taiyar rakhein aur official website se marks verify karein.`,
    });

    pairs.push({
      user: `Where can I download the scorecard for ${title}?`,
      assistant: `You can access the scorecard and official result details for "${title}" directly on AIExamResult:\n🔗 ${url}\n` +
        (officialLink ? `🔗 Official Portal: ${officialLink.url}\n` : "") +
        `\nPlease check your category cut-off marks and verify with the official commission notice.`,
    });
  }

  // 2. Vacancy / Recruitment Q&A
  else if (tLower.includes("recruitment") || tLower.includes("vacancy") || tLower.includes("online form") || tLower.includes("apply online")) {
    pairs.push({
      user: `${title} ki details aur online apply link batao`,
      assistant: `${title} ki puri notification details:\n\n` +
        (dateInfo ? `Important Dates:\n${dateInfo}\n\n` : "") +
        (intro ? `${intro.slice(0, 180)}...\n\n` : "") +
        `Eligibility criteria, application fee aur online apply karne ke liye yahan click karein:\n🔗 ${url}\n` +
        (officialLink ? `🔗 Direct Link: ${officialLink.url}\n` : "") +
        `\n⚠️ Online aavedan karne se pehle official notification PDF avashya padhein.`,
    });

    pairs.push({
      user: `What are the important dates and eligibility for ${title}?`,
      assistant: `Complete details for "${title}" are available on AIExamResult:\n\n` +
        (dateInfo ? `Key Dates:\n${dateInfo}\n\n` : "") +
        `Check complete age criteria, qualifications, category reservations, and apply online at:\n🔗 ${url}\n` +
        (officialLink ? `🔗 Official Link: ${officialLink.url}\n` : ""),
    });
  }

  // 3. Admit Card Q&A
  else if (tLower.includes("admit card") || tLower.includes("hall ticket") || tLower.includes("exam city")) {
    pairs.push({
      user: `${title} kaise download karein?`,
      assistant: `${title} download karne ke steps:\n\n` +
        `1. AIExamResult ke direct page par jayein:\n🔗 ${url}\n` +
        (officialLink ? `2. Official Hall Ticket Portal: ${officialLink.url}\n` : "") +
        `3. Apna Registration ID aur Date of Birth enter karke submit karein.\n\n` +
        `⚠️ Exam center par admit card ka printout aur original photo identity proof le jana anivarya hai.`,
    });
  }

  // 4. Answer Key Q&A
  else if (tLower.includes("answer key") || tLower.includes("solution key")) {
    pairs.push({
      user: `${title} ka PDF aur objection link kahan milega?`,
      assistant: `${title} ki official question paper aur provisional/final answer key release ho chuki hai.\n\n` +
        `Check complete answer key details and download PDF here:\n🔗 ${url}\n` +
        (officialLink ? `🔗 Official Link: ${officialLink.url}\n` : "") +
        `\nObjection raise karne se pehle board ke guidelines aur objection fee rules check karein.`,
    });
  }

  // 5. General exam notification
  else {
    pairs.push({
      user: `${title} ke baare mein latest update kya hai?`,
      assistant: `${title} ke bare mein latest verified information:\n\n` +
        (intro ? `${intro.slice(0, 200)}...\n\n` : "") +
        `Full details, important dates aur official notification download link ke liye yahan visit karein:\n🔗 ${url}\n` +
        (officialLink ? `🔗 Official Website: ${officialLink.url}\n` : ""),
    });
  }

  return pairs;
}

export async function generateDataset() {
  console.log("Generating OpenAI Fine-Tuning JSONL dataset from website content...");

  if (!fs.existsSync(POSTS_DIR)) {
    console.error("Posts directory not found:", POSTS_DIR);
    process.exit(1);
  }

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".json"));
  console.log(`Found ${files.length} post files in ${POSTS_DIR}`);

  const allConversations = [];

  // Add general platform FAQs & safety examples first
  for (const ex of GENERAL_EXAMPLES) {
    allConversations.push({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: ex.user },
        { role: "assistant", content: ex.assistant },
      ],
    });
  }

  // Process posts
  let postCount = 0;
  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");
      const post = JSON.parse(raw);
      if (!post.title || !post.slug) continue;

      const qaPairs = generatePostQAPairs(post);
      for (const qa of qaPairs) {
        allConversations.push({
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: qa.user },
            { role: "assistant", content: qa.assistant },
          ],
        });
      }
      postCount++;
    } catch {}
  }

  console.log(`Generated ${allConversations.length} total Q&A conversations from ${postCount} posts.`);

  // Shuffle dataset for balanced training
  for (let i = allConversations.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allConversations[i], allConversations[j]] = [allConversations[j], allConversations[i]];
  }

  // Split: 85% train, 15% validation
  const splitIndex = Math.floor(allConversations.length * 0.85);
  const trainSet = allConversations.slice(0, splitIndex);
  const valSet = allConversations.slice(splitIndex);

  // Write JSONL files
  fs.writeFileSync(OUTPUT_TRAIN, trainSet.map((c) => JSON.stringify(c)).join("\n") + "\n", "utf-8");
  fs.writeFileSync(OUTPUT_VAL, valSet.map((c) => JSON.stringify(c)).join("\n") + "\n", "utf-8");

  console.log(`✅ Training dataset written to: ${OUTPUT_TRAIN} (${trainSet.length} samples)`);
  console.log(`✅ Validation dataset written to: ${OUTPUT_VAL} (${valSet.length} samples)`);

  // Print sample
  console.log("\n--- Sample JSONL Entry ---");
  console.log(JSON.stringify(trainSet[0], null, 2));
}

// Execute
generateDataset().catch(console.error);
