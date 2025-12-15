# Hangouts

Hangouts je moderna web aplikacija za **ustvarjanje skupin, dogodkov in druženje ljudi**, z Google prijavo in real-time podatki iz baze.

Aplikacija je zgrajena z **Next.js (App Router)**, **NextAuth (Google OAuth)** in **Prisma + PostgreSQL (Neon)** ter deployana na **Vercel** z lastno domeno.

🌍 Produkcija: https://www.hangout-jakob.eu

---

## 🚀 Tehnologije

- **Next.js 16 (App Router + Turbopack)**
- **TypeScript**
- **NextAuth.js** (Google OAuth)
- **Prisma ORM**
- **PostgreSQL (Neon)**
- **Tailwind CSS**
- **Vercel** (deploy + env variables)

---

## 🔐 Avtentikacija

- Prijava z **Google računom**
- Seje shranjene v bazi (`database` session strategy)
- Podpora za `isAdmin` uporabnike
- OAuth pravilno nastavljen za:
  - localhost
  - vercel domeno
  - custom domeno

---

## 📦 Funkcionalnosti

- 👤 Google login / logout
- 👥 Skupine (groups)
- 📅 Dogodki (events)
- 📨 Sporočila v skupinah
- 📍 Lokacija (mesto / država)
- 🔢 Števci članov in dogodkov
- 🔐 Admin podpora

---

## 🧑‍💻 Lokalni razvoj

### 1. Kloniranje repozitorija
```bash
git clone <repo-url>
cd hangouts
