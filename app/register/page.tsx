"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

<<<<<<< Updated upstream
  const handleRegister = async () => {
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    setMessage(data.message);
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-200">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-10 rounded-2xl shadow-xl w-96 text-center border border-gray-200"
      >
        <h1 className="text-3xl font-bold mb-6 text-gray-800 tracking-wide">Registracija</h1>

        <input
          type="text"
          placeholder="Ime"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
        />

        <input
          type="password"
          placeholder="Geslo"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-200 disabled:opacity-50"
        >
          {loading ? "Registriranje..." : "Registriraj"}
        </button>

        {message && (
          <p className="mt-4 text-red-500 font-semibold">{message}</p>
        )}
      </motion.div>
=======
  async function handleRegister() {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })

    const data = await res.json()
    setMessage(data.message)
  }

  return (
    <div className="flex flex-col gap-4 max-w-sm mx-auto p-4">
      <input
        type="text"
        placeholder="Ime"
        value={name}
        onChange={function(e) { setName(e.target.value) }}
        className="border px-3 py-2 rounded"
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={function(e) { setEmail(e.target.value) }}
        className="border px-3 py-2 rounded"
      />

      <input
        type="password"
        placeholder="Geslo"
        value={password}
        onChange={function(e) { setPassword(e.target.value) }}
        className="border px-3 py-2 rounded"
      />

      <button
        onClick={handleRegister}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Registriraj
      </button>

      {message && <p className="text-red-500 mt-2">{message}</p>}
>>>>>>> Stashed changes
    </div>
  );
}