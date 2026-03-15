import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import type Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const certificateId = paymentIntent.metadata.certificateId;
      if (certificateId) {
        await prisma.certificate.update({
          where: { id: certificateId },
          data: { status: "charged", chargedAt: new Date() },
        });
      }
      break;
    }
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const certificateId = paymentIntent.metadata.certificateId;
      if (certificateId) {
        await prisma.certificate.update({
          where: { id: certificateId },
          data: { status: "failed" },
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
