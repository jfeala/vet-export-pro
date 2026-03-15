import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { hospitalName, hospitalAddress, accreditedVetName, nationalAccreditationNumber } =
      await request.json();

    if (!hospitalName?.trim() || !hospitalAddress?.trim() || !accreditedVetName?.trim() || !nationalAccreditationNumber?.trim()) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    await prisma.vetProfile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        hospitalName: hospitalName.trim(),
        hospitalAddress: hospitalAddress.trim(),
        accreditedVetName: accreditedVetName.trim(),
        nationalAccreditationNumber: nationalAccreditationNumber.trim(),
      },
      update: {
        hospitalName: hospitalName.trim(),
        hospitalAddress: hospitalAddress.trim(),
        accreditedVetName: accreditedVetName.trim(),
        nationalAccreditationNumber: nationalAccreditationNumber.trim(),
      },
    });

    return NextResponse.json({ success: true, step: "payment" });
  } catch {
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}
