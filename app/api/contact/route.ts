import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email and message are required" }, { status: 400 });
    }

    const fullMsg = `Name: ${name}\nEmail: ${email}\nSubject: ${subject || "N/A"}\nMessage: ${message}`;

    console.log("=== Contact Form Submission ===");
    console.log(fullMsg);
    console.log("===============================");

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const notifyEmail = process.env.NOTIFY_EMAIL;

    if (smtpHost && smtpUser && smtpPass && notifyEmail) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(smtpPort) || 587,
        secure: Number(smtpPort) === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });
      await transporter.sendMail({
        from: `"${name}" <${smtpUser}>`,
        replyTo: email,
        to: notifyEmail,
        subject: `[AI Exam Result] ${subject || "Contact Form"} from ${name}`,
        text: fullMsg,
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
