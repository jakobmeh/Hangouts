import JoinLeaveButton from "./JoinLeaveButton";

async function getGroup(id: string) {
  const res = await fetch(
    `http://localhost:3000/api/groups/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;
  return res.json();
}

export default async function GroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ✅ NEXT.JS 15 FIX – OBVEZNO
  const { id } = await params;

  const group = await getGroup(id);

  if (!group) {
    return <div className="p-6">Group not found</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-2">{group.name}</h1>
      <p className="text-gray-400">
        {group.city}, {group.country}
      </p>

      <div className="mt-4">
        <JoinLeaveButton groupId={group.id} />
      </div>

      <h2 className="mt-6 font-semibold text-lg">Members</h2>
      <ul className="list-disc ml-5 text-gray-300">
        {group.members.map((m: any) => (
          <li key={m.id}>{m.user.name}</li>
        ))}
      </ul>
    </div>
  );
}
