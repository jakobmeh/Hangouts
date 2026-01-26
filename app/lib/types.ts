/**
 * TYPES.TS - Centralizirani type definitions
 * 
 * Ta datoteka vsebuje vse TypeScript tipe in interfacie, ki se uporabljajo
 * v aplikaciji. To omogoča enotno upravljanje in izognemo se dupliciranemu
 * definiranju enakih tipov v različnih datotekah.
 */

/**
 * UserType - Predstavlja uporabnika v aplikaciji
 * 
 * @property id - Edinstveni identifikator uporabnika (iz baze)
 * @property email - Email uporabnika (osnovna identifikacija)
 * @property name - Ime uporabnika (opciono)
 * @property image - Profila slika v base64 ali URL (opciono)
 */
export type UserType = {
  id: number;
  email: string;
  name?: string | null;
  image?: string | null;
};

/**
 * GroupType - Predstavlja uporabniško skupino/dogodke
 * 
 * @property id - Edinstveni identifikator skupine
 * @property name - Ime skupine
 * @property city - Mesto, kjer se skupina srečuje
 * @property country - Država (opciono)
 * @property image - Slika skupine (opciono)
 * @property _count - Agregacijski podatki (kot jih vrne Prisma)
 *   @property _count.members - Število članov v skupini
 *   @property _count.events - Število dogodkov v skupini
 */
export type GroupType = {
  id: number;
  name: string;
  city: string;
  country?: string | null;
  image?: string | null;
  _count: {
    members: number;
    events: number;
  };
};

/**
 * EventType - Predstavlja dogodek
 * 
 * @property id - Edinstveni identifikator dogodka
 * @property title - Naslov dogodka
 * @property date - Datum in čas dogodka
 * @property city - Mesto, kjer se dogodek zgodi
 * @property imageUrl - Slika dogodka (opciono)
 * @property capacity - Največje število udeležencev (opciono)
 * @property userId - ID uporabnika, ki je organizator
 * @property _count - Podatki o udeležencih
 *   @property _count.attendees - Število prijavljenih udeležencev
 */
export type EventType = {
  id: number;
  title: string;
  date: string;
  city: string;
  imageUrl?: string | null;
  capacity?: number | null;
  userId: number;
  _count: {
    attendees: number;
  };
};

/**
 * ApiResponse - Standardna struktura za API odgovore
 * 
 * @property data - Dejanski podatki (generičen tip)
 * @property error - Sporočilo o napaki (opciono)
 * @property status - HTTP status koda
 */
export type ApiResponse<T> = {
  data?: T;
  error?: string;
  status: number;
};

/**
 * LocalStorageUser - Kako shranimo user data v localStorage
 * (enaka strukturo kot UserType)
 */
export type LocalStorageUser = UserType;
