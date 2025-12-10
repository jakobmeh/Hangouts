"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import NavigationBar from "./components/NavigationBar";
import Footer from "./components/Footer";

export type UserType = {
  id: number;
  email: string;
  name?: string | null;
};

export type EventType = {
  id: number;
  title: string;
  date: string;
  city: string;
  country: string;
  imageUrl?: string | null;
  userId: number;
  user: { id: number; email: string; name?: string | null } | null;
};

export default function HomePage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

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

      setLoading(false);
    }

    loadData();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  // =====================================================================================
  // 1️⃣ PUBLIC HOMEPAGE (ko ni prijavljen)
  // =====================================================================================
  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <NavigationBar />

        {/* HERO SECTION */}
        <section className="py-20 flex flex-col items-center text-center">
          <h1 className="text-5xl font-bold leading-tight mb-6">
            The 🧑‍🤝‍🧑 people platform.<br />
            Where ✨ interests become 💗 friendships.
          </h1>

          <p className="text-gray-600 max-w-2xl">
            Join thousands of people meeting up daily. From tech meetups to hobbies,
            find your community and make new connections.
          </p>

          <button className="mt-6 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800">
            Join Meetup
          </button>
        </section>

        {/* EVENTS PREVIEW */}
        <section className="px-10 pb-20">
          <h2 className="text-3xl font-bold mb-6">
            Events near <span className="text-purple-600">you</span>
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {events.slice(0, 6).map((event) => (
              <div key={event.id} className="p-4 bg-white border rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold">{event.title}</h3>
                <p className="text-gray-600">{event.city}, {event.country}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(event.date).toLocaleDateString("sl-SI")}
                </p>
              </div>
            ))}
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  // =====================================================================================
  // 2️⃣ LOGGED-IN DASHBOARD (tvoj layout)
  // =====================================================================================
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col" style={{ backgroundColor: "#f5f5f5" }}>
      <NavigationBar />

      <div className="flex flex-1 p-6 gap-6">
        {/* LEFT SIDEBAR */}
        <aside className="w-64 flex-shrink-0 flex flex-col gap-4">

          {/* PROFILE */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-300 rounded-full mb-2"></div>

            <h2 className="font-semibold text-gray-800 text-center">
              {user?.name || "Neznan uporabnik"}
            </h2>

            <p className="text-gray-500 text-sm text-center">{user?.email}</p>
          </div>

          {/* YOUR EVENTS */}
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <h3 className="text-gray-700 font-semibold mb-2">Your Events</h3>
            <ul className="text-gray-600 text-sm space-y-1 max-h-40 overflow-y-auto">
              {events.map((e) => (
                <li key={e.id}>{e.title}</li>
              ))}
            </ul>
          </div>

          {/* YOUR GROUPS */}
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <h3 className="text-gray-700 font-semibold mb-2">Your Groups</h3>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>Group 1</li>
              <li>Group 2</li>
              <li>Group 3</li>
            </ul>
          </div>

        </aside>

        {/* MAIN DASHBOARD CONTENT */}
        <main className="flex-1 bg-white p-6 rounded-xl border border-gray-200">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">From groups you are part of</h1>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {events.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-50 p-4 rounded-xl border border-gray-200"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {event.title}
                </h2>

                <p className="text-gray-600 mb-1">
                  {new Date(event.date).toLocaleDateString("sl-SI")}
                </p>

                <p className="text-gray-600 mb-2">
                  {event.city}, {event.country}
                </p>

                <p className="text-sm text-gray-500">
                  Created by: {event.user?.name || "Unknown user"}
                </p>
              </motion.div>
            ))}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
