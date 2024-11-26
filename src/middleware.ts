import { defineMiddleware } from "astro:middleware";
import { getSession } from "auth-astro/server";

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.url.pathname.startsWith("/dashboard")) {
    const session = await getSession(context.request);

    if (!session) {
      return Response.redirect(new URL("/api/auth/signin", context.url), 302);
    }
  }

  return next();
});
