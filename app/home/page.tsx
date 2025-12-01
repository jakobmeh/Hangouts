"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Sidebar, { UserType } from "../components/Sidebar";

export type EventType = {
  id: number;
  title: string;
  date: string;
  location: string;
  imageUrl?: string | null;
  userId: number;
  user: { id: number; email: string; name?: string | null } | null;
};

export default function HomePage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [user, setUser] = useState<UserType | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadData() {
     
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));

      
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        setEvents(data.events || []);
      } catch (err) {
        console.error("Napaka pri nalaganju dogodkov:", err);
      }
    }

    loadData();
  }, []);

 
  const filtered = events.filter((event) => {
    const s = search.toLowerCase();
    return (
      event.title.toLowerCase().includes(s) ||
      event.location.toLowerCase().includes(s) ||
      event.user?.name?.toLowerCase().includes(s) ||
      event.user?.email?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
     
      <Sidebar user={user} search={search} setSearch={setSearch} />

      <div className="flex-1 p-6">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Prihajajoči dogodki</h1>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition border border-gray-200"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{event.title}</h2>
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
      </div>
    </div>
  );
}
