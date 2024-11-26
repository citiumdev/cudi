import GitHub from "@auth/core/providers/github";
import { defineConfig } from "auth-astro";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "astro:db";

declare module "@auth/core/types" {
  interface Session extends DefaultSession {
    user?: {
      id: string;
      name: string;
      email: string;
      image: string;
    };
  }
}

export default defineConfig({
  providers: [
    GitHub({
      clientId: import.meta.env.GITHUB_CLIENT_ID,
      clientSecret: import.meta.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  adapter: DrizzleAdapter(db as any),
  callbacks: {
    session({ session, user }) {
      return {
        ...session,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
      };
    },
  },
});
