import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/app/lib/prisma";
export const authOptions: NextAuthOptions = {
  debug: true,
  
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user?.email) return false;
      const existing = await prisma.user.findUnique({ where: { email: user.email } });
      if (!existing) {
        await prisma.user.create({
          data: {
            email: user.email,
            name: user.name || "",
            image: user.image,
            password: "google-oauth",
          },
        });
      } else if (!existing.image && user.image) {
        await prisma.user.update({
          where: { id: existing.id },
          data: { image: user.image, name: existing.name || user.name || existing.name },
        });
      }
      return true;
    },
    async jwt({ token }) {
      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string },
          select: { id: true, isAdmin: true, name: true, image: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.isAdmin = dbUser.isAdmin;
          token.name = dbUser.name;
          token.picture = dbUser.image;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).isAdmin = token.isAdmin;
        session.user.name = (token.name as string | undefined) || session.user.name;
        session.user.image = (token.picture as string | undefined) || session.user.image;
      }
      return session;
    },
  },
};
