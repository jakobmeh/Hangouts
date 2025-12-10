"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type EventType = {
  id: number;
  title: string;
  date: string;
  location: string;
  imageUrl?: string | null;
  userId: number;
  user: {
    id: number;
    email: string;
    name?: string | null;
  } | null;
};

export default function SearchPage() {
  const params = useSearchParams();

  const eventQuery = params.get("event") || "";
  const cityQuery = params.get("city") || "";

  const [events, setEvents] = useState<EventType[]>([]);

  useEffect(() => {
    async function loadData() {
      const res = await fetch("/api/events");
      const data = await res.json();
      let filtered: EventType[] = data.events;

      // FILTER BY EVENT NAME
      if (eventQuery) {
        filtered = filtered.filter((e: EventType) =>
          e.title.toLowerCase().includes(eventQuery.toLowerCase())
        );
      }

      // FILTER BY CITY
      if (cityQuery) {
        filtered = filtered.filter((e: EventType) =>
          e.location.toLowerCase().includes(cityQuery.toLowerCase())
        );
      }

      setEvents(filtered);
    }

    loadData();
  }, [eventQuery, cityQuery]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">
        {cityQuery ? `Events near ${cityQuery}` : "All Events"}
      </h1>

      {eventQuery && (
        <p className="text-gray-500 mb-4">Searching for: {eventQuery}</p>
      )}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {events.map((event: EventType) => (
          <div
            key={event.id}
            className="bg-white p-4 border rounded-xl shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-1">{event.title}</h2>

            <p className="text-gray-600">
              {new Date(event.date).toLocaleDateString("sl-SI")}
            </p>

            <p className="text-gray-500">{event.location}</p>

            <p className="text-sm text-gray-400">
              Created by: {event.user?.name || "Unknown"}
            </p>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No events found matching your search.
        </p>
      )}
    </div>
  );
}
