"use client";

import { useState } from "react";
import Image from "next/image";

export default function NavigationBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-gray-100 px-6 py-4 flex items-center justify-between border-b border-gray-200">
      
      <div className="flex items-center gap-6">
         <Image
            src="/icons/Meetup.png"
            alt="logo"
            width={85}
            height={85}
          />

        <input
          type="text"
          placeholder="Išči"
          className="p-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="relative flex items-center gap-6 text-gray-700">

        <button className="hover:text-blue-600">
          <Image
            src="/icons/comment.png"
            alt="notifications"
            width={24}
            height={24}
          />
        </button>

        <button className="hover:opacity-60 transition">
          <Image
            src="/icons/notification.png"
            alt="notifications"
            width={24}
            height={24}
          />
        </button>

        <button className="hover:text-blue-600 text-xl">
          <Image
            src="/icons/support.png"
            alt="notifications"
            width={24}
            height={24}
          />
        </button>

        <div
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={() => setOpen(!open)}
        >
          <div className="w-9 h-9 bg-gray-300 rounded-full"></div>

          <span
            className="text-lg transition-transform"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            <Image
            src="/icons/arrow-down-sign-to-navigate.png"
            alt="Dropdown"
            width={10}
            height={10}
          />
          </span>
        </div>

        {open && (
          <div className="absolute right-0 top-14 bg-white border border-gray-200 rounded-lg w-40 py-2 z-20">
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
