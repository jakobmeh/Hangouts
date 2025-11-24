"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";


type UserType = {
  id: number;
  email: string;
  name?: string | null;
};

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

export default function HomePage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [filtered, setFiltered] = useState<EventType[]>([]);
  const [user, setUser] = useState<UserType | null>(null);
  const [search, setSearch] = useState("");


  useEffect(() => {
    async function loadData() {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));

        const res = await fetch("/api/events");
        const data = await res.json();

        setEvents(data.events || []);
        setFiltered(data.events || []);
      } catch (err) {
        console.error("Napaka pri nalaganju dogodkov:", err);
      }
    }

    loadData();
  }, []);


  useEffect(() => {
    const s = search.toLowerCase();

    const f = events.filter((event) => {
      return (
        event.title.toLowerCase().includes(s) ||
        event.location.toLowerCase().includes(s) ||
        event.user?.name?.toLowerCase().includes(s) ||
        event.user?.email?.toLowerCase().includes(s)
      );
    });

    setFiltered(f);
  }, [search, events]);


  return (
    <main className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      {user && (
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-semibold mb-4 text-gray-800"
        >
          Pozdravljen, {user.name || user.email}!
        </motion.h2>
      )}

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-6 text-gray-900"
      >
        Prihajajoči dogodki
      </motion.h1>


     <input
  type="text"
  placeholder="Išči po naslovu, lokaciji ali ustvarjalcu..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="w-full max-w-md mb-8 p-3 rounded-xl border border-gray-300 shadow-sm
             text-gray-900 placeholder-gray-400
             focus:outline-none focus:ring-2 focus:ring-blue-500"
/>


    
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {filtered.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {event.title}
            </h2>

            <p className="text-gray-600 mb-1">
              📅 {new Date(event.date).toLocaleDateString("sl-SI")}
            </p>

            <p className="text-gray-600 mb-4">📍 {event.location}</p>

            <p className="text-sm text-gray-500">
              👤 Ustvaril: {event.user?.name || "Neznan uporabnik"}
            </p>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
