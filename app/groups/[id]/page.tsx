import JoinLeaveButton from "./JoinLeaveButton";
import DeleteGroupButton from "./DeleteGroupButton";
import { getCurrentUser } from "@/app/lib/auth";

async function getGroup(id: string) {
  const res = await fetch(`http://localhost:3000/api/groups/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function GroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const group = await getGroup(id);
  if (!group) return <div>Group not found</div>;

  const user = await getCurrentUser();
  const isOwner = user && user.id === group.owner.id;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">{group.name}</h1>
      <p className="text-gray-400">
        {group.city}, {group.country}
      </p>

      <div className="mt-4">
        {isOwner ? (
          <DeleteGroupButton groupId={group.id} />
        ) : (
          <JoinLeaveButton groupId={group.id} />
        )}
      </div>

      <h2 className="mt-6 font-semibold">Members</h2>
      <ul className="list-disc ml-5">
        {group.members.map((m: any) => (
          <li key={m.user.id}>{m.user.name}</li>
        ))}
      </ul>
    </div>
  );
}
