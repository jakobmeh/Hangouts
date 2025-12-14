"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteGroupButton({ groupId }: { groupId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this group?")) return;

    setLoading(true);

    const res = await fetch(`/api/groups/${groupId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Failed to delete group");
      setLoading(false);
      return;
    }

    // po uspešnem delete
    router.push("/groups");
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="bg-red-600 text-white px-4 py-2 rounded-lg"
    >
      {loading ? "Deleting..." : "Delete group"}
    </button>
  );
}
