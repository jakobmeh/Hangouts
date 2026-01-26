/**
 * USE_USER.TS - Custom React Hook za upravljanje user state-a
 * 
 * PROBLEM BREZ TEGA HOOKA:
 *   - Ista logika za loadanje user-ja se ponavljala v page.tsx, profile/page.tsx, itd.
 *   - Ročno upravljanje localStorage, event listener-jev, state-a
 *   - Težko vzdrževati in debuggati
 * 
 * REŠITEV S HOOKOM:
 *   - Centralizirana logika (DRY princip)
 *   - Enostavna uporaba: const { user, loading } = useUser();
 *   - Samodejno sledi login/logout event-om
 *   - Samodejno piše v localStorage
 * 
 * UPORABA V KOMPONENTAH:
 *   export default function MyPage() {
 *     const { user, loading } = useUser();
 *     
 *     if (loading) return <div>Loading...</div>;
 *     if (!user) return <div>Please login</div>;
 *     
 *     return <div>Welcome {user.name}</div>;
 *   }
 */

'use client';

import { useEffect, useState } from 'react';
import { UserType } from './types';

/**
 * Hook return type - kaj vrne useUser hook
 * 
 * @property user - Trenutni user (null če ni prijavljen)
 * @property loading - Ali se user še piča iz API-ja
 * @property setUser - Funkcija za ročno spremembo user-ja (retko potrebno)
 */
export interface UseUserReturn {
  user: UserType | null;
  loading: boolean;
  setUser: (user: UserType | null) => void;
}

/**
 * useUser Hook - Centralizirano upravljanje user state-a
 * 
 * FUNKCIONALNOSTI:
 * 1. Prebere user iz localStorage (če obstaja)
 * 2. Če ni lokalnega user-ja, po-fetch-a iz /api/me (NextAuth session)
 * 3. Sluša na global "user-login" in "user-logout" event-e
 * 4. Samodejno posodobi state ob teh event-ih
 * 5. Počisti event listener-je pri unmount-u
 * 
 * @returns {UseUserReturn} user, loading, setUser funkcija
 */
export function useUser(): UseUserReturn {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * FAZA 1: Preberi user iz localStorage na startup
   * (To je hitro ker je localStorage sinhron)
   */
  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsedUser = JSON.parse(stored);
        setUser(parsedUser);
        setLoading(false);
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage:', error);
      localStorage.removeItem('user'); // Počisti korumpirane podatke
      setLoading(false);
    }
  }, []);

  /**
   * FAZA 2: Če ni user-ja v localStorage, po-fetch-a iz API-ja
   * (To se zgodi za NextAuth session ali novo prijavo)
   */
  useEffect(() => {
    // Če imamo že user-ja ali se je že naložil, preskoči
    if (user || !loading) return;

    async function fetchCurrentUser() {
      try {
        const response = await fetch('/api/me', { cache: 'no-store' });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          // Shrani v localStorage za naslednji obisk
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } catch (error) {
        console.error('Failed to fetch current user:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCurrentUser();
  }, [user, loading]);

  /**
   * FAZA 3: Poslušaj global event-e za login/logout
   * (Ko se user proslavi v eni komponenti, se posodobi povsod)
   * 
   * EVENT STRUKTURA:
   *   - "user-login": Pošlji, ko se je user uspešno prijavil
   *     (Komanda: window.dispatchEvent(new Event('user-login')))
   *   - "user-logout": Pošlji, ko se je user odjavil
   *     (Komanda: window.dispatchEvent(new Event('user-logout')))
   */
  useEffect(() => {
    /**
     * handleUserChange - Rebuildaj user state iz localStorage
     * To se zgodi ko se user proslavi/odjavil v drug komponentah
     */
    const handleUserChange = () => {
      try {
        const stored = localStorage.getItem('user');
        if (stored) {
          const parsedUser = JSON.parse(stored);
          setUser(parsedUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to sync user:', error);
        setUser(null);
      }
    };

    // Registriraj event listener-je
    window.addEventListener('user-login', handleUserChange);
    window.addEventListener('user-logout', handleUserChange);

    // Cleanup: Izbriši listener-je ob unmount-u
    return () => {
      window.removeEventListener('user-login', handleUserChange);
      window.removeEventListener('user-logout', handleUserChange);
    };
  }, []);

  return { user, loading, setUser };
}

/**
 * Helper funkcija: Pošlji user-login event
 * 
 * UPORABA:
 *   // Po uspešni prijavi
 *   localStorage.setItem('user', JSON.stringify(userData));
 *   notifyUserChange('login');
 */
export function notifyUserChange(type: 'login' | 'logout') {
  const eventName = type === 'login' ? 'user-login' : 'user-logout';
  window.dispatchEvent(new Event(eventName));
}
