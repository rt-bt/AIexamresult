import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email and message are required" }, { status: 400 });
    }

    const fullMsg = `Name: ${name}\nEmail: ${email}\nSubject: ${subject || "N/A"}\nMessage: ${message}`;

    // Try using the built-infetch to send via a simple webhook or log
    console.log("=== Contact Form Submission ===");
    console.log(fullMsg);
    console.log("===============================");

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
