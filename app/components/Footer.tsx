"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-gray-300 mt-16">
      {/* TOP */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        {/* BRAND */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">
            The people platform
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Create communities, join events and meet new people.
          </p>

          <Link
            href="/groups/new"
            className="inline-block text-sm font-medium text-blue-400 hover:text-blue-300"
          >
            Get started →
          </Link>
        </div>

        {/* ACCOUNT */}
        <div>
          <h4 className="text-white font-semibold mb-3">
            Account
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/settings" className="hover:text-white">
                Settings
              </Link>
            </li>
            <li>
              <Link href="/help" className="hover:text-white">
                Help
              </Link>
            </li>
          </ul>
        </div>

        {/* DISCOVER */}
        <div>
          <h4 className="text-white font-semibold mb-3">
            Discover
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/groups" className="hover:text-white">Groups</Link></li>
            <li><Link href="/events" className="hover:text-white">Events</Link></li>
            <li><Link href="/topics" className="hover:text-white">Topics</Link></li>
            <li><Link href="/cities" className="hover:text-white">Cities</Link></li>
          </ul>
        </div>

        {/* ABOUT */}
        <div>
          <h4 className="text-white font-semibold mb-3">
            About
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
            <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
            <li><Link href="/about" className="hover:text-white">Company</Link></li>
          </ul>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <span>© 2025 Meetup. All rights reserved.</span>

          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/cookies" className="hover:text-white">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
