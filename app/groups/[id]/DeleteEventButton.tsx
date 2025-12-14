"use client";

import { useRouter } from "next/navigation";

export default function DeleteEventButton({ eventId }: { eventId: number }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Delete this event?")) return;

    const res = await fetch(`/api/events/${eventId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.refresh();
    } else {
      alert("Failed to delete event");
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="text-sm text-red-600 hover:underline"
    >
      Delete event
    </button>
  );
}
