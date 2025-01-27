import type { APIRoute } from "astro";
import { readFileSync } from "fs";

export const GET: APIRoute = async ({ params }) => {
  const imageName = params.name as string;
  const imagePath = `./uploads/images/${imageName}`;

  try {
    const image = readFileSync(imagePath);

    return new Response(image, {
      headers: {
        "content-type": "image/png",
      },
    });
  } catch (error) {
    return new Response("Image not found", {
      status: 404,
    });
  }
};
