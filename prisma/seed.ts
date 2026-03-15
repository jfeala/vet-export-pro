import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "jake@vetexportpro.com";
  const password = process.env.ADMIN_PASSWORD || "changeme123";

  const passwordHash = await hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { role: "admin" },
    create: {
      email,
      name: "Jake",
      passwordHash,
      role: "admin",
      onboardedAt: new Date(),
    },
  });

  console.log(`Admin user created/updated: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
