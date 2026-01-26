/**
 * AVATAR_UPLOAD.TSX - Component za nalaganje in prikaz profilne slike
 * 
 * EKSTRAHIRANO IZ: profile/page.tsx
 * RAZLOG: DRY princip - ta logika se bo tudi v drugih komponentah
 * 
 * FUNKCIONALNOSTI:
 * - Prikaz trenutne slike (ali iniciala imena)
 * - File input za izbiro nove slike
 * - Pretvorba v base64 za prikaz in shranjevanje
 * - Smiselne nastavke za velikost in stil
 * 
 * PROPS:
 * @param image - Trenutna slika (base64 string)
 * @param name - Ime uporabnika (za initial display)
 * @param onChange - Callback ob spremembi slike (prejme base64)
 */

import Image from 'next/image';

interface AvatarUploadProps {
  image: string | null;
  name: string;
  onChange: (base64Image: string) => void;
}

export default function AvatarUpload({
  image,
  name,
  onChange,
}: AvatarUploadProps) {
  /**
   * handleImageChange - Pretvori izbrano datoteko v base64
   * 
   * PROCES:
   * 1. Preverimo ali je datoteka izbrana
   * 2. Uporabimo FileReader za branje datoteke
   * 3. Ko je datoteka prebrana, jo pretvorimo v base64
   * 4. Pošljemo base64 stringprek onChange callback-a
   * 5. Komponenta, ki je roditeljska, posodobi state
   */
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Ustvari FileReader za prebiranje datoteke
    const reader = new FileReader();
    
    // Ko je datoteka prebrana, pošlji base64 do roditeljske komponente
    reader.onload = () => {
      const base64String = reader.result as string;
      onChange(base64String);
    };
    
    // Preberi datoteko kot data URL (base64)
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex items-center gap-6">
      {/* AVATAR PRIKAZOVALNIK */}
      <div className="relative w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
        {image ? (
          // Če je slika obstaja, prikaži jo
          <Image
            src={image}
            alt="Profile picture"
            fill
            className="object-cover"
            priority
          />
        ) : (
          // Drugače prikaži inicialo imena
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-xl font-semibold">
            {name?.[0]?.toUpperCase() || 'U'}
          </div>
        )}
      </div>

      {/* FILE INPUT ZA NALAGANJE */}
      <label className="text-sm font-medium text-blue-600 cursor-pointer hover:underline transition">
        Change photo
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
          aria-label="Upload profile picture"
        />
      </label>
    </div>
  );
}
