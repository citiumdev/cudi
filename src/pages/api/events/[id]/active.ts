import { authMiddleware } from "@/utils/authMiddleware";
import { db, eq, event } from "astro:db";

export const POST = authMiddleware({
  admin: true,
  handler: async ({ params }) => {
    const id = params.id as string;

    try {
      const currentEvent = await db
        .select()
        .from(event)
        .where(eq(event.id, id))
        .get();

      if (!currentEvent) {
        return new Response(JSON.stringify({ message: "Event not found" }), {
          status: 404,
          headers: {
            "content-type": "application/json",
          },
        });
      }

      if (currentEvent.active) {
        return new Response(
          JSON.stringify({ message: "Event already marked as active" }),
          {
            status: 400,
            headers: {
              "content-type": "application/json",
            },
          },
        );
      }

      await db.update(event).set({ active: true }).where(eq(event.id, id));

      return new Response(
        JSON.stringify({
          message: "Event marked as active",
        }),
        {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        },
      );
    } catch (error) {
      console.log(error);

      return new Response(
        JSON.stringify({ message: "Error marking event as active" }),
        {
          status: 500,
          headers: {
            "content-type": "application/json",
          },
        },
      );
    }
  },
});
