"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { MdLocationOn } from "react-icons/md";
import { useRouter } from "next/navigation";

import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";

export default function NavigationBar() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // 🔥 SYNC USER (LOGIN / LOGOUT / REFRESH)
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

  // SEARCH
  const [eventQuery, setEventQuery] = useState("");
  const [cityQuery, setCityQuery] = useState("");

  // AUTOCOMPLETE
  const [cityResults, setCityResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchCities() {
      if (cityQuery.length < 2) {
        setCityResults([]);
        return;
      }

      const res = await fetch(`/api/search-location?q=${cityQuery}`);
      const data = await res.json();
      setCityResults(data.results || []);
      setShowDropdown(true);
    }

    const delay = setTimeout(fetchCities, 300);
    return () => clearTimeout(delay);
  }, [cityQuery]);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
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

  return (
    <>
      
      <header className="w-full bg-gray-100 px-6 py-4 flex items-center justify-between border-b border-gray-200">

       
        <div className="flex items-center gap-6" ref={dropdownRef}>
          <Image src="/icons/Meetup.png" alt="logo" width={85} height={85} />

         
          <div className="flex items-center bg-gray-200/60 rounded-full px-4 py-2 shadow-inner gap-3 w-[550px] relative">

          
            <input
              type="text"
              placeholder="Search for anything..."
              value={eventQuery}
              onChange={(e) => setEventQuery(e.target.value)}
              className="flex-1 bg-white/70 outline-none px-3 text-gray-900 placeholder-gray-500 rounded-md h-9"
            />

           
            <div className="w-[1px] h-6 bg-gray-300"></div>

           
            <div className="relative w-48">
              <input
                type="text"
                placeholder="Location"
                value={cityQuery}
                onChange={(e) => setCityQuery(e.target.value)}
                onFocus={() => cityQuery.length >= 2 && setShowDropdown(true)}
                className="w-full bg-white/70 outline-none px-3 text-gray-900 placeholder-gray-500 rounded-md h-9"
              />

             
              {cityQuery && (
                <button
                  onClick={() => {
                    setCityQuery("");
                    setShowDropdown(false);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                >
                  ✕
                </button>
              )}

              
              {showDropdown && cityResults.length > 0 && (
                <div className="absolute top-11 left-0 w-full bg-white shadow-lg rounded-xl z-20 border border-gray-200 p-2">

                  <p className="text-xs text-gray-700 px-2 mb-2 font-semibold">
                    CITY
                  </p>

                  {cityResults.map((loc, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setCityQuery(`${loc.city}, ${loc.country}`);
                        setShowDropdown(false);
                      }}
                      className="w-full flex items-center gap-2 px-2 py-2 hover:bg-gray-100 rounded"
                    >
                      <MdLocationOn className="text-gray-900 text-lg" />
                      <span className="text-gray-900">{loc.city}, {loc.country}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            
            <button
              onClick={handleSearch}
              className="bg-black text-white rounded-full p-3 hover:bg-gray-800"
            >
              <Image src="/icons/search-interface-symbol.png" alt="Search" width={18} height={18} />
            </button>
          </div>
        </div>

      
        <div className="relative flex items-center gap-6 text-gray-700">

          
          {!user && (
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowLogin(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
              >
                Prijava
              </button>

              <button
                onClick={() => setShowRegister(true)}
                className="px-4 py-2 bg-gray-800 text-white rounded-full hover:bg-black"
              >
                Registracija
              </button>
            </div>
          )}

        
          {user && (
            <>
              <button className="hover:text-blue-600">
                <Image src="/icons/comment.png" alt="comment" width={24} height={24} />
              </button>

              <button className="hover:opacity-60 transition">
                <Image src="/icons/notification.png" alt="notification" width={24} height={24} />
              </button>

              <button className="hover:text-blue-600">
                <Image src="/icons/support.png" alt="support" width={24} height={24} />
              </button>

             
              <div
                className="flex items-center gap-2 cursor-pointer select-none"
                onClick={() => setOpen(!open)}
              >
                <div className="w-9 h-9 bg-gray-300 rounded-full"></div>
                <Image
                  src="/icons/arrow-down-sign-to-navigate.png"
                  alt="Dropdown"
                  width={10}
                  height={10}
                  className={`transition-transform ${open ? "rotate-180" : "rotate-0"}`}
                />
              </div>

              {open && (
                <div className="absolute right-0 top-14 bg-white border border-gray-200 rounded-lg w-40 py-2 z-20">
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100">Profil</button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100">Nastavitve</button>

                  <button
  onClick={() => {
    localStorage.removeItem("user");

    // 🔥 obvesti cel app
    window.dispatchEvent(new Event("user-logout"));

    setUser(null);
    setOpen(false);

    router.push("/");
  }}
  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
>
  Odjava
</button>
                </div>
              )}
            </>
          )}
        </div>
      </header>

      
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
    </>
  );
}
