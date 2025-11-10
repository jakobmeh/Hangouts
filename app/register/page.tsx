"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [message, setMessage] = useState(""); // samo za prikaz sporočila

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setMessage(data.message);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-80 text-center"
      >
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Registracija</h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <input
          type="password"
          name="password"
          placeholder="Geslo"
          required
          className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
        >
          Registriraj se
        </button>

        {message && (
          <p className="mt-4 text-red-500 font-medium">{message}</p>
        )}
      </form>
    </div>
  );
}
