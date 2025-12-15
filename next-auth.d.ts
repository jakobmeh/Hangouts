import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;        // ✅ STRING
      isAdmin: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;         // ✅ STRING
    isAdmin: boolean;
  }
}
