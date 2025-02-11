import { env } from "@/env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/database/index.ts",
  dialect: "turso",
  dbCredentials: {
    url: env.DB_URL,
    authToken: env.DB_TOKEN,
  },
});
