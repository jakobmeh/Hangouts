"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Group = {
  id: number;
  name: string;
  description?: string;
  city: string;
  country?: string;
  owner: {
    name: string;
    email: string;
  };
  _count: {
    members: number;
  };
};

export default function GroupPage() {
  const params = useParams();          // ✅ PRAVILNO
  const id = params.id as string;      // ✅ string

  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGroup() {
      try {
        const res = await fetch(`/api/groups/${id}`);
        const data = await res.json();
        setGroup(data.group);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchGroup();
  }, [id]); // ✅ odvisnost je id, ne params.id

  if (loading) return <div className="p-6">Loading...</div>;
  if (!group) return <div className="p-6">Group not found</div>;

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{group.name}</h1>

      <p className="text-gray-600 mb-4">
        {group.city}, {group.country}
      </p>

      <p className="mb-4">{group.description}</p>

      <p className="text-sm text-gray-500">
        👤 Owner: {group.owner.name}
      </p>

      <p className="text-sm text-gray-500 mt-1">
        👥 Members: {group._count.members}
      </p>
    </div>
  );
}
