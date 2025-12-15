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
  const [imageUrl, setImageUrl] = useState("");
  const [capacity, setCapacity] = useState<number | "">("");

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
        imageUrl,
        capacity: capacity === "" ? null : capacity,
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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Event</h1>

        <input
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 text-gray-900 placeholder:text-gray-600"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 text-gray-900 placeholder:text-gray-600"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="datetime-local"
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 text-gray-900 placeholder:text-gray-600"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <input
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 text-gray-900 placeholder:text-gray-600"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />

        <div className="space-y-2 mb-2">
          <label className="block text-sm font-semibold text-gray-700">
            Event image (upload or URL)
          </label>
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
                reader.onload = () => setImageUrl(reader.result as string);
                reader.readAsDataURL(file);
              }}
            />
          </label>
          <input
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 placeholder:text-gray-600"
            placeholder="Image URL (optional)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          {imageUrl && (
            <div className="h-32 w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
              <img src={imageUrl} alt="Event" className="h-full w-full object-cover" />
            </div>
          )}
        </div>

        <input
          type="number"
          min={1}
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 text-gray-900 placeholder:text-gray-600"
          placeholder="Capacity (optional)"
          value={capacity}
          onChange={(e) =>
            setCapacity(e.target.value ? Number(e.target.value) : "")
          }
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
