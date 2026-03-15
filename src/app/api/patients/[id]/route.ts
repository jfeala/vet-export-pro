import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const patient = await prisma.patient.findFirst({
    where: { id },
    include: { client: { select: { userId: true } } },
  });

  if (!patient || patient.client.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();
  const updated = await prisma.patient.update({
    where: { id },
    data: {
      species: body.species?.trim() || patient.species,
      breed: body.breed?.trim() ?? patient.breed,
      name: body.name?.trim() ?? patient.name,
      sex: body.sex?.trim() ?? patient.sex,
      color: body.color?.trim() ?? patient.color,
      dateOfBirth: body.dateOfBirth?.trim() ?? patient.dateOfBirth,
      identificationNumber: body.identificationNumber?.trim() ?? patient.identificationNumber,
      identificationSystem: body.identificationSystem?.trim() ?? patient.identificationSystem,
      microchipImplantDate: body.microchipImplantDate?.trim() ?? patient.microchipImplantDate,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const patient = await prisma.patient.findFirst({
    where: { id },
    include: { client: { select: { userId: true } } },
  });

  if (!patient || patient.client.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.patient.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
