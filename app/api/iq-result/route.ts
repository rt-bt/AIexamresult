import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { calculateIQ, getIQLabel } from "@/lib/iq-questions";

export async function POST(req: Request) {
  try {
    const { name, age, gender, country, email, answers, correctAnswers } = await req.json();

    if (!name || !age || !gender || !country || !email || !answers || !correctAnswers) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const total = correctAnswers.length;
    let correct = 0;
    for (let i = 0; i < total; i++) {
      if (answers[i] === correctAnswers[i]) correct++;
    }

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

--- Results ---
${answers.map((a: number, i: number) =>
  `Q${i + 1}: Your Answer = ${a !== -1 ? a : "N/A"}, Correct = ${correctAnswers[i]}, ${a === correctAnswers[i] ? "✓" : "✗"}`
).join("\n")}
`;

    console.log("=== IQ Test Result ===");
    console.log(text);
    console.log("======================");

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const notifyEmail = "adityaraj.1@outlook.com";

    let emailSentAdmin = false;
    let emailSentUser = false;
    let transporter: nodemailer.Transporter | null = null;
    if (smtpHost && smtpUser && smtpPass) {
      try {
        transporter = nodemailer.createTransport({
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
        emailSentAdmin = true;
        console.log("Admin email sent to", notifyEmail);
      } catch (mailErr) {
        console.error("Failed to send admin email:", mailErr);
      }

      try {
        await transporter!.sendMail({
          from: `"AI Exam Result - IQ Test" <${smtpUser}>`,
          to: email,
          subject: `Your IQ Test Result: IQ ${iq} (${label})`,
          text: `Dear ${name},

Thank you for taking the AI Exam Result IQ Test.

Your Results:
- Score: ${correct}/${total} (${pct}%)
- IQ Level: ${iq}
- Classification: ${label}

You can retake the test anytime at https://www.aiexamresult.com/iq-test

Best regards,
AI Exam Result Team`,
        });
        emailSentUser = true;
        console.log("User email sent to", email);
      } catch (mailErr) {
        console.error("Failed to send user email:", mailErr);
      }
    } else {
      console.log("SMTP not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS env vars.");
    }

    // Save to JSON "database" in /tmp
    try {
      const fs = await import("fs");
      const path = await import("path");
      const dbPath = path.join("/tmp", "iq-results.json");
      let records: unknown[] = [];
      try {
        const existing = fs.readFileSync(dbPath, "utf-8");
        records = JSON.parse(existing);
      } catch {
        records = [];
      }
      records.push({
        name,
        age,
        gender,
        country,
        email,
        score: correct,
        total,
        pct,
        iq,
        label,
        answers,
        correctAnswers,
        timestamp: new Date().toISOString(),
      });
      fs.writeFileSync(dbPath, JSON.stringify(records, null, 2));
      console.log("Result saved to /tmp/iq-results.json");
    } catch (dbErr) {
      console.error("Failed to save to DB:", dbErr);
    }

    return NextResponse.json({ success: true, iq, correct, total, pct, label, emailSent: emailSentAdmin || emailSentUser });
  } catch (err) {
    console.error("IQ result error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
