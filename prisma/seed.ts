import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // --- USERS ---
  await prisma.user.createMany({
    data: [
      { email: "ana@gmail.com", name: "Ana", password: "123" },
      { email: "marko@gmail.com", name: "Marko", password: "123" },
    ],
  });

  // --- EVENTS ---
  await prisma.event.createMany({
    data: [
      {
        title: "Tech Meetup Ljubljana",
        description: "A meetup focused on developers and new technologies.",
        date: new Date("2025-02-15T18:00:00"),
        
        city: "Ljubljana",
        country: "Slovenia",
        countryCode: "SI",

        imageUrl: null,
        category: "Technology",
        capacity: 100,

        userId: 1,
      },
      {
        title: "Football Fans Gathering Celje",
        description: "Live match viewing with local football enthusiasts.",
        date: new Date("2025-03-10T16:00:00"),

        city: "Celje",
        country: "Slovenia",
        countryCode: "SI",

        imageUrl: null,
        category: "Sports",
        capacity: 200,

        userId: 1,
      },
      {
        title: "Startup Meetup Maribor",
        description: "Entrepreneurs meet, pitch & brainstorm ideas.",
        date: new Date("2025-04-05T17:00:00"),

        city: "Maribor",
        country: "Slovenia",
        countryCode: "SI",

        imageUrl: null,
        category: "Business",
        capacity: 150,

        userId: 2,
      },
      {
        title: "Photography Walk Kranj",
        description: "Learn photography outdoors with pro photographers.",
        date: new Date("2025-05-01T10:00:00"),

        city: "Kranj",
        country: "Slovenia",
        countryCode: "SI",

        imageUrl: null,
        category: "Art",
        capacity: 50,

        userId: 2,
      },
    ],
  });

  console.log("✔ Seed completed!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error("❌ Seed failed:", err);
    await prisma.$disconnect();
    process.exit(1);
  });
