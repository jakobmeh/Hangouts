"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EventJoinButton({
  eventId,
  initialJoined,
}: {
  eventId: number;
  initialJoined: boolean;
}) {
  const [joined, setJoined] = useState(initialJoined);
  const router = useRouter();

  async function toggle() {
    const url = joined
      ? `/api/events/${eventId}/leave`
      : `/api/events/${eventId}/join`;

    const res = await fetch(url, { method: "POST" });
    if (!res.ok) {
      alert("Action failed");
      return;
    }

    setJoined(!joined);
    router.refresh(); // osveži server komponento
  }

  return (
    <button
      onClick={toggle}
      className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
        joined
          ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
    >
      {joined ? "Leave event" : "Join event"}
    </button>
  );
}
