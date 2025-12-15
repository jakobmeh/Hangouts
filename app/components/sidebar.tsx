"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type User = {
  id?: number;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

type GroupWithEvents = {
  id: number;
  name: string;
  events: {
    id: number;
    title: string;
    date: string;
    attendees: { userId: number }[];
  }[];
};

type Props = {
  user: User | null;
};

export default function Sidebar({ user }: Props) {
  const router = useRouter();
  const [groups, setGroups] = useState<GroupWithEvents[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState<number>(Date.now());
  const [removing, setRemoving] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/me/groups");
      if (res.ok) {
        setGroups(await res.json());
      }
      setLoading(false);
    }

    if (user) load();
    else setLoading(false);
  }, [user]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  const filteredGroups = useMemo(() => {
    if (!user?.id) return [];
    return groups.map((g) => {
      const attendingEvents = g.events.filter((e) =>
        e.attendees.some((a) => Number(a.userId) === Number(user.id))
      );
      return { ...g, events: attendingEvents };
    });
  }, [groups, user?.id]);

  function countdownText(dateStr: string) {
    const target = new Date(dateStr).getTime();
    const diff = target - now;
    if (!Number.isFinite(target)) return "";
    if (diff <= 0) return "Started";
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${mins % 60}m`;
    return `${mins}m`;
  }

  async function leaveEvent(eventId: number, groupId: number) {
    try {
      setRemoving(eventId);
      await fetch(`/api/events/${eventId}/leave`, { method: "POST" });
      setGroups((prev) =>
        prev
          .map((g) =>
            g.id === groupId
              ? { ...g, events: g.events.filter((e) => e.id !== eventId) }
              : g
          )
          .filter((g) => g.events.length > 0 || g.id !== groupId ? true : false)
      );
    } finally {
      setRemoving(null);
    }
  }

 return (
  <aside className="w-80 flex-shrink-0 flex flex-col gap-8 self-start">
  {/* USER CARD */}
 <div
  onClick={() => router.push("/profile")}
  className="
    relative overflow-hidden
    rounded-3xl p-6
    bg-gradient-to-br from-white via-gray-50 to-gray-100
    text-gray-900
    border border-gray-200
    shadow-sm hover:shadow-md
    cursor-pointer
    hover:scale-[1.01]
    transition-all
    before:absolute before:inset-0
    before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent
    before:opacity-0 hover:before:opacity-100
  "
>
    <div className="flex flex-col items-center text-center">
      <div className="relative w-24 h-24 mb-4">
        {user?.image ? (
          <Image
            src={user.image}
            alt="Profile picture"
            fill
            className="rounded-full object-cover border-4 border-white/30"
          />
        ) : (
          <div className="
            w-24 h-24 rounded-full
            bg-white/20 backdrop-blur
            flex items-center justify-center
            text-3xl font-bold
          ">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
        )}
      </div>

      <h2 className="font-semibold text-lg">
        {user?.name || "Unknown user"}
      </h2>
      <p className="text-sm opacity-80 truncate max-w-[220px]">
        {user?.email}
      </p>
    </div>
  </div>

  {/* GROUPS */}
  <div className="bg-white rounded-3xl p-6 shadow-md">
    <div className="flex items-center justify-between mb-5">
      <h3 className="text-base font-semibold text-gray-900">
        Your Groups
      </h3>
      {!loading && filteredGroups.length > 0 && (
        <span className="
          text-xs font-medium
          px-2 py-1 rounded-full
          bg-blue-50 text-blue-600
        ">
          {filteredGroups.length}
        </span>
      )}
    </div>

    {loading ? (
      <p className="text-sm text-gray-500">Loading…</p>
    ) : filteredGroups.length === 0 ? (
      <p className="text-sm text-gray-500">No active groups</p>
    ) : (
      <ul className="space-y-6 text-sm">
        {filteredGroups.map((g) => (
          <li key={g.id}>
            {/* GROUP HEADER */}
            <button
              onClick={() => router.push(`/groups/${g.id}`)}
              className="
                w-full text-left
                font-semibold text-gray-900
                hover:text-blue-600 transition
              "
            >
              {g.name}
            </button>

            {/* EVENTS */}
            {g.events.length > 0 && (
              <ul className="mt-3 space-y-2">
                {g.events.map((e) => {
                  const status = countdownText(e.date);
                  const started = status === "Started";

                  return (
                    <li
                      key={e.id}
                      className="
                        flex items-center gap-3
                        rounded-xl px-3 py-2
                        bg-gray-50 hover:bg-gray-100
                        transition
                      "
                      title={new Date(e.date).toLocaleString()}
                    >
                      {/* DOT */}
                      <span
                        className={`w-2 h-2 rounded-full ${
                          started ? "bg-red-500" : "bg-blue-500"
                        }`}
                      />

                      {/* TITLE */}
                      <button
                        onClick={() => router.push(`/groups/${g.id}`)}
                        className="
                          flex-1 text-left truncate
                          text-gray-700
                          hover:text-blue-600 transition
                        "
                      >
                        {e.title}
                      </button>

                      {/* BADGE */}
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-full
                          ${
                            started
                              ? "bg-red-100 text-red-600"
                              : "bg-blue-100 text-blue-600"
                          }
                        `}
                      >
                        {status}
                      </span>

                      {/* REMOVE */}
                      {started && (
                        <button
                          disabled={removing === e.id}
                          onClick={() => leaveEvent(e.id, g.id)}
                          className="
                            text-gray-400 hover:text-red-600
                            transition disabled:opacity-40
                          "
                        >
                          ✕
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
        ))}
      </ul>
    )}
  </div>
</aside>

);

}
