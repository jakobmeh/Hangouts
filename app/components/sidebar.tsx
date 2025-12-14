"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  name?: string | null;
  email?: string | null;
};

type Event = {
  id: number;
  title: string;
};

type Group = {
  id: number;
  name: string;
};

type Props = {
  user: User | null;
  events: Event[];
};

export default function Sidebar({
  user,
  events = [], // ✅ KLJUČNI FIX
}: Props) {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(true);

  useEffect(() => {
    async function loadMyGroups() {
      const res = await fetch("/api/me/groups");
      if (res.ok) {
        setGroups(await res.json());
      }
      setLoadingGroups(false);
    }

    if (user) {
      loadMyGroups();
    } else {
      setLoadingGroups(false);
    }
  }, [user]);

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col gap-4">
      {/* USER CARD */}
      <div className="bg-white p-4 rounded-xl border flex flex-col items-center">
        <div className="w-20 h-20 bg-gray-300 rounded-full mb-2" />
        <h2 className="font-semibold text-gray-800 text-center">
          {user?.name || "Neznan uporabnik"}
        </h2>
        <p className="text-gray-500 text-sm text-center">{user?.email}</p>
      </div>

      {/* YOUR EVENTS */}
      <div className="bg-white p-4 rounded-xl border">
        <h3 className="text-gray-700 font-semibold mb-2">Your Events</h3>

        <ul className="text-gray-600 text-sm space-y-1 max-h-40 overflow-y-auto">
          {events.length === 0 ? (
            <li className="text-gray-400 italic">No upcoming events</li>
          ) : (
            events.map((e) => (
              <li
                key={e.id}
                onClick={() => router.push(`/events/${e.id}`)}
                className="cursor-pointer hover:text-purple-600"
              >
                {e.title}
              </li>
            ))
          )}
        </ul>
      </div>

      {/* YOUR GROUPS */}
      <div className="bg-white p-4 rounded-xl border">
        <h3 className="text-gray-700 font-semibold mb-2">
          Your Groups{" "}
          {!loadingGroups && groups.length > 0 && `(${groups.length})`}
        </h3>

        <ul className="space-y-1 text-sm">
          {loadingGroups ? (
            <li className="text-gray-400 italic">Loading...</li>
          ) : groups.length === 0 ? (
            <li className="text-gray-400 italic">No groups</li>
          ) : (
            groups.map((g) => (
              <li
                key={g.id}
                onClick={() => router.push(`/groups/${g.id}`)}
                className="cursor-pointer hover:text-purple-600"
              >
                {g.name}
              </li>
            ))
          )}
        </ul>
      </div>
    </aside>
  );
}
