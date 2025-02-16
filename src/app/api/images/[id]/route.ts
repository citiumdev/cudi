import { readFileSync } from "fs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const imagePath = `./uploads/images/${id}`;

  try {
    const image = readFileSync(imagePath);

    return new Response(image, {
      headers: {
        "content-type": "image/png",
      },
    });
  } catch (e) {
    console.error(e);
    return new Response("Image not found", {
      status: 404,
    });
  }
}
