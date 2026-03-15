import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify user has both a VetProfile and a Stripe customer
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { vetProfile: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (!user.vetProfile) {
    return NextResponse.json(
      { error: "Please complete your practice profile first" },
      { status: 400 }
    );
  }

  if (!user.stripeCustomerId) {
    return NextResponse.json(
      { error: "Please add a payment method first" },
      { status: 400 }
    );
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { onboardedAt: new Date() },
  });

  return NextResponse.json({ success: true });
}
