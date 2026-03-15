import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { email, countries, canContact } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    // Find the most recent lead with this email and update it
    const lead = await prisma.lead.findFirst({
      where: { email: email.trim() },
      orderBy: { createdAt: "desc" },
    });

    if (lead) {
      await prisma.lead.update({
        where: { id: lead.id },
        data: {
          destination: Array.isArray(countries) ? countries.join(",") : null,
          canContact: canContact ?? null,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
