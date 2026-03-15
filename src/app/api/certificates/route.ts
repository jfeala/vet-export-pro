import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const certificates = await prisma.certificate.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      client: { select: { name: true } },
      patients: { include: { patient: { select: { name: true, species: true } } } },
    },
  });

  return NextResponse.json(certificates);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));

  const certificate = await prisma.certificate.create({
    data: {
      userId: session.user.id,
      formData: body.formData ?? {},
      clientId: body.clientId ?? null,
      destinationCountry: body.destinationCountry ?? null,
    },
  });

  return NextResponse.json(certificate, { status: 201 });
}
