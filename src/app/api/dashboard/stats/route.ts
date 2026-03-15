import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalCerts, certsThisMonth, allCerts, clientCount] = await Promise.all([
    prisma.certificate.count({ where: { userId: session.user.id } }),
    prisma.certificate.count({
      where: { userId: session.user.id, createdAt: { gte: startOfMonth } },
    }),
    prisma.certificate.findMany({
      where: { userId: session.user.id, destinationCountry: { not: null } },
      select: { destinationCountry: true },
    }),
    prisma.client.count({ where: { userId: session.user.id } }),
  ]);

  // Top destination
  const destinationCounts: Record<string, number> = {};
  for (const cert of allCerts) {
    if (cert.destinationCountry) {
      destinationCounts[cert.destinationCountry] =
        (destinationCounts[cert.destinationCountry] || 0) + 1;
    }
  }
  const topDestination =
    Object.entries(destinationCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  return NextResponse.json({
    totalCerts,
    certsThisMonth,
    topDestination,
    clientCount,
  });
}
