"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0b1220] text-gray-300">
      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* BRAND */}
        <div>
          <h3 className="text-white text-xl font-bold mb-4">
            The people platform
          </h3>

          <p className="text-sm text-gray-400 max-w-sm mb-6">
            Discover groups, create events and build real connections with people near you.
          </p>

          {/* APP STORES */}
          <div className="flex gap-3">
            {/* App Store */}
            <img
              src="/icons/appstore.svg"
              alt="Download on the App Store"
              className="h-11 cursor-pointer hover:opacity-90 transition"
            />

            {/* Google Play */}
            <img
              src="/icons/googleplay.png"
              alt="Get it on Google Play"
              className="h-11 cursor-pointer hover:opacity-90 transition"
            />
          </div>
        </div>

        {/* LINKS */}
       

        {/* CTA */}
       <div className="flex md:justify-end">
  <div className="max-w-sm text-left md:text-right">
    <h4 className="text-white font-semibold mb-4">
      Start today
    </h4>

    <p className="text-sm text-gray-400 mb-6">
      Create your first group or join an event in seconds.
    </p>

    <Link
      href=""
      className="
        inline-flex items-center justify-center
        px-6 py-3 rounded-full
        bg-blue-600 text-white font-semibold
        hover:bg-blue-700 transition
        shadow-lg shadow-blue-600/30
      "
    >
      Get started
    </Link>
  </div>
</div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <span>© {new Date().getFullYear()} The people platform</span>

          <span className="opacity-60">
            Built with ❤️ in Slovenia
          </span>
        </div>
      </div>
    </footer>
  );
}
