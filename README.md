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
- **bcrypt** (password hashing)
- **Playwright** (e2e testing)
- **Vitest** (unit testing)

---

## 🔐 Avtentikacija

- Prijava z **Google računom**
- Seje shranjene v bazi (`database` session strategy)
- Podpora za `isAdmin` uporabnike
- **Gesla hashirana z bcrypt** (12 salt rounds)
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

## 🧪 Testiranje

Projekt ima obsežno testno pokritost:

### Zaganjanje Testov

```bash
# Unit testi (Vitest)
npm run test:unit

# E2e testi (Playwright) - headless
npx playwright test

# E2e testi z brskalnikom (za ogled izvajanja)
npx playwright test --headed

# Interaktivni Playwright UI
npx playwright test --ui

# Poročilo po testih
npx playwright show-report
```

- **Unit testi**: 45 testov, testirajo API-je, komponente in logiko
- **E2e testi**: Celotni user flow v brskalniku, preverjajo funkcionalnost od konca do konca

---

## 🐛 Popravljeni Bugi

| Bug | Opis | Zahtevnost | Čas |
|-----|------|------------|-----|
| Google Login | Težave z OAuth konfiguracijo in callback-i | 9/10 | 2h |
| CSS Popravek | Vizualne napake v stilizaciji | 1/10 | 15min |
| Gumb Popravek | Nepravilno delovanje gumbov | 1/10 | 15min |
| User Icon ob Pisanju | Ikona uporabnika se ni posodabljala med tipkanjem | 8/10 | 1h |
| Hash Passwords | Gesla niso bila hashirana (varnostna luknja) | 4/10 | 45min |

