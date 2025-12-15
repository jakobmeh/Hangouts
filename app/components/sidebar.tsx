"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type User = {
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
    <aside className="w-64 flex-shrink-0 flex flex-col gap-4 self-start">
      {/* USER CARD */}
      <div
        className="bg-white p-4 rounded-xl border flex flex-col items-center cursor-pointer hover:shadow-md transition"
        onClick={() => router.push("/profile")}
      >
        {/* PROFILE IMAGE */}
        <div className="relative w-20 h-20 mb-2">
          {user?.image ? (
            <Image
              src={user.image}
              alt="Profile picture"
              fill
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 text-2xl font-semibold">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
          )}
        </div>

        <h2 className="font-semibold text-gray-900">
          {user?.name || "Neznan uporabnik"}
        </h2>

        <p className="text-sm text-gray-600">{user?.email}</p>
      </div>

      {/* GROUPS + EVENTS */}
      <div className="bg-white p-4 rounded-xl border">
        <h3 className="font-semibold text-gray-900 mb-2">
          Your Groups {!loading && groups.length > 0 && `(${groups.length})`}
        </h3>

        {loading ? (
          <p className="text-sm text-gray-700">Loading...</p>
        ) : groups.length === 0 ? (
          <p className="text-sm text-gray-700">No groups</p>
        ) : (
          <ul className="space-y-3 text-sm text-gray-900">
            {groups.map((g) => (
              <li key={g.id}>
                {/* GROUP */}
                <div
                  onClick={() => router.push(`/groups/${g.id}`)}
                  className="font-semibold cursor-pointer hover:text-blue-600 transition"
                >
                  {g.name}
                </div>

                {/* EVENTS */}
                {g.events.length > 0 && (
                  <ul className="ml-3 mt-1 space-y-1 text-gray-700">
                    {g.events.map((e) => (
                      <li
                        key={e.id}
                        onClick={() => router.push(`/events/${e.id}`)}
                        className="cursor-pointer hover:text-blue-600 transition"
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
