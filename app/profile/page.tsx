"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import NavigationBar from "@/app/components/NavigationBar";
import Sidebar from "@/app/components/sidebar";
import Footer from "@/app/components/Footer";

/* ================= TYPES ================= */

type UserType = {
  id: number;
  name?: string;
  email: string;
  image?: string | null;
};

/* ================= PAGE ================= */

export default function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  /* ================= LOAD USER ================= */

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      setName(u.name || "");
      setImage(u.image || null);
    }
  }, []);

  /* ================= IMAGE UPLOAD (PREVIEW) ================= */

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  /* ================= SAVE ================= */

  async function handleSave(e: React.FormEvent) {
  e.preventDefault();
  setLoading(true);

  const res = await fetch("/api/me", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      image,
    }),
  });

  const updated = await res.json();

  // 🔥 posodobi localStorage + navbar
  localStorage.setItem("user", JSON.stringify(updated));
  window.dispatchEvent(new Event("user-login"));

  setSuccess("Profile updated");
  setLoading(false);
}


  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <NavigationBar />

      <div className="flex flex-1 max-w-7xl mx-auto w-full px-6 py-8 gap-8">
        {/* SIDEBAR */}
        <aside className="w-72 shrink-0">
          <Sidebar user={user} />
        </aside>

        {/* MAIN */}
        <main className="flex-1 flex justify-center">
          <div className="w-full max-w-2xl bg-white rounded-2xl border shadow-sm p-8">
            <h1 className="text-2xl text-gray-700 font-bold mb-6">Profile settings</h1>

            <form onSubmit={handleSave} className="space-y-6">
              {/* AVATAR */}
              <div className="flex items-center gap-6">
                <div className="relative w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
                  {image ? (
                    <Image
                      src={image}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-xl font-semibold">
                      {name?.[0] || "U"}
                    </div>
                  )}
                </div>

                <label className="text-sm font-medium text-blue-600 cursor-pointer hover:underline">
                  Change photo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              {/* NAME */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  value={user.email}
                  disabled
                  className="w-full p-3 rounded-lg border border-gray-200 bg-gray-100 text-gray-500"
                />
              </div>

              {/* SUCCESS */}
              {success && (
                <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                  {success}
                </div>
              )}

              {/* SAVE */}
              <div className="pt-2">
                <button
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
