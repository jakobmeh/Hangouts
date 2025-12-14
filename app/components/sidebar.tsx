"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  name?: string | null;
  email?: string | null;
};

type GroupWithEvents = {
  id: number;
  name: string;
  events: {
    id: number;
    title: string;
  }[];
};

type Props = {
  user: User | null;
};

export default function Sidebar({ user }: Props) {
  const router = useRouter();
  const [groups, setGroups] = useState<GroupWithEvents[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col gap-4">
      {/* USER CARD */}
      <div className="bg-white p-4 rounded-xl border flex flex-col items-center">
        <div className="w-20 h-20 bg-gray-300 rounded-full mb-2" />
        <h2 className="font-semibold">
          {user?.name || "Neznan uporabnik"}
        </h2>
        <p className="text-sm text-gray-500">{user?.email}</p>
      </div>

      {/* GROUPS + EVENTS */}
      <div className="bg-white p-4 rounded-xl border">
        <h3 className="font-semibold mb-2">
          Your Groups {!loading && groups.length > 0 && `(${groups.length})`}
        </h3>

        {loading ? (
          <p className="text-sm text-gray-400">Loading…</p>
        ) : groups.length === 0 ? (
          <p className="text-sm text-gray-400">No groups</p>
        ) : (
          <ul className="space-y-3 text-sm">
            {groups.map((g) => (
              <li key={g.id}>
                {/* GROUP */}
                <div
                  onClick={() => router.push(`/groups/${g.id}`)}
                  className="font-medium cursor-pointer hover:text-purple-600"
                >
                  {g.name}
                </div>

                {/* EVENTS */}
                {g.events.length > 0 && (
                  <ul className="ml-3 mt-1 space-y-1 text-gray-600">
                    {g.events.map((e) => (
                      <li
                        key={e.id}
                        onClick={() => router.push(`/events/${e.id}`)}
                        className="cursor-pointer hover:text-purple-600"
                      >
                        • {e.title}
                      </li>
                    ))}
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
