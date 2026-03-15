import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clients = await prisma.client.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: { patients: true },
  });

  return NextResponse.json(clients);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  if (!body.name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const client = await prisma.client.create({
    data: {
      userId: session.user.id,
      name: body.name.trim(),
      phone: body.phone?.trim() || null,
      addressUS: body.addressUS?.trim() || null,
      addressEU: body.addressEU?.trim() || null,
      postalCodeEU: body.postalCodeEU?.trim() || null,
      phoneEU: body.phoneEU?.trim() || null,
      nameEU: body.nameEU?.trim() || null,
    },
  });

  return NextResponse.json(client, { status: 201 });
}
