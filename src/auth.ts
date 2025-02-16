import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db, users } from "@/database";
import { env } from "@/env";
import { eq } from "drizzle-orm";
import { User, userSchema } from "./types/User";

declare module "next-auth" {
  interface Session {
    user: User;
  }
}

export const authConfig: NextAuthOptions = {
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "database",
  },
  providers: [
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      const dbUser = await db
        .select()
        .from(users)
        .where(eq(users.id, user.id))
        .get();
      const parsed = userSchema.parse(dbUser);
      session.user = parsed;
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
};
