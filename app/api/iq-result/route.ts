import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { calculateIQ, getIQLabel, iqQuestions } from "@/lib/iq-questions";

export async function POST(req: Request) {
  try {
    const { name, age, gender, country, email, answers } = await req.json();

    if (!name || !age || !gender || !country || !email || !answers) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const total = iqQuestions.length;
    let correct = 0;
    const details = iqQuestions.map((q, i) => {
      const isCorrect = answers[i] === q.correct;
      if (isCorrect) correct++;
      return {
        question: q.question,
        correctAnswer: q.options[q.correct],
        userAnswer: answers[i] !== undefined ? q.options[answers[i]] : "Not answered",
        isCorrect,
      };
    });

    const iq = calculateIQ(correct, total);
    const label = getIQLabel(iq);
    const pct = Math.round((correct / total) * 100);

    const subject = `[IQ Test Result] ${name} - IQ ${iq} (${label})`;
    const text = `
=== IQ TEST RESULT ===

Student: ${name}
Age: ${age}
Gender: ${gender}
Country: ${country}
Email: ${email}

Score: ${correct}/${total} (${pct}%)
IQ Level: ${iq}
Classification: ${label}

--- Question Details ---
${details.map((d, i) => `
Q${i + 1}: ${d.question}
  Your Answer: ${d.userAnswer}
  Correct: ${d.correctAnswer}
  Result: ${d.isCorrect ? "✓ Correct" : "✗ Wrong"}
`).join("")}
`;

    console.log("=== IQ Test Result ===");
    console.log(text);
    console.log("======================");

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const notifyEmail = "adityaraj.1@outlook.com";

    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(smtpPort) || 587,
        secure: Number(smtpPort) === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });
      await transporter.sendMail({
        from: `"IQ Test System" <${smtpUser}>`,
        replyTo: email,
        to: notifyEmail,
        subject,
        text,
      });
    }

    return NextResponse.json({ success: true, iq, correct, total, pct, label });
  } catch (err) {
    console.error("IQ result error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
