"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function GroupEventsPage() {
  const { id } = useParams();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch(`/api/groups/${id}/events`);
    if (res.ok) {
      setEvents(await res.json());
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function attend(eventId: number) {
    await fetch(`/api/events/${eventId}/attend`, { method: "POST" });
    load();
  }

  async function unattend(eventId: number) {
    await fetch(`/api/events/${eventId}/attend`, { method: "DELETE" });
    load();
  }

  if (loading) return <p className="p-6">Loading…</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Upcoming events</h1>

      {events.length === 0 && (
        <p className="text-gray-500">No upcoming events</p>
      )}

      {events.map((event) => {
        const me = JSON.parse(localStorage.getItem("user") || "{}");
        const isAttending = event.attendees.some(
          (a: any) => a.user.id === me.id
        );

        return (
          <div
            key={event.id}
            className="bg-white border rounded-xl p-5 mb-4"
          >
            <h2 className="text-lg font-semibold">{event.title}</h2>
            <p className="text-sm text-gray-500">
              {new Date(event.date).toLocaleString()}
            </p>

            {/* ATTENDEES */}
            <div className="flex items-center gap-2 mt-4">
              {event.attendees.map((a: any) => (
                <div
                  key={a.user.id}
                  className="w-8 h-8 rounded-full overflow-hidden bg-gray-200"
                  title={a.user.name}
                >
                  {a.user.image ? (
                    <Image
                      src={a.user.image}
                      alt=""
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold">
                      {a.user.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* ACTION */}
            <div className="mt-4">
              {isAttending ? (
                <button
                  onClick={() => unattend(event.id)}
                  className="text-red-600 font-medium"
                >
                  Unattend
                </button>
              ) : (
                <button
                  onClick={() => attend(event.id)}
                  className="text-blue-600 font-medium"
                >
                  Attend
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
