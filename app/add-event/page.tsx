"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type UserType = {
  id: number;
  email: string;
  name?: string | null;
};

export default function AddEventPage() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [user, setUser] = useState<UserType | null>(null);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setMessage("Najprej se prijavite.");
      return;
    }

    try {
      const res = await fetch("/api/add-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          date,
          location,
          imageUrl,
          userId: user.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Napaka pri dodajanju dogodka.");
      } else {
        setMessage("Dogodek uspešno dodan!");
       
        router.push("/home");
      }
    } catch (err) {
      console.error(err);
      setMessage("Napaka pri povezavi s strežnikom.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Dodaj dogodek</h1>

        <input
          type="text"
          placeholder="Naslov dogodka"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="text"
          placeholder="Lokacija"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="text"
          placeholder="URL slike (opcijsko)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
        >
          Dodaj dogodek
        </button>

        {message && <p className="mt-4 text-red-500 font-medium">{message}</p>}
      </form>
    </div>
  );
}
