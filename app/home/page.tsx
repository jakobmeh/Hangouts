"use client";

import { useEffect, useState } from "react";

interface EventWithUser {
  id: string;
  title: string;
  date: string;
  location: string;
  user: {
    name?: string;
    email: string;
  };
}

interface UserData {
  id: string;
  email: string;
  name?: string;
}

export default function HomePage() {
  const [events, setEvents] = useState<EventWithUser[]>([]);
  const [user, setUser] = useState<UserData | null>(null);

  // Naloži uporabnika iz localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Naloži dogodke iz API-ja
  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        setEvents(data.events || []);
      } catch (err) {
        console.error("Napaka pri nalaganju dogodkov:", err);
      }
    }
    fetchEvents();
  }, []);

  return (
    <main className="min-h-screen flex flex-col p-4">
      {user && (
        <h2 className="text-xl font-semibold mb-4 text-center">
          Pozdravljen, {user.name ? user.name : user.email}!
        </h2>
      )}

      <h1 className="text-2xl font-bold mb-4 text-center">Prihajajoči dogodki</h1>

      <div className="grid md:grid-cols-3 gap-4">
        {events.map((event) => (
          <div key={event.id} className="border p-4 rounded-lg shadow">
            <h2 className="font-semibold">{event.title}</h2>
            <p>
              {new Date(event.date).toLocaleDateString("sl-SI")} • {event.location}
            </p>
            <p className="text-sm text-gray-500">
              Ustvaril: {event.user?.name ? event.user.name : "Neznan uporabnik"}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
