"use client";

import { useState } from "react";
import Image from "next/image";

export default function NavigationBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow px-6 py-4 flex items-center justify-between border-b border-gray-200">
      
      <div className="flex items-center gap-6">
         <Image
            src="/icons/logo.png"
            alt="logo"
            width={65}
            height={65}
          />

        <input
          type="text"
          placeholder="Išči"
          className="p-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="relative flex items-center gap-6 text-gray-700">

        <button className="hover:text-blue-600">    <Image
            src="/icons/comment.png"
            alt="notifications"
            width={24}
            height={24}
          /></button>

        {/* Notification icon PNG */}
        <button className="hover:opacity-60 transition">
          <Image
            src="/icons/notification.png"
            alt="notifications"
            width={24}
            height={24}
          />
        </button>

        <button className="hover:text-blue-600 text-xl"> <Image
            src="/icons/support.png"
            alt="notifications"
            width={24}
            height={24}
          /></button>

        <div
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={() => setOpen(!open)}
        >
          <div className="w-9 h-9 bg-gray-300 rounded-full"></div>

          <span
            className="text-lg transition-transform"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            ⌄
          </span>
        </div>

        {open && (
          <div className="absolute right-0 top-14 bg-white shadow-lg border border-gray-200 rounded-lg w-40 py-2 z-20">
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
              Profil
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
              Nastavitve
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600">
              Odjava
            </button>
          </div>
        )}
      </div>

    </header>
  );
}
