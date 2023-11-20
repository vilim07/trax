import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface User {
        uid: string;
    }

    interface Session extends DefaultSession {
        user?: User;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
      uid: string;
    }
  }