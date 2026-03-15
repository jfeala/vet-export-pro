import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Token required" }, { status: 400 });
  }

  const invite = await prisma.invite.findUnique({ where: { token } });
  if (!invite || invite.acceptedAt) {
    return NextResponse.json({ error: "Invalid or expired invite" }, { status: 404 });
  }

  return NextResponse.json({ email: invite.email });
}

export async function POST(request: NextRequest) {
  try {
    const { token, name, password } = await request.json();

    if (!token || !name?.trim() || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const invite = await prisma.invite.findUnique({ where: { token } });
    if (!invite || invite.acceptedAt) {
      return NextResponse.json({ error: "Invalid or expired invite" }, { status: 404 });
    }

    const existing = await prisma.user.findUnique({ where: { email: invite.email } });
    if (existing) {
      return NextResponse.json({ error: "Account already exists" }, { status: 409 });
    }

    const passwordHash = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email: invite.email,
        name: name.trim(),
        passwordHash,
      },
    });

    await prisma.invite.update({
      where: { id: invite.id },
      data: { acceptedAt: new Date(), userId: user.id },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
