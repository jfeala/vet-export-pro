import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.vetProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  return NextResponse.json(profile);
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const profile = await prisma.vetProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const updated = await prisma.vetProfile.update({
    where: { userId: session.user.id },
    data: {
      hospitalName: body.hospitalName?.trim() || profile.hospitalName,
      hospitalAddress: body.hospitalAddress?.trim() || profile.hospitalAddress,
      accreditedVetName: body.accreditedVetName?.trim() || profile.accreditedVetName,
      nationalAccreditationNumber:
        body.nationalAccreditationNumber?.trim() || profile.nationalAccreditationNumber,
    },
  });

  return NextResponse.json(updated);
}
