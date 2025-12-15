"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      // 1️⃣ LOGIN (nastavi cookie)
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setMessage(data.message || "Napaka pri prijavi.");
        setLoading(false);
        return;
      }

      // 2️⃣ FETCH CELOTNEGA USERJA (z image!)
      const meRes = await fetch("/api/me");
      const user = await meRes.json();

      // 3️⃣ SHRANI USERJA
      localStorage.setItem("user", JSON.stringify(user));

      // 4️⃣ OBVESTI NAVBAR / SIDEBAR
      window.dispatchEvent(new Event("user-login"));

      // 5️⃣ ZAPRI MODAL + REDIRECT
      onClose();
      router.push("/");
    } catch (error) {
      setMessage("Napaka pri povezavi s strežnikom.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 backdrop-blur-md bg-black/20"
        onClick={onClose}
      />

      {/* MODAL */}
      <form
        onSubmit={handleSubmit}
        className="relative bg-white p-8 rounded-2xl shadow-xl w-96 border border-gray-200 z-10"
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute top-3 right-3 text-gray-500 text-xl"
        >
          ✕
        </button>

        <h1 className="text-2xl font-bold mb-6 text-gray-800">Log in</h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border border-gray-300 rounded-xl"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-3 mb-6 border border-gray-300 rounded-xl"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-all duration-200"
        >
          {loading ? "Logging in..." : "Log in"}
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
          <p className="mt-4 text-red-500 text-sm">{message}</p>
        )}
      </form>
    </div>
  );
}
