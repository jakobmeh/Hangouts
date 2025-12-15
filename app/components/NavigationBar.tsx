"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import Image from "next/image";
import { MdLocationOn } from "react-icons/md";
import { useRouter, useSearchParams } from "next/navigation";

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
    function syncUser() {
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
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
    await fetch("/api/logout", { method: "POST" });
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("user-logout"));
    setUser(null);
    setOpen(false);
    router.push("/");
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
