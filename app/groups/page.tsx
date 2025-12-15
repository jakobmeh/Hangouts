import Link from "next/link";

import NavigationBar from "@/app/components/NavigationBar";
import Footer from "@/app/components/Footer";
import Sidebar from "@/app/components/sidebar";
import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export const dynamic = "force-dynamic";

/* ================= FETCH ================= */

async function getGroups() {
  return prisma.group.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      owner: { select: { id: true, name: true } },
      _count: {
        select: { members: true, events: true },
      },
    },
  });
}

/* ================= PAGE ================= */

export default async function GroupsPage() {
  const groups = await getGroups();
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-[#f6f7f8] flex flex-col">
      {/* NAV */}
      <NavigationBar />

      {/* CONTENT */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-6 py-8 gap-8">
        {/* SIDEBAR */}
        <aside className="w-72 shrink-0">
          <div className="sticky top-24">
            <Sidebar user={user} />
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1">
          {/* TOP BAR */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link
                href="/"
                className="text-sm text-gray-500 hover:text-blue-600"
              >
                ← Back
              </Link>

              <h1 className="text-3xl font-bold text-gray-900 mt-1">
                Discover Groups
              </h1>

              <p className="text-gray-500 mt-1">
                Find communities that match your interests
              </p>
            </div>

            <Link
              href="/groups/new"
              className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-blue-700 transition"
            >
              + Create group
            </Link>
          </div>

          {/* GROUP GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group: any) => (
              <Link
                key={group.id}
                href={`/groups/${group.id}`}
                className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg hover:border-gray-300 transition group"
              >
                <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition">
                  {group.name}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  📍 {group.city}
                  {group.country ? `, ${group.country}` : ""}
                </p>

                <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    👥 {group._count.members}
                  </span>
                  <span className="flex items-center gap-1">
                    📅 {group._count.events}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* EMPTY STATE */}
          {groups.length === 0 && (
            <div className="text-center text-gray-500 mt-16">
              <p className="text-lg font-medium">No groups yet</p>
              <p className="text-sm mt-1">
                Be the first one to create a group 👇
              </p>

              <Link
                href="/groups/new"
                className="inline-block mt-4 bg-blue-600 text-white px-6 py-2.5 rounded-full hover:bg-blue-700 transition"
              >
                Create group
              </Link>
            </div>
          )}
        </main>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
