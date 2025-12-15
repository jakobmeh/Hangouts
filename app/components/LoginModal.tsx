"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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

      if (!res.ok) {
        const data = await res.json();
        setMessage(data.message || "Napaka pri prijavi.");
        setLoading(false);
        return;
      }

      const meRes = await fetch("/api/me");
      const user = await meRes.json();

      localStorage.setItem("user", JSON.stringify(user));
      window.dispatchEvent(new Event("user-login"));

      onClose();
      router.push("/");
    } catch (error) {
      setMessage("Napaka pri povezavi s strežnikom.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <form
        onSubmit={handleSubmit}
        className="relative w-[380px] max-w-full rounded-3xl bg-white p-6 shadow-2xl"
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute right-4 top-4 text-xl text-gray-500 hover:text-gray-700"
        >
          ×
        </button>

        <div className="mb-5 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Log in</h1>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => (window.location.href = "/api/auth/signin/google")}
            className="w-full rounded-full border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-800 hover:border-blue-400 hover:text-blue-600 transition flex items-center justify-center gap-2"
          >
            <svg className="h-5 w-5" viewBox="0 0 533.5 544.3" aria-hidden="true">
              <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.5-34-4.3-50.2H272v95h147.5c-6.4 34.7-25.7 64.1-54.7 83.7v69h88.4c51.6-47.5 80.3-117.5 80.3-197.5z"/>
              <path fill="#34A853" d="M272 544.3c73.9 0 135.9-24.5 181.2-66.4l-88.4-69c-24.6 16.5-56 26.2-92.8 26.2-71.3 0-131.8-48-153.4-112.6H26.8v71.3C71.6 483.5 164.3 544.3 272 544.3z"/>
              <path fill="#FBBC04" d="M118.6 322.5c-5.6-16.5-8.8-34-8.8-52s3.2-35.5 8.8-52v-71.3H26.8C9.7 182.8 0 225.6 0 270.5s9.7 87.7 26.8 123.3l91.8-71.3z"/>
              <path fill="#EA4335" d="M272 107.7c40.2 0 76.3 13.9 104.7 41.1l78.5-78.5C407.9 24.5 345.9 0 272 0 164.3 0 71.6 60.8 26.8 147.2l91.8 71.3C140.2 155.7 200.7 107.7 272 107.7z"/>
            </svg>
            Log in with Google
          </button>

          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex-1 border-t" />
            <span>or</span>
            <span className="flex-1 border-t" />
          </div>

          <label className="block text-sm font-semibold text-gray-800">
            Email
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </label>

          <label className="block text-sm font-semibold text-gray-800">
            Password
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        {message && <p className="mt-3 text-center text-sm text-red-500">{message}</p>}
      </form>
    </div>
  );
}
