import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";

/**
 * Edge-compatible auth config for middleware.
 * No DB, no bcrypt – only JWT/session callbacks and options.
 * Full config with Credentials provider lives in auth.ts.
 */
export const authConfig = {
  providers: [], // Only used in Edge; Credentials added in auth.ts
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.userId = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as "admin" | "driver";
        session.user.id = token.userId as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
} satisfies NextAuthConfig;

/** Edge-safe auth for middleware only. Use auth from auth.ts in API/layouts. */
export const { auth } = NextAuth(authConfig);
