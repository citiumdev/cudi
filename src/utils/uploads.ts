import { put, del, head } from "@vercel/blob";
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
    token: import.meta.env.BLOB_READ_WRITE_TOKEN,
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
    token: import.meta.env.BLOB_READ_WRITE_TOKEN,
  });
};

export const uploadCertificateImage = async ({
  hashKey,
  image,
}: {
  hashKey: string;
  image: Buffer;
}) => {
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    return {
      url: null,
    };
  }

  const blob = await put(`certificates/${hashKey}.png`, image, {
    access: "public",
    token: import.meta.env.BLOB_READ_WRITE_TOKEN,
    addRandomSuffix: false,
  });

  return {
    url: blob.url,
  };
};

export const findCertificateImage = async ({
  hashKey,
}: {
  hashKey: string;
}) => {
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    return {
      url: null,
    };
  }

  try {
    const blob = await head(`certificates/${hashKey}.png`, {
      token: import.meta.env.BLOB_READ_WRITE_TOKEN,
    });

    return {
      url: blob.url,
    };
  } catch (error) {
    return {
      url: null,
    };
  }
};

export const deleteCertificateImage = async ({
  hashKey,
}: {
  hashKey: string;
}) => {
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    return;
  }

  await del(`certificates/${hashKey}.png`, {
    token: import.meta.env.BLOB_READ_WRITE_TOKEN,
  });
};
