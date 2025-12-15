import Link from "next/link";
import NavigationBar from "@/app/components/NavigationBar";
import Footer from "@/app/components/Footer";
import Sidebar from "@/app/components/sidebar";
import EventJoinButton from "./EventJoinButton";
import JoinLeaveButton from "./JoinLeaveButton";
import DeleteGroupButton from "./DeleteGroupButton";
import DeleteEventButton from "./DeleteEventButton";
import CreateEventButton from "./CreateEventButton";
import GroupChat from "./GroupChat";

import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

async function getGroup(id: number) {
  return prisma.group.findUnique({
    where: { id },
    include: {
      owner: {
        select: { id: true, name: true },
      },
      members: {
        include: {
          user: {
            select: { id: true, name: true, image: true },
          },
        },
      },
      events: {
        orderBy: { date: "asc" },
        select: {
          id: true,
          title: true,
          date: true,
          city: true,
          capacity: true,
          userId: true,
          attendees: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
          _count: {
            select: { attendees: true },
          },
        },
      },
      _count: {
        select: { members: true, events: true },
      },
    },
  });
}

export default async function GroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const groupId = Number(id);

  if (!Number.isFinite(groupId)) {
    return <div className="p-6">Invalid group id</div>;
  }

  const group = await getGroup(groupId);
  if (!group) return <div className="p-6">Group not found</div>;

  const user = await getCurrentUser();
  const isGroupOwner = user && user.id === group.owner.id;

  const isMember =
    user && group.members.some((m: any) => m.user.id === user.id);

  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />

      <div className="flex flex-1 max-w-7xl mx-auto w-full px-6 py-8 gap-8">
        <aside className="w-72 shrink-0">
          <div className="sticky top-24">
            <Sidebar user={user} />
          </div>
        </aside>

        <main className="flex-1">
          <div className="max-w-5xl">
            <Link
              href="/groups"
              className="text-sm text-gray-600 hover:text-blue-600 inline-flex items-center mb-6"
            >
              ƒ+? Back to groups
            </Link>

            <section className="bg-white rounded-3xl border border-gray-200 shadow-xl shadow-blue-100/50 p-8 lg:p-10 space-y-8">
              {/* HEADER */}
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                    Group
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-1">
                      {group.name}
                    </h1>
                    <p className="text-gray-600 text-sm">
                      dY"? {group.city}
                      {group.country ? `, ${group.country}` : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">
                      {group.members.length} members
                    </span>
                    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">
                      {group._count.events} events
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {isGroupOwner ? (
                    <DeleteGroupButton groupId={group.id} />
                  ) : (
                    <JoinLeaveButton groupId={group.id} />
                  )}
                </div>
              </div>

              {isGroupOwner && (
                <div className="pt-2">
                  <CreateEventButton groupId={group.id} />
                </div>
              )}

              <div className="border-t border-gray-200" />

              {/* MEMBERS */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Members ({group.members.length})
                </h2>

                <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.members.map((m: any) => (
                    <li
                      key={m.user.id}
                      className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-gray-200 shadow-sm"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                        {m.user.name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <span className="font-medium text-gray-900">
                        {m.user.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-gray-200" />

              {/* EVENTS */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Events ({group._count.events})
                </h2>

                {group.events.length === 0 ? (
                  <div className="p-5 rounded-2xl border border-dashed border-gray-200 bg-gray-50 text-gray-700">
                    No events yet. {isGroupOwner ? "Create one to get started." : "Check back soon."}
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {group.events.map((event: any) => {
                      const joined =
                        user &&
                        event.attendees.some(
                          (a: any) => a.user.id === user.id
                        );

                      const isEventOwner =
                        user && user.id === event.userId;

                      const isFull =
                        event.capacity !== null &&
                        event._count.attendees >= event.capacity;

                      return (
                        <li
                          key={event.id}
                          className="p-6 bg-slate-50 border border-gray-200 rounded-2xl shadow-sm"
                        >
                          <div className="flex justify-between items-start gap-6">
                            {/* LEFT */}
                            <div className="space-y-1.5">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {event.title}
                              </h3>

                              <p className="text-sm text-gray-600">
                                dY". {new Date(event.date).toLocaleString()}
                              </p>

                              <p className="text-sm text-gray-600">
                                dY"? {event.city}
                              </p>

                              <p className="text-sm text-gray-700">
                                dY` Attending {event._count.attendees}
                                {event.capacity !== null && (
                                  <span> / {event.capacity}</span>
                                )}
                              </p>

                              {/* AVATARS */}
                              {event.attendees.length > 0 && (
                                <div className="flex gap-2 mt-2 flex-wrap">
                                  {event.attendees.map((a: any) => (
                                    <div
                                      key={a.user.id}
                                      title={a.user.name}
                                      className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold"
                                    >
                                      {a.user.image ? (
                                        <img
                                          src={a.user.image}
                                          alt={a.user.name}
                                          className="w-full h-full rounded-full object-cover"
                                        />
                                      ) : (
                                        a.user.name?.[0]?.toUpperCase() ||
                                        "U"
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* RIGHT ACTIONS */}
                            <div className="flex flex-col items-end gap-2">
                              {isMember && user && !isFull && (
                                <EventJoinButton
                                  eventId={event.id}
                                  initialJoined={!!joined}
                                />
                              )}

                              {isFull && (
                                <span className="text-sm text-red-500 font-medium">
                                  Event is full
                                </span>
                              )}

                              {isEventOwner && (
                                <DeleteEventButton eventId={event.id} />
                              )}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* GROUP CHAT */}
              {isMember && (
                <>
                  <div className="border-t border-gray-200" />
                  <GroupChat groupId={group.id} />
                </>
              )}
            </section>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
