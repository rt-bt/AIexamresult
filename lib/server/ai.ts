import OpenAI from "openai";
import { slugify } from "@/lib/utils";

type GenerateInput = {
  source: string;
  language: "en" | "hi" | "both";
  mode: "generate" | "humanize" | "seo";
};

export async function generateExamPost(input: GenerateInput) {
  if (!process.env.OPENAI_API_KEY) {
    return fallbackGeneration(input.source);
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.45,
    messages: [
      {
        role: "system",
        content:
          "You write concise, human, legally careful Indian government exam portal content. Never invent official facts. Return strict JSON with title, slug, metaDescription, summary, faqs, tags, schema."
      },
      {
        role: "user",
        content: JSON.stringify(input)
      }
    ],
    response_format: { type: "json_object" }
  });

  return JSON.parse(completion.choices[0]?.message.content ?? "{}");
}

function fallbackGeneration(source: string) {
  const title = source.split(/[.\n]/)[0]?.slice(0, 80) || "Government Exam Update";
  return {
    title,
    slug: slugify(title),
    metaDescription: "Check important dates, eligibility, fees, official links and FAQs for this latest government exam update.",
    summary: source.slice(0, 420),
    faqs: [
      { question: "Where should I verify this update?", answer: "Always verify dates and instructions on the official website linked in the post." },
      { question: "How do I apply?", answer: "Use the official application link and keep required documents ready before submission." }
    ],
    tags: ["government exam", "result", "admit card"],
    schema: { "@context": "https://schema.org", "@type": "Article", headline: title }
  };
}
