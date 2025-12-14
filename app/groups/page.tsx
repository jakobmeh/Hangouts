import Link from "next/link";
import { headers } from "next/headers";

async function getGroups() {
  const headersList = await headers();
  const host = headersList.get("host");

  const res = await fetch(`http://${host}/api/groups`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch groups");
  }

  return res.json();
}

export default async function GroupsPage() {
  const groups = await getGroups();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Groups</h1>

        <Link
          href="/groups/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Create group
        </Link>
      </div>

      <div className="grid gap-4">
        {groups.map((group: any) => (
          <Link
            key={group.id}
            href={`/groups/${group.id}`}
            className="border rounded-xl p-4 hover:shadow transition"
          >
            <h2 className="text-lg font-semibold">{group.name}</h2>

            <p className="text-sm text-gray-600">
              {group.city}
              {group.country ? `, ${group.country}` : ""}
            </p>

            <p className="text-xs text-gray-500 mt-2">
              {group._count.members} members · {group._count.events} events
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
