import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const session = await auth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((session?.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { inviteId } = await request.json();
    if (!inviteId) {
      return NextResponse.json({ error: "inviteId required" }, { status: 400 });
    }

    const invite = await prisma.invite.findUnique({ where: { id: inviteId } });
    if (!invite) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    // If the invite was accepted and a user was created, delete the user and their profile
    if (invite.userId) {
      await prisma.vetProfile.deleteMany({ where: { userId: invite.userId } });
      await prisma.user.delete({ where: { id: invite.userId } });
    }

    // Unlink leads that reference this invite
    await prisma.lead.updateMany({
      where: { inviteId: invite.id },
      data: { inviteId: null },
    });

    // Delete the invite
    await prisma.invite.delete({ where: { id: inviteId } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to reset invite:", err);
    return NextResponse.json({ error: "Failed to reset invite" }, { status: 500 });
  }
}
