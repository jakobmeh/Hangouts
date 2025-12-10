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
  const [loaded, setLoaded] = useState(false); // <-- pomembno, da ne pokaže fallback home page

  useEffect(() => {
    async function loadData() {
      const res = await fetch("/api/events");
      const data = await res.json();

      let filtered = data.events as EventType[];

      if (!filtered) {
        setEvents([]);
        setLoaded(true);
        return;
      }

      // ---------------------------
      // 1️⃣ FILTER BY EVENT NAME
      // ---------------------------
      if (eventQuery.length > 0) {
        filtered = filtered.filter((e) =>
          e.title.toLowerCase().includes(eventQuery.toLowerCase())
        );
      }

      // ---------------------------
      // 2️⃣ FILTER BY CITY / COUNTRY
      // supports: "Celje", "Slovenija", "Celje, Slovenija"
      // ---------------------------
      if (cityQuery.length > 0) {
        const parts = cityQuery.split(",").map((p) => p.trim().toLowerCase());

        const queryCity = parts[0] || "";
        const queryCountry = parts[1] || "";

        filtered = filtered.filter((e) => {
          const city = e.city?.toLowerCase() || "";
          const country = e.country?.toLowerCase() || "";

          // če ima uporabnik vpisan SAMO "Celje"
          if (queryCity && !queryCountry) {
            return city.includes(queryCity);
          }

          // če ima uporabnik vpisan SAMO "Slovenija"
          if (!queryCity && queryCountry) {
            return country.includes(queryCountry);
          }

          // če ima vpisano "Celje, Slovenija"
          return (
            (queryCity && city.includes(queryCity)) &&
            (queryCountry && country.includes(queryCountry))
          );
        });
      }

      setEvents(filtered);
      setLoaded(true);
    }

    loadData();
  }, [eventQuery, cityQuery]);

  // 🟥 dokler se API ne naloži, ne smemo nič risati → drugače Next vrne fallback HTML
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

      {/* RESULTS */}
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
