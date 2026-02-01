import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const dbUrl = process.env.DATABASE_URL || "";
  const allow = process.env.ALLOW_E2E_SEED === "1";
  const isLocal =
    dbUrl.includes("localhost") ||
    dbUrl.includes("127.0.0.1") ||
    dbUrl.includes("hangouts_test") ||
    dbUrl.includes("hangouts_e2e");

  if (!allow || !isLocal) {
    throw new Error(
      "Refusing to seed: set ALLOW_E2E_SEED=1 and use a local test DATABASE_URL."
    );
  }

  await prisma.attendee.deleteMany();
  await prisma.groupMessage.deleteMany();
  await prisma.event.deleteMany();
  await prisma.groupMember.deleteMany();
  await prisma.group.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.verificationToken.deleteMany();

  const hashedPassword = await bcrypt.hash("test-password", 12);

  const admin = await prisma.user.create({
    data: {
      email: "admin@hangouts.test",
      name: "Admin",
      password: hashedPassword,
      isAdmin: true,
    },
  });

  const group = await prisma.group.create({
    data: {
      name: "Test Group",
      description: "Seeded group",
      city: "Ljubljana",
      country: "Slovenia",
      ownerId: admin.id,
    },
  });

  await prisma.groupMember.create({
    data: {
      userId: admin.id,
      groupId: group.id,
    },
  });

  await prisma.event.create({
    data: {
      title: "Test Event",
      description: "Seeded event",
      date: new Date(Date.now() + 1000 * 60 * 60 * 24),
      city: "Ljubljana",
      country: "Slovenia",
      userId: admin.id,
      groupId: group.id,
    },
  });

  await prisma.groupMessage.create({
    data: {
      content: "Welcome to Test Group",
      userId: admin.id,
      groupId: group.id,
    },
  });
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
