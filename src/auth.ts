import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/database";
import { env } from "@/env";
import { User } from "@/types/User";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
      role: "user" | "admin";
    };
  }
}

export const authConfig: NextAuthOptions = {
  // @ts-ignore
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "jwt",
  },
  providers: [
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    session({ session }) {
      return {
        ...session,
        user: {
          ...session.user,
        } satisfies User,
      };
    },
  },
  pages: {
    signIn: "/signin",
  },
};
