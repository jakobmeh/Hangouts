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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavigationBar />

      <div className="flex flex-1">
        <aside className="w-64 bg-white border-r shrink-0">
          <Sidebar user={user} />
        </aside>

        <main className="flex-1 px-6 lg:px-8 py-10">
          <div className="max-w-5xl">
            <Link
              href="/groups"
              className="text-sm text-gray-500 hover:text-blue-600 inline-flex items-center mb-6"
            >
              ← Back to groups
            </Link>

            <section className="bg-white rounded-3xl shadow-md border p-8 lg:p-10">
              {/* HEADER */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {group.name}
                  </h1>
                  <p className="text-gray-600">
                    📍 {group.city}
                    {group.country ? `, ${group.country}` : ""}
                  </p>
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
                <div className="mt-6">
                  <CreateEventButton groupId={group.id} />
                </div>
              )}

              <div className="my-10 border-t" />

              {/* MEMBERS */}
              <div>
                <h2 className="text-xl font-semibold mb-5">
                  Members ({group.members.length})
                </h2>

                <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.members.map((m: any) => (
                    <li
                      key={m.user.id}
                      className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                        {m.user.name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <span className="font-medium">{m.user.name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="my-10 border-t" />

              {/* EVENTS */}
              <div>
                <h2 className="text-xl font-semibold mb-5">
                  Events ({group._count.events})
                </h2>

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
                        className="p-6 bg-gray-50 border rounded-2xl"
                      >
                        <div className="flex justify-between items-start gap-6">
                          {/* LEFT */}
                          <div>
                            <h3 className="text-lg font-semibold">
                              {event.title}
                            </h3>

                            <p className="text-sm text-gray-600 mt-1">
                              📅{" "}
                              {new Date(event.date).toLocaleString()}
                            </p>

                            <p className="text-sm text-gray-600">
                              📍 {event.city}
                            </p>

                            <p className="text-sm text-gray-600 mt-1">
                              👥 Attending {event._count.attendees}
                              {event.capacity !== null && (
                                <span> / {event.capacity}</span>
                              )}
                            </p>

                            {/* AVATARS */}
                            {event.attendees.length > 0 && (
                              <div className="flex gap-2 mt-3 flex-wrap">
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
              </div>

              {/* GROUP CHAT */}
              {isMember && (
                <>
                  <div className="my-10 border-t" />
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
