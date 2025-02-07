import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { db, event, eventPresenters, inArray, user } from "astro:db";
import { authMiddleware } from "@/utils/authMiddleware";
import { uploadEventImage } from "@/utils/uploads";

const postSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("workshop"),
    name: z.string(),
    image: z.instanceof(File),
    date: z.string(),
    duration: z.coerce.number(),
    limit: z.coerce.number().min(0).nullish(),
    presenters: z.string().transform((value) => value.slice(2, -2).split(",")),
  }),
  z.object({
    type: z.literal("talk"),
    name: z.string(),
    image: z.instanceof(File),
    date: z.string(),
    duration: z.coerce.number(),
  }),
]);

export const POST = authMiddleware({
  admin: true,
  handler: async ({ request }) => {
    const formData = await request.formData();
    const body = Object.fromEntries(formData);
    const parseResult = postSchema.safeParse(body);

    if (!parseResult.success) {
      return new Response(
        JSON.stringify({ message: parseResult.error.message }),
        {
          status: 400,
          headers: {
            "content-type": "application/json",
          },
        },
      );
    }

    const parsedBody = parseResult.data;
    const image = parsedBody.image;

    try {
      const { url } = await uploadEventImage({
        filename: uuidv4(),
        image: image,
        type: image.type.split("/")[1],
      });

      const eventResult = await db
        .insert(event)
        .values({
          name: parsedBody.name,
          image: url,
          date: new Date(parsedBody.date).valueOf(),
          duration: parsedBody.duration,
          limit: parsedBody.type === "workshop" ? parsedBody.limit : 0,
          type: parsedBody.type,
        })
        .returning()
        .get();

      if (parsedBody.type === "workshop") {
        const presentersResult = await db
          .select()
          .from(user)
          .where(inArray(user.email, parsedBody.presenters));

        await db.insert(eventPresenters).values(
          presentersResult.map((presenter) => ({
            eventId: eventResult.id,
            userId: presenter.id,
          })),
        );

        return new Response(
          JSON.stringify({
            data: {
              event: eventResult,
              presenters: presentersResult,
            },
          }),
          {
            headers: {
              "content-type": "application/json",
            },
          },
        );
      }

      return new Response(
        JSON.stringify({
          data: {
            event: eventResult,
          },
        }),
        {
          headers: {
            "content-type": "application/json",
          },
        },
      );
    } catch (error) {
      console.log(error);
      return new Response(JSON.stringify({ message: "Error creating event" }), {
        status: 500,
        headers: {
          "content-type": "application/json",
        },
      });
    }
  },
});
