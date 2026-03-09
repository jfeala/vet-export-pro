import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/send-email";
import { welcomeEmailSubject, welcomeEmailHtml } from "@/lib/email/templates/welcome";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, destination } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    // Send welcome email via SES
    try {
      await sendEmail(
        email.trim(),
        welcomeEmailSubject(),
        welcomeEmailHtml({ name: name.trim(), destination })
      );
    } catch (emailErr) {
      // Log but don't fail the request — lead is still captured
      console.error("Failed to send welcome email:", emailErr);
    }

    // Store lead in Google Sheet
    try {
      await fetch(process.env.GOOGLE_SHEET_WEBHOOK_URL!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), destination }),
      });
    } catch (sheetErr) {
      console.error("Failed to write to Google Sheet:", sheetErr);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
