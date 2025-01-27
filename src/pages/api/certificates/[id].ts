import type { APIRoute } from "astro";
import nodeCanvas, { createCanvas, Image } from "canvas";
import { JSDOM } from "jsdom";
import path from "node:path";
import QRCodeStyling from "qr-code-styling";
import { certificate, db, eq, event, user } from "astro:db";

export const GET: APIRoute = async ({ params, request }) => {
  const id = params.id as string;

  const isPdf = new URL(request.url).searchParams.get("pdf") === "true";

  const result = await db
    .select()
    .from(certificate)
    .innerJoin(event, eq(certificate.eventId, event.id))
    .innerJoin(user, eq(certificate.userId, user.id))
    .where(eq(certificate.id, id))
    .get();

  if (!result) {
    return new Response(JSON.stringify({ message: "Certificate not found" }), {
      status: 404,
      headers: {
        "content-type": "application/json",
      },
    });
  }

  const name = result.user.name;
  const title = result.event.name;
  const month = new Date(result.event.date).toLocaleDateString("es-ES", {
    month: "long",
  });

  const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);

  const year = new Date(result.event.date).getFullYear();
  const date = `${capitalizedMonth}, ${year}`;

  const url = "cudicoders.dev/c/b3b450fd-2872-4b83-99fa-56b59737048d";

  const canvas = createCanvas(0, 0, isPdf ? "pdf" : undefined);
  const ctx = canvas.getContext("2d");

  const templatePath = path.join(process.cwd(), "/src/assets/certificado.png");
  const signaturePath = path.join(process.cwd(), "/src/assets/signature.png");

  const qrCode = new QRCodeStyling({
    jsdom: JSDOM,
    nodeCanvas,
    width: 152,
    height: 152,
    type: "svg",
    data: "https://" + url,
    dotsOptions: {
      color: "#ffffff",
    },
    backgroundOptions: {
      color: "transparent",
    },
  });

  const [template, qr, signature] = await Promise.all([
    loadImage(templatePath),
    loadImage((await qrCode.getRawData("png")) as Buffer),
    loadImage(signaturePath),
  ]);

  canvas.height = template.height;
  canvas.width = template.width;

  ctx.drawImage(template, 0, 0);

  const scaleFactor = 171 / 96;
  ctx.scale(scaleFactor, scaleFactor);

  ctx.drawImage(qr, 910, 75);

  ctx.drawImage(signature, 871 + 45, 264, 120, 120);
  ctx.drawImage(signature, 871 + 45, 498, 120, 120);

  ctx.fillStyle = "white";
  ctx.font = "bold 30pt Roboto";
  ctx.textBaseline = "top";

  ctx.fillText(name as string, 79, 334);
  ctx.fillText(title, 79, 481);

  ctx.font = "bold 12pt Roboto";
  ctx.fillText(date, 83, 695);
  ctx.fillText(url, 217, 695);

  const contentType = isPdf ? "application/pdf" : "image/png";

  return new Response(canvas.toBuffer(), {
    headers: {
      "Content-Type": contentType,
    },
  });
};

const loadImage = async (src: string | Buffer) => {
  return new Promise<Image>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = src;
  });
};
