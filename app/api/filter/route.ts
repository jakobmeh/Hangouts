import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const eventQuery = searchParams.get("event")?.toLowerCase() || "";
  const cityQuery = searchParams.get("city")?.toLowerCase() || "";
  const category = searchParams.get("category")?.toLowerCase() || "";
  const dateFilter = searchParams.get("date") || "";
  const type = searchParams.get("type") || ""; // online | in-person
  const sort = searchParams.get("sort") || ""; // soonest | recent

  let events = await prisma.event.findMany({
    include: { user: true, attendees: true },
  });

  // NAME FILTER
  if (eventQuery) {
    events = events.filter(e =>
      e.title.toLowerCase().includes(eventQuery)
    );
  }

  // LOCATION FILTER
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

  // CATEGORY FILTER
  if (category) {
    events = events.filter(e =>
      e.category?.toLowerCase() === category
    );
  }

  // DATE FILTERS
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

  // TYPE FILTER
  if (type === "online") {
    events = events.filter(e => e.city.toLowerCase() === "online");
  }

  if (type === "in-person") {
    events = events.filter(e => e.city.toLowerCase() !== "online");
  }

  // SORTING
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

  return NextResponse.json({ events });
}
