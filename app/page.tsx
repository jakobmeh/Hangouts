/**
 * PAGE.TSX - Domača stran z razpoložljivimi skupinami
 * 
 * FUNKCIONALNOSTI:
 * - Prikaz vseh skupin (max 6 na prvi strani)
 * - Filtriranje skupin, v katere je trenutni user že prijavljen
 * - Loading state z skeleton komponento
 * - Guest mode (brez prijave): CTA za registracijo
 * - Logged in mode: Prikaz skupin in možnost pridružitve
 * 
 * REFAKTORIRANJE:
 * - Koristi useUser() hook namesto ročnega upravljanja
 * - Koristi apiGet() za brez-boilerplate API klice
 * - Centralizirani types v lib/types.ts
 * - Jasni komentarji za vsak del
 */

'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

import NavigationBar from './components/NavigationBar';
import Footer from './components/Footer';
import RegisterModal from './components/RegisterModal';
import Sidebar from './components/sidebar';
import Skeleton from './components/Skeleton';

import { useUser } from '@/app/lib/useUser';
import { apiGet } from '@/app/lib/api';
import { UserType, GroupType } from '@/app/lib/types';

/**
 * HomePage - Glavna domača stran aplikacije
 */
export default function HomePage() {
  // ==================== STATE ====================

  // Uporabnik je prijavljen ali ne
  const { user, loading: userLoading } = useUser();

  // Razpoložljive skupine (prikazujemo max 6)
  const [groups, setGroups] = useState<GroupType[]>([]);

  // IDs skupin, v katere je trenutni user že prijavljen
  const [myGroupIds, setMyGroupIds] = useState<number[]>([]);

  // Naklučni loading flag
  const [loading, setLoading] = useState(true);

  // Prikaz registracijske forme
  const [showRegister, setShowRegister] = useState(false);

  // ==================== EFEKTI ====================

  /**
   * EFEKT 1: Naloži vse razpoložljive skupine
   * Izvršimo samo enkrat na startup
   */
  useEffect(() => {
    async function loadAllGroups() {
      const response = await apiGet<GroupType[]>('/api/groups');

      if (!response.error && response.data) {
        // Prikaži samo prvih 6 skupin
        setGroups(response.data.slice(0, 6));
      }
    }

    loadAllGroups();
  }, []);

  /**
   * EFEKT 2: Naloži skupin, v katere je current user že prijavljen
   * To se izvršil samo, ko je user dostopen (user !== null)
   *
   * RAZLOG: Filtriramo izven skupin, ki jih je user že prijavljen
   */
  useEffect(() => {
    // Če ni user-ja, preskočimo
    if (!user) {
      setLoading(false);
      return;
    }

    async function loadUserGroups() {
      const response = await apiGet<GroupType[]>('/api/me/groups');

      if (!response.error && response.data) {
        // Ekstrahiraj samo IDs za hitro primerjavo
        const ids = response.data.map((group) => group.id);
        setMyGroupIds(ids);
      }

      setLoading(false);
    }

    loadUserGroups();
  }, [user]);

  // ==================== RENDER ====================

  /**
   * LOADING STATE - Prikaži skeleton loader medtem, ko se podatki nalagajo
   */
  if (loading || userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col">
        {/* Skeleton navigacijska vrstica */}
        <div className="border-b border-gray-200 bg-white/70 backdrop-blur">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Skeleton className="h-8 w-32" />
            <div className="flex gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-24 rounded-full" />
            </div>
          </div>
        </div>

        {/* Skeleton grid skupin */}
        <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm"
              >
                <Skeleton className="h-5 w-32" />
                <Skeleton className="mt-3 h-4 w-24" />
                <div className="mt-4 space-y-2">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skeleton footer */}
        <div className="border-t border-gray-200 bg-white/70 backdrop-blur">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </div>
    );
  }

  /**
   * GUEST MODE - Prikaži landing page za neprijavljene uporabnike
   */
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <NavigationBar />

        {/* Hero sekcija s CTA */}
        <section className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-3xl">
            {/* Naslov s sličico */}
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 flex flex-wrap items-center justify-center gap-3">
              <span>The</span>

              <span className="inline-flex items-center gap-2 text-blue-600">
                <img
                  src="/icons/group.png"
                  alt="Group icon"
                  className="h-10 md:h-20 w-auto align-middle"
                />
                people
              </span>

              <span>platform</span>
            </h1>

            {/* Opis aplikacije */}
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              Join thousands of people meeting up, creating events, and building
              real connections every day.
            </p>

            {/* Gumb za vstop */}
            <button
              onClick={() => setShowRegister(true)}
              className="
                inline-flex items-center justify-center
                px-8 py-4 rounded-full
                bg-blue-600 text-white font-semibold
                shadow-lg shadow-blue-600/30
                hover:bg-blue-700 hover:shadow-blue-700/40
                transition-all duration-200
              "
            >
              Join Meetups
            </button>         
          </div>
        </section>

        <Footer />

        {/* Registracijska modal - prikaži, če je user kliknil na "Join Meetup" */}
        {showRegister && (
          <RegisterModal onClose={() => setShowRegister(false)} />
        )}
      </div>
    );
  }

  /**
   * LOGGED IN MODE - Prikaži seznam skupin in glavne vsebine
   */
  // Filter: samo skupin, v katere ta user NISN (nNIST) prijavljen
  const availableGroups = groups.filter(
    (group) => !myGroupIds.includes(group.id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col">
      {/* Navigacija */}
      <NavigationBar />

      {/* Main layout s sidebar-om */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-6 py-8 gap-8">
        {/* SIDEBAR - Navigacijski meni */}
        <Sidebar user={user} />

        {/* MAIN - Vsebina domače strani */}
        <main className="
          flex-1
          bg-white/80 backdrop-blur
          rounded-3xl
          border border-gray-200
          shadow-sm
          p-8
        ">
          {/* WELCOME MESSAGE */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome, {user.name}!
            </h2>
          </div>

          {/* HEADER */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">
                Discover groups
              </h1>
              <p className="text-gray-500 mt-1">
                Find communities and start meeting people
              </p>
            </div>
          </div>

          {/* GROUPS GRID - Prikaz skupin s kartice */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {availableGroups.map((group) => (
              <Link
                key={group.id}
                href={`/groups/${group.id}`}
                className="
                  group
                  rounded-2xl
                  border border-gray-200
                  bg-gradient-to-br from-white via-gray-50 to-gray-100
                  p-6
                  hover:shadow-md
                  hover:-translate-y-0.5
                  transition-all
                "
              >
                {/* Ime skupina */}
                <h2 className="
                  font-semibold text-lg text-gray-900
                  group-hover:text-blue-600 transition
                ">
                  {group.name}
                </h2>

                {/* Lokacija */}
                <p className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                  <Image
                    src="/icons/placeholder.png"
                    alt="Location"
                    width={18}
                    height={18}
                  />
                  <span>
                    {group.city}
                    {group.country ? `, ${group.country}` : ''}
                  </span>
                </p>

                {/* Metadata: članstvo in dogodki */}
                <div className="mt-4 flex gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Image
                      src="/icons/groups.png"
                      alt="Members"
                      width={18}
                      height={18}
                    />
                    {group._count.members} members
                  </span>

                  <span className="flex items-center gap-1">
                    <Image
                      src="/icons/event-list.png"
                      alt="Events"
                      width={18}
                      height={18}
                    />
                    {group._count.events} events
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* EMPTY STATE - Če ni več razpoložljivih skupin */}
          {availableGroups.length === 0 && (
            <div className="mt-16 text-center">
              <div className="text-4xl mb-4">🎉</div>
              <p className="text-gray-600 text-lg">
                You already joined all available groups
              </p>
            </div>
          )}

          {/* CTA - Poglejmo vse skupin */}
          <div className="mt-10 text-center">
            <Link
              href="/groups"
              className="
                inline-flex items-center justify-center
                px-8 py-4 rounded-full
                bg-blue-600 text-white font-semibold
                shadow-lg shadow-blue-600/30
                hover:bg-blue-700 hover:shadow-blue-700/40
                transition
              "
            >
              Explore all groups
            </Link>
          </div>

          {/* COMING SOON TEASER - Kaj je prihaja slediti */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="
              mt-12
              bg-gradient-to-br from-gray-50 to-white
              border border-dashed border-gray-300
              rounded-2xl
              p-6
              text-center
            "
          >
            <p className="text-gray-500 font-medium">
              🚀 Events coming next
            </p>
          </motion.div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}




