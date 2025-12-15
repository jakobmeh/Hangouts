"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import Image from "next/image";
import { MdLocationOn } from "react-icons/md";
import { FiBell } from "react-icons/fi";
import { useRouter, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";

import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";

function NavigationBarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  /* ================= USER SYNC ================= */

  useEffect(() => {
    async function syncUser() {
      let parsed = null;
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          parsed = JSON.parse(stored);
        } catch {
          parsed = null;
        }
      }

      // If no local user, try server session (/api/me supports NextAuth)
      if (!parsed) {
        try {
          const res = await fetch("/api/me", { cache: "no-store" });
          if (res.ok) {
            parsed = await res.json();
            localStorage.setItem("user", JSON.stringify(parsed));
          }
        } catch {
          /* ignore */
        }
      }

      if (parsed && parsed.isAdmin === undefined) {
        fetch("/api/me")
          .then((res) => (res.ok ? res.json() : null))
          .then((fresh) => {
            if (fresh) {
              localStorage.setItem("user", JSON.stringify(fresh));
              setUser(fresh);
            } else {
              setUser(parsed);
            }
          })
          .catch(() => setUser(parsed));
      } else {
        setUser(parsed);
      }
    }

    syncUser();
    window.addEventListener("user-login", syncUser);
    window.addEventListener("user-logout", syncUser);

    return () => {
      window.removeEventListener("user-login", syncUser);
      window.removeEventListener("user-logout", syncUser);
    };
  }, []);

  /* ================= SYNC SEARCH FIELDS FROM URL ================= */
  useEffect(() => {
    const event = searchParams.get("event") || "";
    const city = searchParams.get("city") || "";
    setEventQuery(event);
    setCityQuery(city);
  }, [searchParams]);

  /* ================= SEARCH ================= */

  const [eventQuery, setEventQuery] = useState("");
  const [cityQuery, setCityQuery] = useState("");

  const [cityResults, setCityResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const cityCache = useRef<Map<string, any[]>>(new Map());
  const abortRef = useRef<AbortController | null>(null);
  const [cityLoading, setCityLoading] = useState(false);

  /* ================= NOTIFICATIONS ================= */
  const [notifications, setNotifications] = useState<
    { id: string; type: "event" | "message"; title: string; meta: string; createdAt: string; link: string }[]
  >([]);
  const [unread, setUnread] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const LAST_SEEN_KEY = "notifications-last-seen";

  async function loadNotifications() {
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) return;
      const data = await res.json();
      const lastSeen = Number(localStorage.getItem(LAST_SEEN_KEY) || "0");
      const items =
        data?.notifications?.map((n: any) => ({
          id: `${n.type}-${n.id}`,
          type: n.type,
          title: n.title,
          meta: n.meta,
          createdAt: n.createdAt,
          link: n.link,
        })) || [];
      setNotifications(items);
      const fresh = items.filter((n) => new Date(n.createdAt).getTime() > lastSeen).length;
      setUnread(fresh);
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnread(0);
      return;
    }
    loadNotifications();
    const interval = setInterval(loadNotifications, 60_000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    async function fetchCities() {
      const query = cityQuery.trim();
      if (query.length < 2) {
        setCityResults([]);
        setCityLoading(false);
        return;
      }

      // Cache hit
      const cached = cityCache.current.get(query.toLowerCase());
      if (cached) {
        setCityResults(cached);
        setShowDropdown(true);
        setCityLoading(false);
        return;
      }

      // Abort previous request
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setCityLoading(true);
      try {
        const res = await fetch(`/api/search-location?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Search failed");
        const data = await res.json();
        const results = data.results || [];
        cityCache.current.set(query.toLowerCase(), results);
        setCityResults(results);
        setShowDropdown(true);
      } catch (err) {
        if ((err as any)?.name !== "AbortError") {
          setCityResults([]);
        }
      } finally {
        setCityLoading(false);
      }
    }

    const delay = setTimeout(fetchCities, 180);
    return () => clearTimeout(delay);
  }, [cityQuery]);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  function handleSearch() {
    const params = new URLSearchParams();
    if (eventQuery.trim()) params.set("event", eventQuery.trim());
    if (cityQuery.trim()) params.set("city", cityQuery.trim());
    router.push(`/search?${params.toString()}`);
  }

  async function handleLogout() {
    // Legacy cookie logout
    await fetch("/api/logout", { method: "POST" }).catch(() => {});
    // NextAuth logout
    await signOut({ redirect: false }).catch(() => {});
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("user-logout"));
    setUser(null);
    setOpen(false);
    router.push("/");
  }

  function openNotifications() {
    setNotifOpen((prev) => !prev);
    if (!notifOpen) {
      localStorage.setItem(LAST_SEEN_KEY, Date.now().toString());
      setUnread(0);
    }
  }

  /* ================= UI ================= */

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-6" ref={dropdownRef}>
            <Image
              src="/icons/Meetup.png"
              alt="Meetup"
              width={90}
              height={32}
              className="cursor-pointer"
              onClick={() => router.push("/")}
            />

            {/* SEARCH */}
            <div className="hidden md:flex items-center bg-gray-100 rounded-full px-3 py-1.5 gap-3 w-[520px] relative">
              <input
                type="text"
                placeholder="Search for events or groups"
                value={eventQuery}
                onChange={(e) => setEventQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none px-2 text-sm text-gray-900 placeholder-gray-500"
              />

              <div className="w-px h-5 bg-gray-300" />

              <div className="relative w-44">
                <input
                  type="text"
                  placeholder="Location"
                  value={cityQuery}
                  onChange={(e) => setCityQuery(e.target.value)}
                  onFocus={() => cityQuery.length >= 2 && setShowDropdown(true)}
                  className="w-full bg-transparent outline-none px-2 text-sm text-gray-900 placeholder-gray-500"
                />

                {showDropdown && (
                  <div className="absolute top-full mt-2 left-0 w-full bg-white border border-gray-300 rounded-2xl shadow-2xl z-[60] overflow-hidden">
                    <div className="max-h-64 overflow-y-auto">
                      {cityLoading && (
                        <div className="px-4 py-3 text-sm text-gray-500">
                          Searching...
                        </div>
                      )}
                      {!cityLoading &&
                        cityResults.map((loc, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setCityQuery(`${loc.city}, ${loc.country}`);
                              setShowDropdown(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-900 hover:bg-blue-50 transition"
                          >
                            <MdLocationOn className="text-blue-600 text-lg" />
                            <span className="font-medium">
                              {loc.city}
                              <span className="text-gray-500 font-normal">
                                , {loc.country}
                              </span>
                            </span>
                          </button>
                        ))}
                      {!cityLoading && cityResults.length === 0 && (
                        <div className="px-4 py-3 text-sm text-gray-500">
                          No locations found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-2 text-sm font-medium"
              >
                Search
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative flex items-center gap-4">
            {!user && (
              <>
                <button
                  onClick={() => setShowLogin(true)}
                  className="text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  Log in
                </button>
                <button
                  onClick={() => setShowRegister(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700"
                >
                  Sign up
                </button>
              </>
            )}

            {user && (
              <>
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={openNotifications}
                    className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-700 hover:border-blue-200 hover:text-blue-700"
                    aria-label="Notifications"
                  >
                    <FiBell className="text-lg" />
                    {unread > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[18px] rounded-full bg-red-500 px-1.5 text-[11px] font-semibold text-white">
                        {unread > 9 ? "9+" : unread}
                      </span>
                    )}
                  </button>
                  {notifOpen && (
                    <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-gray-200 bg-white shadow-2xl z-[70] overflow-hidden">
                      <div className="border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Notifications</p>
                          <p className="text-xs text-gray-500">
                            {notifications.length === 0
                              ? "No notifications yet"
                              : `${notifications.length} recent updates`}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            localStorage.setItem(LAST_SEEN_KEY, Date.now().toString());
                            setUnread(0);
                            loadNotifications();
                          }}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Refresh
                        </button>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-8 text-sm text-gray-500 text-center">
                            You're all caught up.
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <button
                              key={n.id}
                              onClick={() => {
                                router.push(n.link);
                                setNotifOpen(false);
                              }}
                              className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-blue-50 transition"
                            >
                              <span
                                className={`mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                                  n.type === "event"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-green-100 text-green-700"
                                }`}
                              >
                                {n.type === "event" ? "EV" : "CH"}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                  {n.title}
                                </p>
                                <p className="text-xs text-gray-600 truncate">{n.meta}</p>
                                <p className="text-[11px] text-gray-400">
                                  {new Date(n.createdAt).toLocaleString()}
                                </p>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {user.isAdmin && (
                  <button
                    onClick={() => router.push("/admin")}
                    className="hidden sm:inline-flex items-center rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black"
                  >
                    Admin Panel
                  </button>
                )}
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setOpen(!open)}
                >
                  {/* PROFILE IMAGE */}
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt="Profile"
                        fill
                        className="object-cover"
                        sizes="32px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-gray-700">
                        {user.name?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                  </div>

                  <Image
                    src="/icons/arrow-down-sign-to-navigate.png"
                    alt=""
                    width={10}
                    height={10}
                    className={`transition-transform ${open ? "rotate-180" : ""}`}
                  />
                </div>

                {/* DROPDOWN */}
                {open && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-2xl shadow-2xl z-[60] py-2">
                    <button
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setOpen(false);
                        router.push("/profile");
                      }}
                      className="w-full text-left px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
                    >
                      Profile
                    </button>

                    <div className="my-1 border-t" />

                    <button
                      onMouseDown={async (e) => {
                        e.stopPropagation();
                        await handleLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
    </>
  );
}

export default function NavigationBar() {
  return (
    <Suspense fallback={<div className="h-16 bg-white border-b border-gray-200" />}>
      <NavigationBarContent />
    </Suspense>
  );
}
