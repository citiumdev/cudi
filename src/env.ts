import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    NEXTAUTH_SECRET: z.string().min(1),
    DB_URL: z.string().min(1),
    DB_TOKEN: z.string().min(1),
    BLOB_READ_WRITE_TOKEN: z.string().min(1),
  },
  experimental__runtimeEnv: {},
});
