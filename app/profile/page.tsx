/**
 * PROFILE/PAGE.TSX - Profila stran za urejanje podatkov uporabnika
 * 
 * FUNKCIONALNOSTI:
 * - Prikaz osnovnih profilnih podatkov (ime, email)
 * - Nalaganje in urejanje profilne slike
 * - Shranjevanje sprememb na strežnik
 * - Samodejno osvežitev podatkov v drugi komponenti (preko event-ov)
 * 
 * REFAKTORIRANJE:
 * - Uporablja useUser() hook za upravljanje user state-a
 * - Uporablja apiPut() za API klice brez boilerplate-a
 * - Ekstrahirana AvatarUpload komponenta (DRY princip)
 * - Ekstrahirana FormInput komponenta (DRY princip)
 */

'use client';

import { useState } from 'react';
import NavigationBar from '@/app/components/NavigationBar';
import Sidebar from '@/app/components/sidebar';
import Footer from '@/app/components/Footer';
import AvatarUpload from '@/app/components/AvatarUpload';
import FormInput from '@/app/components/FormInput';
import { useUser, notifyUserChange } from '@/app/lib/useUser';
import { apiPut } from '@/app/lib/api';
import { UserType } from '@/app/lib/types';

/**
 * ProfilePage - Glavna komponenta za profilne nastavke
 */
export default function ProfilePage() {
  // ==================== STATE ====================
  // Uporabimo useUser hook namesto ročnega upravljanja
  const { user, loading: userLoading } = useUser();

  // Spremenljivi podatki v formi (lokalni state)
  const [name, setName] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // ==================== INICIALIZACIJA ====================
  // Ko se user naloži, inicializiraj form polja
  if (user && !name && image === null) {
    setName(user.name || '');
    setImage(user.image || null);
  }

  // ==================== FUNKCIJE ====================

  /**
   * handleSave - Pošlji spremembe na strežnik
   * 
   * PROCES:
   * 1. Prepreči default form submit
   * 2. Naslovi loading state
   * 3. Pošlji PUT zahtevo na /api/me
   * 4. Če je uspešno:
   *    - Posodobi localStorage
   *    - Pošlji global event za osvežitev drugih komponent
   *    - Prikaži success sporočilo
   * 5. Obravnaj napake
   */
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Pošlji PUT zahtevo z novimi podatki
    const response = await apiPut<UserType>('/api/me', {
      name,
      image,
    });

    setLoading(false);

    // Preverimo, ali je bilo uspešno
    if (response.error) {
      setError(response.error);
      return;
    }

    if (!response.data) {
      setError('Unexpected response from server');
      return;
    }

    // ✅ USPEŠNO - Posodobi globalne podatke
    const updatedUser = response.data;

    // 1. Posodobi localStorage za persistentnost
    localStorage.setItem('user', JSON.stringify(updatedUser));

    // 2. Pošlji global event, da se vse komponente osveže
    //    (npr. NavigationBar bo pokazal novo sliko)
    notifyUserChange('login');

    // 3. Prikaži success sporočilo
    setSuccess('Profile updated successfully');

    // Počisti sporočilo po 3 sekundah
    setTimeout(() => setSuccess(''), 3000);
  }

  // ==================== RENDER ====================

  // Če se user še naloža, ne prikaži kaj (ali loading skeleton)
  if (userLoading) return null;

  // Če ni user-ja, ne prikaži kaj (zaščita - bi moral biti redirect na login)
  if (!user) return null;


  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Glavna navigacijska vrstica */}
      <NavigationBar />

      {/* Glavni vsebinski prostor s sidebar-om */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-6 py-8 gap-8">
        {/* SIDEBAR - Navigacijski meni */}
        <aside className="w-72 shrink-0">
          <Sidebar user={user} />
        </aside>

        {/* MAIN - Vsebina profila */}
        <main className="flex-1 flex justify-center">
          <div className="w-full max-w-2xl bg-white rounded-2xl border shadow-sm p-8">
            <h1 className="text-2xl font-bold mb-6">Profile settings</h1>

            {/* PROFILA FORMA */}
            <form onSubmit={handleSave} className="space-y-6">
              {/* AVATAR - Profilna slika in upload */}
              <AvatarUpload
                image={image}
                name={name}
                onChange={setImage}
              />

              {/* IME - Text input z validation */}
              <FormInput
                label="Name"
                value={name}
                onChange={setName}
                error={error ? 'Failed to update profile' : undefined}
              />

              {/* EMAIL - Onemogočeno (only read) */}
              <FormInput
                label="Email"
                value={user.email}
                onChange={() => {}} // Ignoriraj spremembe
                disabled={true}
              />

              {/* SPOROČILA */}
              {/* Prikaži success sporočilo v zeleni barvi */}
              {success && (
                <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                  ✓ {success}
                </div>
              )}

              {/* Prikaži error sporočilo v rdeči barvi */}
              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                  ✗ {error}
                </div>
              )}

              {/* GUMB ZA SHRANJEVANJE */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`
                    w-full px-6 py-3 rounded-lg font-medium
                    transition duration-200
                    ${
                      loading
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }
                  `}
                >
                  {loading ? '💾 Saving...' : '💾 Save changes'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>

      {/* Footer na spodjem delu */}
      <Footer />
    </div>
  );
}
