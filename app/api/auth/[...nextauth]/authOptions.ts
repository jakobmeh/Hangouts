/**
 * AUTH OPTIONS - NextAuth konfiguracija
 *
 * Konfigurira:
 * - Google OAuth provider
 * - Database session strategy (Prisma adapter)
 * - Callback-i za signIn, JWT in session obdelavo
 */

import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/app/lib/prisma";

export const authOptions: NextAuthOptions = {
  debug: true,
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    /**
     * signIn callback - Poklican ko se user poskuša prijaviti
     * Vrne true za dovolitev prijave, false za zavrnitev
     * 
     * NAPOMENA: Adapter (PrismaAdapter) že avtomatično ustvari novega user-ja,
     * zato tu ne moramo posebej pisati logiko za ustvarjanje
     */
    async signIn({ user, account, profile, email, credentials }) {
      // Prijava se vedno dovoli (adapter že obdeluje ustvarjanje user-ja)
      return true;
    },

    /**
     * redirect callback - Preusmerite user-ja po uspešni prijavi
     * To je potrebno za pravilno pretvorbo OAuth info v database
     */
    async redirect({ url, baseUrl }) {
      // Če je absolutni URL in je isti kot base URL, dozvoli
      if (url.startsWith(baseUrl)) {
        return url;
      }
      // Sicer preusmeri na domačo stran
      return baseUrl;
    },

    /**
     * session callback - Pozvan ko se session pošlje klientu
     * Dodaj admin info in id v session object
     * 
     * Uporabljamo database session strategy, zato je JWT callback nepotrebna.
     * Namesto tega, podatke dodajamo v session ki se shrani v bazi.
     */
    async session({ session, user }) {
      if (session.user) {
        // Dodaj user id v session
        (session.user as any).id = user.id;
        
        // Dodaj admin info v session
        (session.user as any).isAdmin = user.isAdmin;
      }
      return session;
    },
  },
};
