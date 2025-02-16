import { env } from "@/env";
import { put, del } from "@vercel/blob";
import { outputFileSync } from "fs-extra/esm";

export const uploadEventImage = async ({
  filename,
  image,
  type,
}: {
  filename: string;
  image: File;
  type: string;
}) => {
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const imageName = `${filename}.${type}`;
    const imagePath = `./uploads/images/${imageName}`;
    const imageUrl = `/api/images/${imageName}`;

    outputFileSync(imagePath, buffer);

    return {
      url: imageUrl,
    };
  }

  const { url } = await put(`events/${filename}.${type}`, image, {
    access: "public",
    token: env.BLOB_READ_WRITE_TOKEN,
  });

  return {
    url,
  };
};

export const deleteEventImage = async ({ url }: { url: string }) => {
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    return;
  }

  await del(url, {
    token: env.BLOB_READ_WRITE_TOKEN,
  });
};
