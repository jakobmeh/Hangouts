"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

import NavigationBar from "./components/NavigationBar";
import Footer from "./components/Footer";
import RegisterModal from "./components/RegisterModal";
import Sidebar from "./components/sidebar";
import Skeleton from "./components/Skeleton";
import Image from "next/image";
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
    }
  }, [user]);

  // Fetch server session (NextAuth) when no local user
  useEffect(() => {
    async function ensureUser() {
      if (user) return;
      try {
        const res = await fetch("/api/me", { cache: "no-store" });
        if (res.ok) {
          const me = await res.json();
          setUser(me);
          localStorage.setItem("user", JSON.stringify(me));
        }
      } finally {
        setLoading(false);
      }
    }
    ensureUser();
  }, [user]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col">
        <div className="border-b border-gray-200 bg-white/70 backdrop-blur">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Skeleton className="h-8 w-32" />
            <div className="flex gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-24 rounded-full" />
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm"
              >
                <Skeleton className="h-5 w-32" />
                <Skeleton className="mt-3 h-4 w-24" />
                <div className="mt-4 space-y-2">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 bg-white/70 backdrop-blur">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </div>
    );
  }

  /* ================= GUEST ================= */

 if (!user) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <NavigationBar />

      <section className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-3xl">
         <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 flex flex-wrap items-center justify-center gap-3">
  <span>The</span>

  <span className="inline-flex items-center gap-2 text-blue-600">
    <img
      src="/icons/group.png"
      alt="Group"
      className="h-10 md:h-20 w-auto align-middle"
    />
    people
  </span>

  <span>platform</span>
</h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Join thousands of people meeting up, creating events, and building
            real connections every day.
          </p>

          <button
            className="
              inline-flex items-center justify-center
              px-8 py-4 rounded-full
              bg-blue-600 text-white font-semibold
              shadow-lg shadow-blue-600/30
              hover:bg-blue-700 hover:shadow-blue-700/40
              transition-all duration-200
            "
            onClick={() => setShowRegister(true)}
          >
            Join Meetup
          </button>
        </div>
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
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col">
    <NavigationBar />

    <div className="flex flex-1 max-w-7xl mx-auto w-full px-6 py-8 gap-8">
      {/* SIDEBAR */}
      <Sidebar user={user} />

      {/* MAIN */}
      <main className="
        flex-1
        bg-white/80 backdrop-blur
        rounded-3xl
        border border-gray-200
        shadow-sm
        p-8
      ">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Discover groups
            </h1>
            <p className="text-gray-500 mt-1">
              Find communities and start meeting people
            </p>
          </div>

         
        </div>

        {/* GROUPS GRID */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {groups
            .filter((group) => !myGroupIds.includes(group.id))
            .map((group) => (
              <Link
                key={group.id}
                href={`/groups/${group.id}`}
                className="
                  group
                  rounded-2xl
                  border border-gray-200
                  bg-gradient-to-br from-white via-gray-50 to-gray-100
                  p-6
                  hover:shadow-md
                  hover:-translate-y-0.5
                  transition-all
                "
              >
                <h2 className="
                  font-semibold text-lg text-gray-900
                  group-hover:text-blue-600 transition
                ">
                  {group.name}
                </h2>

               <p className="flex items-center gap-1 text-sm text-gray-600 mt-1">
  <Image
    src="/icons/placeholder.png"
    alt="Location"
    width={18}
    height={18}
  />
  <span>
    {group.city}
    {group.country ? `, ${group.country}` : ""}
  </span>
</p>

<div className="mt-4 flex gap-4 text-xs text-gray-500">
  <span className="flex items-center gap-1">
    <Image
      src="/icons/groups.png"
      alt="Members"
      width={18}
      height={18}
    />
    {group._count.members} members
  </span>

  <span className="flex items-center gap-1">
    <Image
      src="/icons/event-list.png"
      alt="Events"
      width={18}
      height={18}
    />
    {group._count.events} events
  </span>
</div>
              </Link>
            ))}
        </div>

        {/* EMPTY STATE */}
        {groups.filter((g) => !myGroupIds.includes(g.id)).length === 0 && (
          <div className="mt-16 text-center">
            <div className="text-4xl mb-4">🎉</div>
            <p className="text-gray-600 text-lg">
              You already joined all available groups
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/groups"
            className="
              inline-flex items-center justify-center
              px-8 py-4 rounded-full
              bg-blue-600 text-white font-semibold
              shadow-lg shadow-blue-600/30
              hover:bg-blue-700 hover:shadow-blue-700/40
              transition
            "
          >
            Explore all groups
          </Link>
        </div>

        {/* COMING SOON */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            mt-12
            bg-gradient-to-br from-gray-50 to-white
            border border-dashed border-gray-300
            rounded-2xl
            p-6
            text-center
          "
        >
          <p className="text-gray-500 font-medium">
            🚀 Events coming next
          </p>
        </motion.div>
      </main>
    </div>

    <Footer />
  </div>
);

}


