import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getStripe } from "@/lib/stripe";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const certificate = await prisma.certificate.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!certificate) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (certificate.status !== "draft") {
    return NextResponse.json(
      { error: "Certificate already submitted" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { stripeCustomerId: true },
  });

  if (!user?.stripeCustomerId) {
    return NextResponse.json(
      { error: "No payment method on file" },
      { status: 400 }
    );
  }

  const priceInCents = parseInt(process.env.STRIPE_PRICE_PER_CERTIFICATE || "4999", 10);

  const paymentIntent = await getStripe().paymentIntents.create({
    amount: priceInCents,
    currency: "usd",
    customer: user.stripeCustomerId,
    off_session: true,
    confirm: true,
    description: `Certificate ${certificate.id} — ${certificate.destinationCountry || "EU"}`,
    metadata: { certificateId: certificate.id },
  });

  await prisma.certificate.update({
    where: { id },
    data: {
      status: "submitted",
      submittedAt: new Date(),
      stripePaymentIntentId: paymentIntent.id,
    },
  });

  return NextResponse.json({
    success: true,
    paymentIntentId: paymentIntent.id,
    status: paymentIntent.status,
  });
}
