import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🟢 Začenjam polnjenje baze...");

  // --- Uporabniki ---
  const users = await prisma.user.createMany({
    data: [
      { email: "janez@gmail.com", name: "Janez Novak", password: "123456" },
      { email: "ana@gmail.com", name: "Ana Kovač", password: "geslo123" },
      { email: "marko@gmail.com", name: "Marko Horvat", password: "pass321" },
    ],
  });

  console.log(`✅ Dodanih ${users.count} uporabnikov.`);

  // --- Dogodki ---
  const janez = await prisma.user.findUnique({ where: { email: "janez@gmail.com" } });
  const ana = await prisma.user.findUnique({ where: { email: "ana@gmail.com" } });
  const marko = await prisma.user.findUnique({ where: { email: "marko@gmail.com" } });

  await prisma.event.createMany({
    data: [
      {
        title: "Glasbeni festival Ljubljana",
        date: new Date("2025-07-20"),
        location: "Ljubljana, Kongresni trg",
        userId: janez!.id,
      },
      {
        title: "Športni dan v Celju",
        date: new Date("2025-06-15"),
        location: "Celje, Stadion Z'dežele",
        userId: ana!.id,
      },
      {
        title: "Startup vikend Maribor",
        date: new Date("2025-09-10"),
        location: "Maribor, Tovarna Podjemov",
        userId: marko!.id,
      },
      {
        title: "Stand-up večer",
        date: new Date("2025-05-25"),
        location: "Kranj, Layerjeva hiša",
        userId: ana!.id,
      },
      {
        title: "Boxing Night",
        date: new Date("2025-12-01"),
        location: "Ljubljana, Dvorana Tivoli",
        userId: janez!.id,
      },
    ],
  });

  console.log("✅ Dogodki uspešno dodani!");
}

main()
  .then(() => {
    console.log("🎉 Seed končan.");
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error("❌ Napaka pri seedanju:", e);
    prisma.$disconnect();
    process.exit(1);
  });
