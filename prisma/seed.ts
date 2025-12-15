import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ─────────────────────────────
  // USERS
  // ─────────────────────────────
  const admin = await prisma.user.create({
    data: {
      email: "admin@hangouts.app",
      name: "Admin",
      password: "seeded-password",
      isAdmin: true,
    },
  });

  const users = await Promise.all(
    Array.from({ length: 10 }).map((_, i) =>
      prisma.user.create({
        data: {
          email: `user${i + 1}@hangouts.app`,
          name: `User ${i + 1}`,
          password: "seeded-password",
        },
      })
    )
  );

  // ─────────────────────────────
  // GROUPS
  // ─────────────────────────────
  const cities = ["Ljubljana", "Maribor", "Koper", "Celje", "Kranj"];
  const categories = ["Tech", "Sports", "Music", "Startup", "Social"];

  const groups = [];

  for (let i = 0; i < 8; i++) {
    const group = await prisma.group.create({
      data: {
        name: `Hangout Group ${i + 1}`,
        description: `Awesome group number ${i + 1}`,
        city: cities[i % cities.length],
        country: "Slovenia",
        ownerId: admin.id,
      },
    });

    groups.push(group);

    // ─────────────────────────────
    // GROUP MEMBERS
    // ─────────────────────────────
    for (const user of users) {
      if (Math.random() > 0.4) {
        await prisma.groupMember.create({
          data: {
            userId: user.id,
            groupId: group.id,
          },
        });
      }
    }

    // Admin always member
    await prisma.groupMember.create({
      data: {
        userId: admin.id,
        groupId: group.id,
      },
    });
  }

  // ─────────────────────────────
  // EVENTS
  // ─────────────────────────────
  for (const group of groups) {
    for (let i = 0; i < 5; i++) {
      const event = await prisma.event.create({
        data: {
          title: `Event ${i + 1} – ${group.name}`,
          description: "Seeded event for demo purposes",
          date: new Date(Date.now() + 1000 * 60 * 60 * 24 * (i + 1)),
          city: group.city,
          country: "Slovenia",
          category: categories[i % categories.length],
          capacity: 10 + i * 5,
          userId: admin.id,
          groupId: group.id,
        },
      });

      // ─────────────────────────────
      // ATTENDEES
      // ─────────────────────────────
      for (const user of users) {
        if (Math.random() > 0.5) {
          await prisma.attendee.create({
            data: {
              userId: user.id,
              eventId: event.id,
            },
          });
        }
      }
    }
  }

  // ─────────────────────────────
  // GROUP MESSAGES
  // ─────────────────────────────
  for (const group of groups) {
    await prisma.groupMessage.create({
      data: {
        content: `Welcome to ${group.name}! 🎉`,
        userId: admin.id,
        groupId: group.id,
      },
    });
  }

  console.log("✅ Database seeded with LOTS of data");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
