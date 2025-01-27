import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { outputFileSync } from "fs-extra/esm";
import { db, event, eventPresenters, inArray, user } from "astro:db";
import { authMiddleware } from "@/utils/authMiddleware";

const postSchema = z.object({
  name: z.string(),
  image: z.instanceof(File),
  date: z.string(),
  duration: z.coerce.number(),
  presenters: z.string().transform((value) => value.slice(2, -2).split(",")),
});

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
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const imageName = `${uuidv4()}.${image.type.split("/")[1]}`;
    const imagePath = `./uploads/images/${imageName}`;
    const imageUrl = `/api/images/${imageName}`;

    try {
      outputFileSync(imagePath, buffer);
    } catch (error) {
      return new Response(JSON.stringify({ message: "Error saving image" }), {
        status: 500,
        headers: {
          "content-type": "application/json",
        },
      });
    }

    const eventResult = await db
      .insert(event)
      .values({
        name: parsedBody.name,
        image: imageUrl,
        date: new Date(parsedBody.date).valueOf(),
        duration: parsedBody.duration,
      })
      .returning()
      .get();

    const presentersResult = await db
      .select()
      .from(user)
      .where(inArray(user.email, parsedBody.presenters));

    presentersResult.forEach(async (presenter) => {
      await db.insert(eventPresenters).values({
        eventId: eventResult.id,
        userId: presenter.id,
      });
    });

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
  },
});
