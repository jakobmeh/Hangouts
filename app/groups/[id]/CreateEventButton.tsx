"use client";

import { useRouter } from "next/navigation";

export default function CreateEventButton({ groupId }: { groupId: number }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/groups/${groupId}/events/new`)}
      className="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
    >
      + Create Event
    </button>
  );
}
