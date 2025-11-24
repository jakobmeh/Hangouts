"use client";

import { motion } from "framer-motion";

export type UserType = {
  id: number;
  email: string;
  name?: string | null;
};

type SidebarProps = {
  user: UserType | null;
  search: string;
  setSearch: (value: string) => void;
};

export default function Sidebar({ user, search, setSearch }: SidebarProps) {
  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Menu</h2>

      {user && (
        <p className="mb-6 text-gray-700 font-medium">
          Pozdravljen, {user.name || user.email}
        </p>
      )}

      {/* Search bar */}
      <input
        type="text"
        placeholder="Išči dogodke..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 p-3 rounded-xl border border-gray-300 shadow-sm
                   text-gray-900 placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Navigation / Categories */}
      <div className="flex flex-col gap-3 text-gray-700">
        <button className="text-left hover:text-blue-600 transition">Vsi dogodki</button>
        <button className="text-left hover:text-blue-600 transition">Šport</button>
        <button className="text-left hover:text-blue-600 transition">Programiranje</button>
        <button className="text-left hover:text-blue-600 transition">Druženje</button>
      </div>
    </motion.div>
  );
}
