"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

import NavigationBar from "./components/NavigationBar";
import Footer from "./components/Footer";
import RegisterModal from "./components/RegisterModal";
import Sidebar from "./components/sidebar";

/* ================= TYPES ================= */

type UserType = {
  id: number;
  email: string;
  name?: string | null;
};

type GroupType = {
  id: number;
  name: string;
  city: string;
  country?: string | null;
  _count: {
    members: number;
    events: number;
  };
};

/* ================= PAGE ================= */

export default function HomePage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [myGroupIds, setMyGroupIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);

  /* ================= LOAD USER ================= */

  useEffect(() => {
    const stored = localStorage.getItem("user");
    setUser(stored ? JSON.parse(stored) : null);
  }, []);

  /* ================= SYNC LOGIN / LOGOUT ================= */

  useEffect(() => {
    function syncUser() {
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
    }

    window.addEventListener("user-login", syncUser);
    window.addEventListener("user-logout", syncUser);

    return () => {
      window.removeEventListener("user-login", syncUser);
      window.removeEventListener("user-logout", syncUser);
    };
  }, []);

  /* ================= LOAD ALL GROUPS ================= */

  useEffect(() => {
    async function loadGroups() {
      const res = await fetch("/api/groups");
      if (res.ok) {
        const data = await res.json();
        setGroups(data.slice(0, 6)); // pokažemo max 6
      }
    }

    loadGroups();
  }, []);

  /* ================= LOAD MY GROUPS ================= */

  useEffect(() => {
    async function loadMyGroups() {
      const res = await fetch("/api/me/groups");
      if (res.ok) {
        const data = await res.json();
        setMyGroupIds(data.map((g: any) => g.id));
      }
      setLoading(false);
    }

    if (user) {
      loadMyGroups();
    } else {
      setLoading(false);
    }
  }, [user]);

  /* ================= LOADING ================= */

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  /* ================= GUEST ================= */

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <NavigationBar />

        <section className="py-20 text-center">
          <h1 className="text-5xl font-bold mb-6">
            The 🧑‍🤝‍🧑 people platform.
          </h1>

          <p className="text-gray-600 max-w-2xl mx-auto">
            Join thousands of people meeting up daily.
          </p>

          <button
            className="mt-6 px-6 py-3 bg-black text-white rounded-full"
            onClick={() => setShowRegister(true)}
          >
            Join Meetup
          </button>
        </section>

        <Footer />

        {showRegister && (
          <RegisterModal onClose={() => setShowRegister(false)} />
        )}
      </div>
    );
  }

  /* ================= LOGGED IN ================= */

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <NavigationBar />

      <div className="flex flex-1 p-6 gap-6">
        {/* SIDEBAR */}
        <Sidebar user={user} />

        {/* MAIN */}
        <main className="flex-1 bg-white p-6 rounded-xl border">
          <h1 className="text-2xl font-bold mb-6">
            Discover groups
          </h1>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {groups
              .filter((group) => !myGroupIds.includes(group.id))
              .map((group) => (
                <Link
                  key={group.id}
                  href={`/groups/${group.id}`}
                  className="border rounded-xl p-4 hover:shadow transition bg-gray-50"
                >
                  <h2 className="font-semibold">{group.name}</h2>

                  <p className="text-sm text-gray-600">
                    📍 {group.city}
                    {group.country ? `, ${group.country}` : ""}
                  </p>

                  <p className="text-xs text-gray-500 mt-2">
                    {group._count.members} members ·{" "}
                    {group._count.events} events
                  </p>
                </Link>
              ))}
          </div>

          {groups.filter((g) => !myGroupIds.includes(g.id)).length === 0 && (
            <p className="text-gray-500 mt-10 text-center">
              🎉 You already joined all available groups
            </p>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/groups"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              View all groups
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 bg-gray-50 p-6 rounded-xl border"
          >
            <p className="text-gray-600">
              Events coming next 🚀
            </p>
          </motion.div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
