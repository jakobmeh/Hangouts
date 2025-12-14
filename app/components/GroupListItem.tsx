"use client";

import { useRouter } from "next/navigation";

export default function GroupListItem({
  id,
  name,
}: {
  id: number;
  name: string;
}) {
  const router = useRouter();

  return (
    <li
      onClick={() => router.push(`/groups/${id}`)}
      className="cursor-pointer text-gray-700 hover:text-black hover:underline truncate"
    >
      {name}
    </li>
  );
}
