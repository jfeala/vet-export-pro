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
  const client = await prisma.client.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  const patients = await prisma.patient.findMany({
    where: { clientId: id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(patients);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const client = await prisma.client.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  const body = await request.json();
  if (!body.species?.trim()) {
    return NextResponse.json({ error: "Species is required" }, { status: 400 });
  }

  const patient = await prisma.patient.create({
    data: {
      clientId: id,
      species: body.species.trim(),
      breed: body.breed?.trim() || null,
      name: body.name?.trim() || null,
      sex: body.sex?.trim() || null,
      color: body.color?.trim() || null,
      dateOfBirth: body.dateOfBirth?.trim() || null,
      identificationNumber: body.identificationNumber?.trim() || null,
      identificationSystem: body.identificationSystem?.trim() || "Transponder",
      microchipImplantDate: body.microchipImplantDate?.trim() || null,
    },
  });

  return NextResponse.json(patient, { status: 201 });
}
