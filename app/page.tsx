"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
  _count?: { members: number };
};

/* ================= PAGE ================= */

export default function HomePage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [groups] = useState<GroupType[]>([]); // placeholder
  const [loading, setLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);

  /* ================= LOAD USER ================= */

  useEffect(() => {
    const stored = localStorage.getItem("user");
    setUser(stored ? JSON.parse(stored) : null);
    setLoading(false);
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
        <Sidebar user={user} events={[]} groups={groups} />

        <main className="flex-1 bg-white p-6 rounded-xl border">
          <h1 className="text-2xl font-bold mb-6">
            Welcome 👋
          </h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-50 p-6 rounded-xl border"
          >
            <p className="text-gray-600">
              You are logged in. Events are disabled for now.
            </p>
          </motion.div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
