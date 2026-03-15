import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email/send-email";
import { inviteEmailSubject, inviteEmailHtml } from "@/lib/email/templates/invite";

export async function POST(request: Request) {
  const session = await auth();
  if ((session?.user as Record<string, unknown> | undefined)?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { email, name } = await request.json();
    if (!email?.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const existing = await prisma.invite.findUnique({ where: { email: email.trim() } });
    if (existing) {
      return NextResponse.json({ error: "Already invited" }, { status: 409 });
    }

    const invite = await prisma.invite.create({
      data: { email: email.trim() },
    });

    // Link to lead if one exists
    const lead = await prisma.lead.findFirst({ where: { email: email.trim(), inviteId: null } });
    if (lead) {
      await prisma.lead.update({
        where: { id: lead.id },
        data: { inviteId: invite.id },
      });
    }

    const baseUrl = process.env.NEXTAUTH_URL || "https://www.vetexportpro.com";
    const registerUrl = `${baseUrl}/register?token=${invite.token}`;

    try {
      await sendEmail(
        email.trim(),
        inviteEmailSubject(),
        inviteEmailHtml({ name: name || "there", registerUrl })
      );
    } catch (err) {
      console.error("Failed to send invite email:", err);
    }

    return NextResponse.json({ success: true, inviteId: invite.id });
  } catch {
    return NextResponse.json({ error: "Failed to create invite" }, { status: 500 });
  }
}
