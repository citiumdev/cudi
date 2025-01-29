import GitHub from "@auth/core/providers/github";
import { defineConfig } from "auth-astro";
import type { User } from "@/types/user";
import { AstroDBAdapter } from "adapter";
import type { Provider } from "@auth/core/providers";

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

const providers: Provider[] = [
  GitHub({
    clientId: import.meta.env.GITHUB_CLIENT_ID,
    clientSecret: import.meta.env.GITHUB_CLIENT_SECRET,
  }),
];

export const providersMap = providers
  .map((provider) => {
    if (typeof provider === "function") {
      const providerData = provider();
      return { id: providerData.id, name: providerData.name };
    } else {
      return { id: provider.id, name: provider.name };
    }
  })
  .filter((provider) => provider.id !== "credentials");

export default defineConfig({
  providers,
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
  pages: {
    signIn: "/signin",
  },
});
