import GitHub from "@auth/core/providers/github";
import { defineConfig } from "auth-astro";
import type { User } from "@/types/user";
import { AstroDBAdapter } from "adapter";

declare module "@auth/core/types" {
  interface Session extends DefaultSession {
    user?: {
      id: string;
      name: string;
      email: string;
      image: string;
      role: "user" | "admin";
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
  adapter: AstroDBAdapter(),
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
});
