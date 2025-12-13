"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type EventType = {
  id: number;
  title: string;
  description?: string | null;
  date: string;
  city: string;
  country: string;
  countryCode?: string | null;
  imageUrl?: string | null;
  category?: string | null;
  capacity?: number | null;
  user: {
    id: number;
    name: string | null;
    email: string;
  } | null;
};

export default function SearchPage() {
  const params = useSearchParams();

  const eventQuery = params.get("event")?.trim() || "";
  const cityQuery = params.get("city")?.trim() || "";

  const [events, setEvents] = useState<EventType[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadData() {
      
      const url =
        `/api/filter?event=${encodeURIComponent(eventQuery)}&city=${encodeURIComponent(cityQuery)}`;

      const res = await fetch(url);
      const data = await res.json();

      setEvents(data.events || []);
      setLoaded(true);
    }

    loadData();
  }, [eventQuery, cityQuery]);

 
  if (!loaded) {
    return <div className="p-6 text-gray-500">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">
        {cityQuery ? `Events near ${cityQuery}` : "All events"}
      </h1>

      {eventQuery && (
        <p className="text-gray-500 mb-4">Searching for: {eventQuery}</p>
      )}

     
      {events.length > 0 ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white p-4 border rounded-xl shadow-sm"
            >
              <h2 className="text-xl font-semibold mb-1">{event.title}</h2>

              <p className="text-gray-600">
                {new Date(event.date).toLocaleDateString("sl-SI")}
              </p>

              <p className="text-gray-500">
                {event.city}, {event.country}
              </p>

              <p className="text-sm text-gray-400">
                Created by: {event.user?.name || "Unknown"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10 text-lg">
          No events found matching your search.
        </p>
      )}
    </div>
  );
}
