"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function JoinLeaveButton({ groupId }: { groupId: number }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isMember, setIsMember] = useState<boolean | null>(null);

useEffect(() => {
  async function checkMembership() {
    const userRaw = localStorage.getItem("user");
    if (!userRaw) {
      setIsMember(false);
      return;
    }

    const user = JSON.parse(userRaw);

    const res = await fetch(`/api/groups/${groupId}`, {
      cache: "no-store",
    });
    const group = await res.json();

    const member = group.members.some(
      (m: any) => m.user.id === user.id
    );

    setIsMember(member);
  }

  checkMembership();
}, [groupId]);


 async function handleClick() {
  const nextState = !isMember;

  // 🔥 OPTIMISTIC UPDATE (TAKOJ)
  setIsMember(nextState);

  startTransition(async () => {
    await fetch(
      `/api/groups/${groupId}/${nextState ? "join" : "leave"}`,
      { method: "POST" }
    );

    // sync server data
    router.refresh();
  });
}

  if (isMember === null) return null;

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`px-4 py-2 rounded text-white ${
        isMember ? "bg-red-600" : "bg-blue-600"
      }`}
    >
      {isPending
        ? "Processing..."
        : isMember
        ? "Leave group"
        : "Join group"}
    </button>
  );
}
