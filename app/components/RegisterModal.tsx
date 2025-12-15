"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      setMessage(data.message);

     if (res.ok) {
  localStorage.setItem("user", JSON.stringify(data.user));
  window.dispatchEvent(new Event("user-login"));

  onClose();
  router.push("/");
}

    } catch (err) {
      setMessage("Prišlo je do napake. Poskusi ponovno.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">

      
      <div
        className="absolute inset-0 backdrop-blur-md bg-black/20"
        onClick={onClose}
      />

     
      <form
        onSubmit={handleRegister}
        className="relative bg-white p-8 rounded-2xl shadow-xl w-96 border border-gray-200 z-10"
      >
       
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 text-xl hover:text-gray-700"
        >
          ✕
        </button>

        <h1 className="text-2xl font-bold mb-6 text-gray-800">Sign up</h1>

        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-xl"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-xl"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 border border-gray-300 rounded-xl"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 disabled:opacity-50"
        >
          {loading ? "Signing up..." : "Create account"}
        </button>

        <div className="my-4 flex items-center gap-3 text-xs text-gray-400">
          <span className="flex-1 border-t" />
          <span>or</span>
          <span className="flex-1 border-t" />
        </div>

        <button
          type="button"
          onClick={() => (window.location.href = "/api/auth/signin/google")}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-800 font-semibold py-3 rounded-xl hover:border-blue-400 hover:text-blue-600 transition"
        >
          <img src="/icons/google.png" alt="" className="h-5 w-5" />
          Continue with Google
        </button>

        {message && (
          <p className="mt-4 text-gray-700 text-sm font-medium">{message}</p>
        )}
      </form>
    </div>
  );
}
