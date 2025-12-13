"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import NavigationBar from "./components/NavigationBar";
import Footer from "./components/Footer";
import RegisterModal from "./components/RegisterModal";
import { useRouter } from "next/navigation";

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

type GroupType = {
  id: number;
  name: string;
  description?: string | null;
  city: string;
  country?: string | null;
  _count: {
    members: number;
  };
};


export default function HomePage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
const [groups, setGroups] = useState<GroupType[]>([]);
const router = useRouter();

  useEffect(() => {
  async function loadData() {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    try {
      const [eventsRes, groupsRes] = await Promise.all([
        fetch("/api/events"),
        fetch("/api/groups"),
      ]);

      const eventsData = await eventsRes.json();
      const groupsData = await groupsRes.json();

      setEvents(eventsData.events || []);
      setGroups(groupsData.groups || []);
    } catch (err) {
      console.error("Napaka pri nalaganju:", err);
    }

    setLoading(false);
  }

  loadData();
}, []);


  useEffect(() => {
    function syncUser() {
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
    }

    syncUser();

    window.addEventListener("user-login", syncUser);
    window.addEventListener("user-logout", syncUser);

    return () => {
      window.removeEventListener("user-login", syncUser);
      window.removeEventListener("user-logout", syncUser);
    };
  }, []);

  // LOAD EVENTS
  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        setEvents(data.events || []);
      } catch (err) {
        console.error("Napaka pri nalaganju dogodkov:", err);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

 
 if (!user) {
  return (
    <div className="min-h-screen bg-white relative">
      <NavigationBar />

      {/* HERO */}
      <section className="py-20 flex flex-col items-center text-center">
        <h1 className="text-5xl font-bold leading-tight mb-6">
          The 🧑‍🤝‍🧑 people platform.<br />
          Where ✨ interests become 💗 friendships.
        </h1>

        <p className="text-gray-600 max-w-2xl">
          Join thousands of people meeting up daily. From tech meetups to hobbies,
          find your community and make new connections.
        </p>

        <button
          className="mt-6 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800"
          onClick={() => setShowRegister(true)}
        >
          Join Meetup
        </button>
      </section>
{/* POPULAR GROUPS */}
<section className="px-10 pb-24">
   <div className="flex items-center justify-between mb-6">
    <h2 className="text-3xl font-bold">
      Popular groups <span className="text-purple-600">near you</span>
    </h2>

    <span
      onClick={() => router.push("/groups")}
      className="text-sm text-purple-600 cursor-pointer hover:underline"
    >
      See all groups
    </span>
  </div>

  <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
    {groups.map((group) => (
      <div
        key={group.id}
        className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition"
      >
        {/* IMAGE PLACEHOLDER */}
        <div className="h-32 bg-gray-200 rounded-lg mb-4" />

        {/* GROUP NAME */}
        <h3 className="text-lg font-semibold mb-1">
          {group.name}
        </h3>

        {/* LOCATION */}
        <p className="text-sm text-gray-600">
          {group.city}, {group.country}
        </p>

        {/* MEMBERS */}
        <p className="text-sm text-gray-500 mt-1">
          👥 {group._count.members} members
        </p>

        {/* VIEW BUTTON */}
        <button
          onClick={() => router.push(`/groups/${group.id}`)}
          className="mt-4 w-full border rounded-full py-2 text-sm hover:bg-gray-100"
        >
          View group
        </button>
      </div>
    ))}
  </div>
</section>

      {/* EVENTS PREVIEW – GLOBAL */}
      <section className="px-10 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">
            Popular events <span className="text-purple-600">around the world</span>
          </h2>

          <span className="text-sm text-purple-600 cursor-pointer hover:underline">
            See all events
          </span>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {events.slice(0, 8).map((event) => (
            <div
              key={event.id}
              className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
            >
              {/* IMAGE PLACEHOLDER */}
              <div className="h-40 bg-gray-200" />

              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">
                  {event.title}
                </h3>

                <p className="text-sm text-gray-600">
                  {event.city}, {event.country}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {new Date(event.date).toLocaleDateString("sl-SI")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 bg-gray-50">
  <h2 className="text-4xl font-bold text-center mb-16">
    How Meetup works
  </h2>

  <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6">
    
    {/* CARD 1 */}
    <div className="bg-white rounded-3xl p-8 shadow-sm">
      <div className="text-3xl mb-4">🔍</div>

      <h3 className="text-xl font-semibold mb-2">
        Discover events and groups
      </h3>

      <p className="text-gray-600 mb-4">
        See who's hosting local events for all the things you love.
      </p>

      <span className="text-purple-600 font-medium cursor-pointer hover:underline">
        Search events and groups
      </span>
    </div>

    {/* CARD 2 */}
    <div className="bg-white rounded-3xl p-8 shadow-sm">
      <div className="text-3xl mb-4">👥</div>

      <h3 className="text-xl font-semibold mb-2">
        Find your people
      </h3>

      <p className="text-gray-600">
        Connect over shared interests and enjoy meaningful experiences.
      </p>
    </div>

    {/* CARD 3 */}
    <div className="bg-white rounded-3xl p-8 shadow-sm">
      <div className="text-3xl mb-4">✨</div>

      <h3 className="text-xl font-semibold mb-2">
        Start a group to host events
      </h3>

      <p className="text-gray-600 mb-4">
        Create your own Meetup group, and draw from a community of millions.
      </p>

      <span className="text-purple-600 font-medium cursor-pointer hover:underline">
        Start a group
      </span>
    </div>

  </div>

  {/* FOOT NOTE */}
  <div className="text-center mt-12 text-green-600 font-medium">
    💚 Meetup = community
  </div>
</section>

      <Footer />

      {/* REGISTER MODAL */}
      {showRegister && (
        <RegisterModal onClose={() => setShowRegister(false)} />
      )}
    </div>
  );
}




  return (
    <div className="min-h-screen bg-gray-100 flex flex-col" style={{ backgroundColor: "#f5f5f5" }}>
      <NavigationBar />

      <div className="flex flex-1 p-6 gap-6">
        
        <aside className="w-64 flex-shrink-0 flex flex-col gap-4">

          
          <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-300 rounded-full mb-2"></div>

            <h2 className="font-semibold text-gray-800 text-center">
              {user?.name || "Neznan uporabnik"}
            </h2>

            <p className="text-gray-500 text-sm text-center">{user?.email}</p>
          </div>

         
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <h3 className="text-gray-700 font-semibold mb-2">Your Events</h3>
            <ul className="text-gray-600 text-sm space-y-1 max-h-40 overflow-y-auto">
              {events.map((e) => (
                <li key={e.id}>{e.title}</li>
              ))}
            </ul>
          </div>

         
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <h3 className="text-gray-700 font-semibold mb-2">Your Groups</h3>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>Group 1</li>
              <li>Group 2</li>
              <li>Group 3</li>
            </ul>
          </div>

        </aside>

      
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
