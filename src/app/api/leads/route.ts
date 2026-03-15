import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/send-email";
import { welcomeEmailSubject, welcomeEmailHtml } from "@/lib/email/templates/welcome";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, destination } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    const trimmedEmail = email.trim();
    const trimmedName = name?.trim() || "";

    // Store lead in database
    try {
      await prisma.lead.create({
        data: {
          name: trimmedName,
          email: trimmedEmail,
          destination: destination || null,
        },
      });
    } catch (dbErr) {
      console.error("Failed to store lead in database:", dbErr);
    }

    // Send welcome email via SES
    try {
      await sendEmail(
        trimmedEmail,
        welcomeEmailSubject(),
        welcomeEmailHtml({ name: trimmedName || "there", destination })
      );
    } catch (emailErr) {
      console.error("Failed to send welcome email:", emailErr);
    }

    // Store lead in Google Sheet (email notification disabled in Apps Script)
    try {
      await fetch(process.env.GOOGLE_SHEET_WEBHOOK_URL!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          destination,
          skipEmail: true,
        }),
      });
    } catch (sheetErr) {
      console.error("Failed to write to Google Sheet:", sheetErr);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
