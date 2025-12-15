"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import NavigationBar from "@/app/components/NavigationBar";
import Footer from "@/app/components/Footer";
import Sidebar from "@/app/components/sidebar";

export default function NewGroupPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    setUser(stored ? JSON.parse(stored) : null);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        city,
        country,
        imageUrl,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong");
      setLoading(false);
      return;
    }

    router.push("/groups");
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <NavigationBar />

      <div className="flex-1 bg-gray-100">
        <div className="max-w-7xl mx-auto flex gap-8 px-6 py-10">
          <aside className="w-72 shrink-0">
            <Sidebar user={user} />
          </aside>

          <main className="flex-1">
            <div className="max-w-2xl bg-white p-8 rounded-2xl border shadow-sm">
              <Link
                href="/groups"
                className="text-sm text-gray-500 hover:text-blue-600 inline-block mb-4"
              >
                ← Back to groups
              </Link>

              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Create new group
              </h1>
              <p className="text-gray-600 mb-6">
                Start a community around your interests
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Group name
                  </label>
                  <input
                    className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. Hiking Slovenia"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="What is this group about?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    City
                  </label>
                  <input
                    className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Ljubljana"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Country
                  </label>
                  <input
                    className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Slovenia"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Cover image (upload or URL)
                  </label>
                  <div className="flex flex-col gap-2">
                    <label className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 cursor-pointer hover:underline w-fit">
                      Upload from device
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = () => {
                            setImageUrl(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                    <input
                      className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="https://..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                    />
                    {imageUrl && (
                      <div className="mt-2 h-32 w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                        <img
                          src={imageUrl}
                          alt="Cover preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                    {error}
                  </div>
                )}

                <div className="pt-2">
                  <button
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {loading ? "Creating..." : "Create group"}
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
