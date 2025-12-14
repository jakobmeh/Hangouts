import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
   console.log("🧹 Cleaning database...");

  await prisma.attendee.deleteMany();
  await prisma.event.deleteMany();
  await prisma.groupMember.deleteMany();
  await prisma.group.deleteMany();
  await prisma.user.deleteMany();
  // --------------------
  // USERS
  // --------------------
  const ana = await prisma.user.create({
    data: {
      email: "ana@gmail.com",
      name: "Ana",
      password: "123",
    },
  });

  const marko = await prisma.user.create({
    data: {
      email: "marko@gmail.com",
      name: "Marko",
      password: "123",
    },
  });

  const jakob = await prisma.user.create({
    data: {
      email: "jakob@gmail.com",
      name: "Jakob",
      password: "123",
    },
  });

  const eva = await prisma.user.create({
    data: {
      email: "eva@gmail.com",
      name: "Eva",
      password: "123",
    },
  });

  // --------------------
  // GROUPS
  // --------------------
  const reactLj = await prisma.group.create({
    data: {
      name: "React Ljubljana",
      city: "Ljubljana",
      country: "Slovenia",
      ownerId: ana.id,
    },
  });

  const nodeMb = await prisma.group.create({
    data: {
      name: "Node.js Maribor",
      city: "Maribor",
      country: "Slovenia",
      ownerId: jakob.id,
    },
  });

  const uxGroup = await prisma.group.create({
    data: {
      name: "UX Designers",
      city: "Ljubljana",
      country: "Slovenia",
      ownerId: ana.id,
    },
  });

  const hiking = await prisma.group.create({
    data: {
      name: "Hiking Slovenia",
      city: "Bled",
      country: "Slovenia",
      ownerId: eva.id,
    },
  });

  // --------------------
  // GROUP MEMBERS
  // --------------------
  await prisma.groupMember.createMany({
    data: [
      { userId: ana.id, groupId: reactLj.id },
      { userId: ana.id, groupId: uxGroup.id },
      { userId: ana.id, groupId: nodeMb.id },

      { userId: marko.id, groupId: reactLj.id },
      { userId: marko.id, groupId: hiking.id },

      { userId: jakob.id, groupId: reactLj.id },
    ],
  });

  // --------------------
  // DATES HELPERS
  // --------------------
  const daysFromNow = (d: number) =>
    new Date(Date.now() + d * 24 * 60 * 60 * 1000);

  // --------------------
  // EVENTS
  // --------------------
  const events = await prisma.event.createMany({
    data: [
      // FUTURE EVENTS
      {
        title: "React Meetup #1",
        date: daysFromNow(5),
        city: "Ljubljana",
        country: "Slovenia",
        userId: ana.id,
        groupId: reactLj.id,
      },
      {
        title: "Advanced React Patterns",
        date: daysFromNow(12),
        city: "Ljubljana",
        country: "Slovenia",
        userId: ana.id,
        groupId: reactLj.id,
      },
      {
        title: "Node.js Backend Night",
        date: daysFromNow(7),
        city: "Maribor",
        country: "Slovenia",
        userId: jakob.id,
        groupId: nodeMb.id,
      },
      {
        title: "UX Research Workshop",
        date: daysFromNow(15),
        city: "Ljubljana",
        country: "Slovenia",
        userId: ana.id,
        groupId: uxGroup.id,
      },
      {
        title: "Sunday Hiking Trip",
        date: daysFromNow(10),
        city: "Bled",
        country: "Slovenia",
        userId: eva.id,
        groupId: hiking.id,
      },

      // PAST EVENTS
      {
        title: "Old React Meetup",
        date: daysFromNow(-10),
        city: "Ljubljana",
        country: "Slovenia",
        userId: ana.id,
        groupId: reactLj.id,
      },
      {
        title: "Past Node Meetup",
        date: daysFromNow(-20),
        city: "Maribor",
        country: "Slovenia",
        userId: jakob.id,
        groupId: nodeMb.id,
      },
      {
        title: "Old Hiking Trip",
        date: daysFromNow(-5),
        city: "Bled",
        country: "Slovenia",
        userId: eva.id,
        groupId: hiking.id,
      },
    ],
  });

  // --------------------
  // ATTENDEES
  // --------------------
  const allEvents = await prisma.event.findMany();

  await prisma.attendee.createMany({
    data: [
      // Ana attends everything
      ...allEvents.map((e) => ({
        userId: ana.id,
        eventId: e.id,
      })),

      // Marko attends some
      { userId: marko.id, eventId: allEvents[0].id },
      { userId: marko.id, eventId: allEvents[2].id },

      // Jakob attends React
      { userId: jakob.id, eventId: allEvents[0].id },
    ],
  });

  console.log("✅ Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
