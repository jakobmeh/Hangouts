"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NavigationBar from "@/app/components/NavigationBar";
import Footer from "@/app/components/Footer";

type EventType = {
  id: number;
  groupId: number;
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
  return (
    <Suspense fallback={<div className="p-6 text-gray-500">Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}

function SearchPageContent() {
  const params = useSearchParams();
  const router = useRouter();

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

  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />

      <main className="flex-1">
        <section className="max-w-5xl mx-auto px-6 py-10">
          <header className="mb-8 space-y-2">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
              Search
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Find events {cityQuery ? `in ${cityQuery}` : ""}
              </h1>
              <p className="text-gray-600 mt-2">
                Use the search bar above to filter by event name or location. Leave fields empty to see everything.
              </p>
            </div>
          </header>

          {!loaded ? (
            <div className="p-6 text-gray-500">Loading...</div>
          ) : events.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <button
                  key={event.id}
                  onClick={() => router.push(`/groups/${event.groupId}`)}
                  className="text-left bg-white/90 border border-gray-200 rounded-2xl shadow-lg shadow-blue-50 p-5 flex flex-col gap-3 hover:shadow-blue-100 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {event.title}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {event.city}
                        {event.country ? `, ${event.country}` : ""}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2">
                    {event.description || "No description provided."}
                  </p>

                  <p className="text-xs text-gray-500">
                    Created by: {event.user?.name || "Unknown"}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-white border rounded-2xl shadow-sm p-8 text-center text-gray-500">
              <p className="text-lg font-semibold">No events found</p>
              <p className="text-sm mt-1">
                Try adjusting the name or location filters.
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
