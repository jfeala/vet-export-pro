import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
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
    include: {
      client: true,
      patients: { include: { patient: true } },
    },
  });

  if (!certificate) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(certificate);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const existing = await prisma.certificate.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const certificate = await prisma.certificate.update({
    where: { id },
    data: {
      formData: body.formData ?? existing.formData,
      destinationCountry: body.destinationCountry ?? existing.destinationCountry,
      departureDate: body.departureDate ?? existing.departureDate,
      clientId: body.clientId !== undefined ? body.clientId : existing.clientId,
    },
  });

  return NextResponse.json(certificate);
}
