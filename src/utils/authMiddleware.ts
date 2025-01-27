import type { APIRoute } from "astro";
import { getSession } from "auth-astro/server";

export const authMiddleware = ({
  admin,
  handler,
}: {
  admin: boolean;
  handler: APIRoute;
}): APIRoute => {
  const middleware: APIRoute = async (context) => {
    const session = await getSession(context.request);

    if (!session || !session.user || (admin && session.user.role !== "admin")) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: {
          "content-type": "application/json",
        },
      });
    }

    return handler(context);
  };

  return middleware;
};
