import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AdminDashboard } from "./admin-dashboard";

export default async function AdminPage() {
  const session = await auth();
  if ((session?.user as Record<string, unknown> | undefined)?.role !== "admin") {
    redirect("/");
  }

  const [leads, invites, users] = await Promise.all([
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, include: { invite: true } }),
    prisma.invite.findMany({ orderBy: { invitedAt: "desc" } }),
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, include: { vetProfile: true } }),
  ]);

  return (
    <AdminDashboard
      leads={leads.map((l) => ({
        id: l.id,
        name: l.name,
        email: l.email,
        destination: l.destination,
        createdAt: l.createdAt.toISOString(),
        invited: !!l.invite,
      }))}
      invites={invites.map((i) => ({
        id: i.id,
        email: i.email,
        invitedAt: i.invitedAt.toISOString(),
        accepted: !!i.acceptedAt,
      }))}
      users={users.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        onboarded: !!u.onboardedAt,
        createdAt: u.createdAt.toISOString(),
      }))}
    />
  );
}
