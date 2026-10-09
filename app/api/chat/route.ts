import { NextResponse } from "next/server";
import OpenAI from "openai";
import { searchContent, ChatSearchResultItem, ChatSearchIntent } from "@/lib/chat-search";

// Rate limiting in-memory store
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();
const RATE_LIMIT_MAX = 20; // 20 requests
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // per 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

// Periodically clean up old rate limit entries
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, val] of rateLimitMap.entries()) {
      if (now > val.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }, 5 * 60 * 1000).unref?.();
}

function sanitizeText(str: string): string {
  return str
    .replace(/[<>]/g, "") // strip angle brackets
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .trim();
}

function buildFallbackAnswer(
  query: string,
  results: ChatSearchResultItem[],
  intent: ChatSearchIntent
): string {
  if (results.length === 0) {
    return (
      "Maaf kijiye, aapke sawaal se sambandhit koi active post AIExamResult par nahi mila.\n\n" +
      "Kripya exam ka poora naam (jaise 'SSC CGL', 'Bihar Police', 'Railway RRB', 'CTET') likhkar poochhein ya official recruitment commission ki website check karein.\n\n" +
      "ℹ️ AIExamResult ek informational portal hai aur yahan naye updates daily add hote hain."
    );
  }

  const topTitles = results.map((r) => `• ${r.title}${r.date ? ` (${r.date})` : ""}`).join("\n");

  if (intent.isResultSearch) {
    return (
      `Aapke sawaal ke mutabik AIExamResult par ye results aur scorecards uplabdh hain:\n\n${topTitles}\n\n` +
      "Neeche diye gaye direct links par click karke aap result merit list aur scorecard download kar sakte hain.\n\n" +
      "⚠️ Kripya aavedan ya payment se pehle official board portal par apna roll number aur cut-off verify karein."
    );
  }

  if (intent.isJobSearch) {
    return (
      `Aapke sawaal ke anusar latest government vacancy updates mile hain:\n\n${topTitles}\n\n` +
      "Aap kisi bhi post par click karke total seats, eligibility, application fee aur online apply link dekh sakte hain.\n\n" +
      "⚠️ Online aavedan karne se pehle official notification PDF zaroor padhein."
    );
  }

  if (intent.isAdmitSearch) {
    return (
      `Admit Card aur Exam City se sambandhit ye updates mile hain:\n\n${topTitles}\n\n` +
      "Apna registration number aur password/date of birth taiyar rakhein aur neeche diye gaye link se hall ticket download karein.\n\n" +
      "⚠️ Exam center par valid photo ID proof aur printout le jana na bhoolein."
    );
  }

  if (intent.isAnswerKeySearch) {
    return (
      `Answer Key aur question paper objection se sambandhit updates:\n\n${topTitles}\n\n` +
      "Official answer key download karne ke liye neeche diye gaye post par click karein."
    );
  }

  return (
    `Aapke sawaal se related AIExamResult par ye updates uplabdh hain:\n\n${topTitles}\n\n` +
    "Puri detail aur official links ke liye neeche diye gaye cards par click karein.\n\n" +
    "⚠️ AIExamResult ek educational portal hai; sabhi updates official website se verify kiye jaate hain."
  );
}

function getSuggestedQuestions(intent: ChatSearchIntent): string[] {
  if (intent.isResultSearch) {
    return ["Latest Government Jobs", "Find Admit Card", "Bihar Police Vacancy", "Answer Keys"];
  }
  if (intent.isJobSearch) {
    return ["Check Exam Results", "Find Admit Card", "12th Pass Jobs", "Railway NTPC Updates"];
  }
  if (intent.isAdmitSearch) {
    return ["Check Exam Results", "Latest Government Jobs", "Exam Calendar", "Answer Keys"];
  }
  return ["Latest Government Jobs", "Check Exam Results", "Find Admit Card", "Bihar Government Jobs"];
}

export async function POST(request: Request) {
  try {
    // 1. Rate limiting by IP
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many requests. Please wait a moment before sending another message.",
          results: [],
        },
        { status: 429 }
      );
    }

    // 2. Parse & Validate input
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    const rawMessage = typeof body.message === "string" ? body.message : "";
    const cleanMessage = sanitizeText(rawMessage);

    if (!cleanMessage || cleanMessage.length === 0) {
      return NextResponse.json(
        { success: false, error: "Message cannot be empty." },
        { status: 400 }
      );
    }

    if (cleanMessage.length > 500) {
      return NextResponse.json(
        { success: false, error: "Message is too long (maximum 500 characters)." },
        { status: 400 }
      );
    }

    // 3. Grounded Website Content Retrieval
    const searchRes = await searchContent(cleanMessage, 4);
    const { results, intent } = searchRes;
    const suggestions = getSuggestedQuestions(intent);

    // 4. AI-Grounded Generation (if OPENAI_API_KEY is configured)
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey && apiKey.trim().length > 10 && !apiKey.startsWith("replace-")) {
      try {
        const client = new OpenAI({ apiKey: apiKey.trim() });

        const contextItems = results.map((r) => ({
          title: r.title,
          category: r.category,
          date: r.date,
          url: `https://www.aiexamresult.com${r.url}`,
          excerpt: r.excerpt,
          importantDates: r.importantDates,
          officialUrl: r.officialUrl,
        }));

        const systemPrompt = `You are the official AI Assistant for AIExamResult (https://www.aiexamresult.com).
The website provides verified Indian government job notifications, exam results, admit cards, answer keys, admissions, syllabus, and educational updates.
AIExamResult is an informational educational portal, NOT an official government website.

CRITICAL INSTRUCTIONS:
1. Ground your response strictly on the retrieved website posts provided in the context.
2. Respond in the language used by the user (Hindi, Hinglish, or English).
3. NEVER invent exam dates, vacancies, salaries, eligibility requirements, application deadlines, or result status.
4. Do not claim that an admit card or result has been released unless explicitly stated in the retrieved posts.
5. NEVER invent fake URLs. Only use URLs provided in the context.
6. Clearly distinguish between notification dates, application deadlines, exam dates, and result dates.
7. If no relevant post is found for a specific exam, politely say that the update is currently not available on AIExamResult, and recommend checking the official board website.
8. Always remind the user to verify details on the official government website before submitting applications or paying fees.
9. Keep answers friendly, professional, and concise (under 150 words).`;

        const userPrompt = `User Question: "${cleanMessage}"

Retrieved AIExamResult Content:
${JSON.stringify(contextItems, null, 2)}

Provide a grounded, accurate response in the user's language based ONLY on the retrieved posts above:`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const completion = await client.chat.completions.create(
          {
            model: "gpt-4o-mini",
            temperature: 0.2,
            max_tokens: 350,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
          },
          { signal: controller.signal }
        );

        clearTimeout(timeoutId);

        const aiAnswer = completion.choices[0]?.message?.content?.trim();
        if (aiAnswer) {
          return NextResponse.json({
            success: true,
            answer: aiAnswer,
            results,
            source: "ai_grounded",
            suggestions,
          });
        }
      } catch (aiErr) {
        console.warn("AI generation error or timeout, falling back to structured grounded answer:", aiErr);
      }
    }

    // 5. Grounded Fallback Response (zero hallucinations, 100% reliable)
    const fallbackAnswer = buildFallbackAnswer(cleanMessage, results, intent);

    return NextResponse.json({
      success: true,
      answer: fallbackAnswer,
      results,
      source: "website_content",
      suggestions,
    });
  } catch (err: any) {
    console.error("Chat API unhandled error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred. Please try again shortly.",
        results: [],
      },
      { status: 500 }
    );
  }
}
