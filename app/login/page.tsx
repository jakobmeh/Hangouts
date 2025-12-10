"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Napaka pri prijavi.");
      } else {
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setMessage("Napaka pri povezavi s strežnikom.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-10 rounded-2xl shadow-xl w-96 text-center border border-gray-200"
      >
        <h1 className="text-3xl font-bold mb-6 text-gray-800 tracking-wide">Prijava</h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
        />

        <input
          type="password"
          name="password"
          placeholder="Geslo"
          required
          className="w-full p-3 mb-6 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-200 disabled:opacity-50"
        >
          {loading ? "Prijavljanje..." : "Prijava"}
        </button>

        {message && (
          <p className="mt-4 text-red-500 font-semibold">{message}</p>
        )}
      </motion.form>
    </div>
  );
}
