import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const eventQuery = searchParams.get("event")?.toLowerCase() || "";
  const cityQuery = searchParams.get("city")?.toLowerCase() || "";
  const category = searchParams.get("category")?.toLowerCase() || "";
  const dateFilter = searchParams.get("date") || "";
  const type = searchParams.get("type") || ""; 
  const sort = searchParams.get("sort") || ""; 

  const pageSize = Number(searchParams.get("pageSize") || "9");
  const page = Math.max(1, Number(searchParams.get("page") || "1"));

  let events = await prisma.event.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      date: true,
      city: true,
      country: true,
      imageUrl: true,
      category: true,
      capacity: true,
      userId: true,
      groupId: true,
      user: {
        select: { id: true, name: true, email: true },
      },
      attendees: true,
    },
  });

 
  if (eventQuery) {
    events = events.filter(e =>
      e.title.toLowerCase().startsWith(eventQuery)
    );
  }

  
  if (cityQuery) {
    const parts = cityQuery.split(",").map(p => p.trim().toLowerCase());
    const city = parts[0];
    const country = parts[1] || "";

    events = events.filter(e => {
      const evCity = e.city.toLowerCase();
      const evCountry = e.country.toLowerCase();

      if (city && !country) return evCity.includes(city);
      if (!city && country) return evCountry.includes(country);

      return evCity.includes(city) && evCountry.includes(country);
    });
  }

  
  if (category) {
    events = events.filter(e =>
      e.category?.toLowerCase() === category
    );
  }

  
  const now = new Date();
  function isWithinDays(eventDate: Date, days: number) {
    const diff = (eventDate.getTime() - now.getTime()) / (1000 * 3600 * 24);
    return diff >= 0 && diff <= days;
  }

  if (dateFilter === "today") {
    events = events.filter(e =>
      new Date(e.date).toDateString() === now.toDateString()
    );
  }

  if (dateFilter === "this-week") {
    events = events.filter(e => isWithinDays(new Date(e.date), 7));
  }

  if (dateFilter === "this-month") {
    events = events.filter(e => new Date(e.date).getMonth() === now.getMonth());
  }

  
  if (type === "online") {
    events = events.filter(e => e.city.toLowerCase() === "online");
  }

  if (type === "in-person") {
    events = events.filter(e => e.city.toLowerCase() !== "online");
  }

 
  if (sort === "soonest") {
    events.sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  if (sort === "recent") {
    events.sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  const total = events.length;
  const start = (page - 1) * pageSize;
  const paged = events.slice(start, start + pageSize);

  return NextResponse.json({ events: paged, total, page, pageSize });
}
