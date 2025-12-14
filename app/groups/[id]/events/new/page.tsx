"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function NewEventPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.id as string;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [city, setCity] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch(`/api/groups/${groupId}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        date,
        city,
        country: "Slovenia",
      }),
    });

    if (res.ok) {
      router.push(`/groups/${groupId}`);
    } else {
      alert("Failed to create event");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow w-full max-w-lg"
      >
        <h1 className="text-2xl font-bold mb-6">Create Event</h1>

        <input
          className="w-full border rounded-lg p-3 mb-4"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          className="w-full border rounded-lg p-3 mb-4"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="datetime-local"
          className="w-full border rounded-lg p-3 mb-4"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <input
          className="w-full border rounded-lg p-3 mb-6"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700"
        >
          Create Event
        </button>
      </form>
    </div>
  );
}
