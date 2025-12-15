"use client";

import { useEffect, useMemo, useState } from "react";

type AdminUser = {
  id: number;
  email: string;
  name?: string | null;
  image?: string | null;
  isAdmin: boolean;
  createdAt: string;
};

type AdminGroup = {
  id: number;
  name: string;
  city: string;
  country?: string | null;
  createdAt: string;
  owner: { id: number; name?: string | null; email: string };
  _count: { members: number; events: number };
};

type AdminEvent = {
  id: number;
  title: string;
  date: string;
  createdAt: string;
  group?: { id: number; name: string } | null;
  user?: { id: number; name?: string | null; email: string } | null;
};

type AdminOverview = {
  users: AdminUser[];
  groups: AdminGroup[];
  events: AdminEvent[];
};

type TabKey = "users" | "groups";

export default function AdminPage() {
  const [data, setData] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userEdits, setUserEdits] = useState<
    Record<number, { name: string; image: string; isAdmin: boolean }>
  >({});
  const [activeTab, setActiveTab] = useState<TabKey>("groups");
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data && data.groups.length > 0 && selectedGroupId === null) {
      setSelectedGroupId(data.groups[0].id);
    }
  }, [data, selectedGroupId]);

  const selectedGroupEvents = useMemo(() => {
    if (!data || selectedGroupId === null) return [];
    return data.events.filter((e) => e.group?.id === selectedGroupId);
  }, [data, selectedGroupId]);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/overview", { cache: "no-store" });
      if (!res.ok) {
        const msg =
          res.status === 403
            ? "You must be an admin to view this page."
            : "Failed to load admin data.";
        setError(msg);
        setLoading(false);
        return;
      }

      const payload: AdminOverview = await res.json();
      setData(payload);

      const edits: Record<number, { name: string; image: string; isAdmin: boolean }> = {};
      payload.users.forEach((u) => {
        edits[u.id] = {
          name: u.name || "",
          image: u.image || "",
          isAdmin: u.isAdmin,
        };
      });
      setUserEdits(edits);
      setError("");
    } catch (err) {
      setError("Unexpected error loading admin data.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveUser(id: number) {
    const edit = userEdits[id];
    await fetch(`/api/admin/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(edit),
    });
    fetchData();
  }

  async function handleDeleteUser(id: number) {
    if (!window.confirm("Delete this user? All related data will be removed.")) return;
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    fetchData();
  }

  async function handleDeleteGroup(id: number) {
    if (!window.confirm("Delete this group and its events?")) return;
    await fetch(`/api/admin/groups/${id}`, { method: "DELETE" });
    fetchData();
    if (selectedGroupId === id) {
      setSelectedGroupId(null);
    }
  }

  async function handleDeleteEvent(id: number) {
    if (!window.confirm("Delete this event?")) return;
    await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
    fetchData();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex items-baseline justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-50">Admin Panel</h1>
            <p className="text-slate-300">Manage users, groups, and events.</p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="rounded-lg border border-blue-400/40 bg-blue-500/20 px-4 py-2 text-sm font-semibold text-blue-100 shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-500/30"
          >
            Back
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/50 bg-red-900/40 px-4 py-3 text-red-100">
            {error}
          </div>
        )}

        {loading && (
          <div className="grid gap-6 lg:grid-cols-[240px,1fr]">
            <aside className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-black/30">
              <p className="mb-3 h-4 w-16 animate-pulse rounded bg-slate-800" />
              <div className="space-y-2">
                {[1, 2].map((key) => (
                  <div
                    key={key}
                    className="h-10 w-full animate-pulse rounded-lg bg-slate-800"
                  />
                ))}
              </div>
            </aside>

            <main className="space-y-6">
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-6 w-24 animate-pulse rounded bg-slate-800" />
                  <div className="h-4 w-16 animate-pulse rounded bg-slate-800" />
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map((key) => (
                    <div
                      key={key}
                      className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-md shadow-black/30"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-2">
                          <div className="h-4 w-40 animate-pulse rounded bg-slate-800" />
                          <div className="h-4 w-28 animate-pulse rounded bg-slate-800" />
                          <div className="h-3 w-24 animate-pulse rounded bg-slate-800" />
                        </div>
                        <div className="flex gap-2">
                          <div className="h-8 w-16 animate-pulse rounded-lg bg-slate-800" />
                          <div className="h-8 w-20 animate-pulse rounded-lg bg-slate-800" />
                          <div className="h-8 w-16 animate-pulse rounded-lg bg-slate-800" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
                <div className="space-y-3">
                  {[1, 2, 3].map((key) => (
                    <div
                      key={key}
                      className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-md shadow-black/30"
                    >
                      <div className="space-y-2">
                        <div className="h-4 w-36 animate-pulse rounded bg-slate-800" />
                        <div className="h-4 w-28 animate-pulse rounded bg-slate-800" />
                        <div className="h-3 w-32 animate-pulse rounded bg-slate-800" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-md shadow-black/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-24 animate-pulse rounded bg-slate-800" />
                    <div className="h-4 w-12 animate-pulse rounded bg-slate-800" />
                  </div>
                  <div className="space-y-2">
                    {[1, 2].map((key) => (
                      <div
                        key={key}
                        className="rounded-lg border border-slate-800 bg-slate-950 p-3"
                      >
                        <div className="space-y-2">
                          <div className="h-4 w-32 animate-pulse rounded bg-slate-800" />
                          <div className="h-3 w-24 animate-pulse rounded bg-slate-800" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </main>
          </div>
        )}

        {!loading && data && (
          <div className="grid gap-6 lg:grid-cols-[240px,1fr]">
            <aside className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-black/30">
              <p className="mb-3 text-xs font-semibold uppercase text-slate-400">Sections</p>
              <div className="space-y-2">
                {([
                  { key: "users", label: `Users (${data.users.length})` },
                  { key: "groups", label: `Groups (${data.groups.length})` },
                ] as { key: TabKey; label: string }[]).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold ${
                      activeTab === tab.key
                        ? "bg-blue-600/20 text-blue-100 ring-1 ring-inset ring-blue-500/40"
                        : "text-slate-200 hover:bg-slate-800"
                    }`}
                  >
                    <span>{tab.label}</span>
                    {activeTab === tab.key && <span className="text-xs text-blue-200">*</span>}
                  </button>
                ))}
              </div>
            </aside>

            <main className="space-y-8">
              {activeTab === "users" && (
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-50">Users</h2>
                    <span className="text-sm text-slate-400">{data.users.length} total</span>
                  </div>
                  <div className="space-y-3">
                    {data.users.map((u) => (
                      <div
                        key={u.id}
                        className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-md shadow-black/30"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-50">
                              {u.name || "Unnamed"}{" "}
                              <span className="text-xs text-slate-400">#{u.id}</span>
                            </p>
                            <p className="text-sm text-slate-300 break-words">{u.email}</p>
                            <p className="text-xs text-slate-400">
                              Joined {new Date(u.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                setUserEdits((prev) => ({
                                  ...prev,
                                  [u.id]: { ...prev[u.id], isAdmin: !prev[u.id].isAdmin },
                                }))
                              }
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                userEdits[u.id]?.isAdmin
                                  ? "bg-blue-600/30 text-blue-100"
                                  : "bg-slate-800 text-slate-200"
                              }`}
                            >
                              {userEdits[u.id]?.isAdmin ? "Admin" : "User"}
                            </button>
                            <button
                              onClick={() => handleSaveUser(u.id)}
                              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700"
                            >
                              Save changes
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="rounded-lg border border-red-500/50 px-3 py-2 text-sm font-semibold text-red-200 hover:bg-red-500/10"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        <div className="mt-3 grid gap-3 md:grid-cols-3">
                          <label className="text-sm text-slate-200">
                            <span className="block text-xs uppercase text-slate-400">Name</span>
                            <input
                              value={userEdits[u.id]?.name ?? ""}
                              onChange={(e) =>
                                setUserEdits((prev) => ({
                                  ...prev,
                                  [u.id]: { ...prev[u.id], name: e.target.value },
                                }))
                              }
                              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                            />
                          </label>
                          <label className="text-sm text-slate-200 md:col-span-2">
                            <span className="block text-xs uppercase text-slate-400">Image URL</span>
                            <input
                              value={userEdits[u.id]?.image ?? ""}
                              onChange={(e) =>
                                setUserEdits((prev) => ({
                                  ...prev,
                                  [u.id]: { ...prev[u.id], image: e.target.value },
                                }))
                              }
                              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                            />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {activeTab === "groups" && (
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-50">Groups</h2>
                    <span className="text-sm text-slate-400">{data.groups.length} total</span>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
                    <div className="space-y-3">
                      {data.groups.map((g) => {
                        const isSelected = g.id === selectedGroupId;
                        return (
                          <div
                            key={g.id}
                            onClick={() => setSelectedGroupId(g.id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                setSelectedGroupId(g.id);
                              }
                            }}
                            className={`block w-full rounded-xl border px-4 py-4 text-left shadow-md shadow-black/30 transition ${
                              isSelected
                                ? "border-blue-500/60 bg-blue-900/40"
                                : "border-slate-800 bg-slate-900/70 hover:border-blue-500/40"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-50">
                                  {g.name} <span className="text-xs text-slate-400">#{g.id}</span>
                                </p>
                                <p className="text-sm text-slate-300">
                                  {g.city}
                                  {g.country ? `, ${g.country}` : ""}
                                </p>
                                <p className="text-xs text-slate-400">
                                  Created by {g.owner.name || g.owner.email}
                                </p>
                                <p className="text-xs text-slate-400">
                                  Members {g._count.members} / Events {g._count.events}
                                </p>
                                <p className="text-xs text-slate-500">
                                  Created {new Date(g.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                {isSelected && (
                                  <span className="rounded-full bg-blue-600/30 px-2 py-1 text-xs font-semibold text-blue-100">
                                    Selected
                                  </span>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteGroup(g.id);
                                  }}
                                  className="rounded-lg border border-red-500/50 px-3 py-2 text-sm font-semibold text-red-200 hover:bg-red-500/10"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-md shadow-black/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-50">Events for group</p>
                          <p className="text-xs text-slate-400">
                            {selectedGroupId
                              ? `Group #${selectedGroupId}`
                              : "Select a group to see its events"}
                          </p>
                        </div>
                        <span className="text-xs text-slate-400">
                          {selectedGroupEvents.length} event
                          {selectedGroupEvents.length === 1 ? "" : "s"}
                        </span>
                      </div>
                      <div className="mt-3 space-y-3">
                        {selectedGroupId === null && (
                          <p className="text-sm text-slate-300">Pick a group on the left.</p>
                        )}
                        {selectedGroupId !== null && selectedGroupEvents.length === 0 && (
                          <p className="text-sm text-slate-300">No events for this group yet.</p>
                        )}
                        {selectedGroupEvents.map((e) => (
                          <div
                            key={e.id}
                            className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-3"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-50">
                                  {e.title} <span className="text-xs text-slate-400">#{e.id}</span>
                                </p>
                                <p className="text-sm text-slate-300">
                                  {new Date(e.date).toLocaleString()}
                                </p>
                                <p className="text-xs text-slate-400">
                                  Host: {e.user?.name || e.user?.email || "Unknown"}
                                </p>
                              </div>
                              <button
                                onClick={() => handleDeleteEvent(e.id)}
                                className="rounded-lg border border-red-500/50 px-3 py-2 text-sm font-semibold text-red-200 hover:bg-red-500/10"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </main>
          </div>
        )}
      </div>
    </div>
  );
}
