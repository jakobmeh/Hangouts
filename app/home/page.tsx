"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [events, setEvents] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(function () {
    async function loadData() {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        const res = await fetch("/api/events");
        const data = await res.json();
        setEvents(data.events || []);
      } catch (err) {
        console.error("Napaka pri nalaganju dogodkov:", err);
      }
    }

    loadData();
  }, []);

  return (
    <main className="min-h-screen flex flex-col p-4 text-center">
      {user ? (
        <h2 className="text-xl font-semibold mb-4">
          Pozdravljen, {user?.name || user?.email}!
        </h2>
      ) : null}

      <h1 className="text-2xl font-bold mb-4">Prihajajoči dogodki</h1>

      <div className="grid md:grid-cols-3 gap-4">
        {events.map(function (event: any) {
          return (
            <div key={event.id} className="border p-4 rounded-lg shadow">
              <h2 className="font-semibold">{event.title}</h2>
              <p>
                {new Date(event.date).toLocaleDateString("sl-SI")} • {event.location}
              </p>
              <p className="text-sm text-gray-500">
                Ustvaril: {event.user?.name || "Neznan uporabnik"}
              </p>
            </div>
          );
        })}
      </div>
    </main>
  );
}
