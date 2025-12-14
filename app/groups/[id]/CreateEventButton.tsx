"use client";

import { useRouter } from "next/navigation";

export default function CreateEventButton({ groupId }: { groupId: number }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/groups/${groupId}/events/new`)}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg"
    >
      Create event
    </button>
  );
}
