import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Hangouts database...");

  // ─────────────────────────
  // USERS
  // ─────────────────────────
  const users = await prisma.user.createMany({
    data: [
      {
        email: "admin@hangout-jakob.eu",
        name: "Admin Jakob",
        image: "https://i.pravatar.cc/150?img=3",
        password: "seed",
        isAdmin: true,
      },
      {
        email: "ana@hangout.eu",
        name: "Ana Novak",
        image: "https://i.pravatar.cc/150?img=5",
        password: "seed",
      },
      {
        email: "marko@hangout.eu",
        name: "Marko Kralj",
        image: "https://i.pravatar.cc/150?img=8",
        password: "seed",
      },
      {
        email: "luka@hangout.eu",
        name: "Luka Zupan",
        image: "https://i.pravatar.cc/150?img=11",
        password: "seed",
      },
    ],
    skipDuplicates: true,
  });

  const allUsers = await prisma.user.findMany();

  // ─────────────────────────
  // GROUPS
  // ─────────────────────────
  const groupsData = [
    {
      name: "Hiking Slovenia",
      description: "Weekend hikes and nature exploration 🥾",
      imageUrl:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      city: "Ljubljana",
      country: "Slovenia",
    },
    {
      name: "Tech & Startups",
      description: "Meetups for developers and founders 🚀",
      imageUrl:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
      city: "Maribor",
      country: "Slovenia",
    },
    {
      name: "Coffee Lovers",
      description: "Coffee, chill & conversations ☕",
      imageUrl:
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
      city: "Koper",
      country: "Slovenia",
    },
    {
      name: "Photography Walks",
      description: "Street & nature photography 📸",
      imageUrl:
        "https://images.unsplash.com/photo-1500534314209-a26db0f5c8a5",
      city: "Celje",
      country: "Slovenia",
    },
  ];

  const groups = [];

  for (const group of groupsData) {
    const created = await prisma.group.create({
      data: {
        ...group,
        ownerId: allUsers[0].id, // admin
      },
    });
    groups.push(created);
  }

  // ─────────────────────────
  // GROUP MEMBERS
  // ─────────────────────────
  for (const group of groups) {
    for (const user of allUsers) {
      await prisma.groupMember.create({
        data: {
          groupId: group.id,
          userId: user.id,
        },
      });
    }
  }

  // ─────────────────────────
  // EVENTS + ATTENDEES
  // ─────────────────────────
  for (const group of groups) {
    for (let i = 1; i <= 4; i++) {
      const event = await prisma.event.create({
        data: {
          title: `${group.name} Event ${i}`,
          description: "Great event – join us!",
          date: new Date(Date.now() + i * 86400000),
          city: group.city,
          country: group.country || "Slovenia",
          imageUrl:
            "https://images.unsplash.com/photo-1515169067865-5387ec356754",
          category: "Social",
          capacity: 25,
          userId: allUsers[0].id,
          groupId: group.id,
        },
      });

      for (const user of allUsers) {
        await prisma.attendee.create({
          data: {
            userId: user.id,
            eventId: event.id,
          },
        });
      }
    }
  }

  // ─────────────────────────
  // GROUP MESSAGES
  // ─────────────────────────
  for (const group of groups) {
    await prisma.groupMessage.create({
      data: {
        content: "Welcome to the group 👋",
        userId: allUsers[0].id,
        groupId: group.id,
      },
    });
  }

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
