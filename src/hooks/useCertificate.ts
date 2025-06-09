import type { Certificate } from "@/types/Certificate";
import { useCallback, useEffect, useState } from "react";
import TemplateImage from "@/assets/template.png";
import QRCodeStyling from "qr-code-styling";
import { jsPDF } from "jspdf";

import SignatureImage0 from "@/assets/signatures/fallback.png";
import SignatureImage1 from "@/assets/signatures/1c4cbab1-a6ee-4a8c-82c9-8f0b586f460b.png";
import SignatureImage2 from "@/assets/signatures/65e3e7d2-f40f-4bd4-9088-55dbdad7d93a.png";

const signatures = {
  "1c4cbab1-a6ee-4a8c-82c9-8f0b586f460b": SignatureImage1,
  "65e3e7d2-f40f-4bd4-9088-55dbdad7d93a": SignatureImage2,
};

export default function useCertificate(certificate: Certificate) {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [image, setImage] = useState<string | null>(null);

  const textWithMetrics = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      text: string,
      x: number,
      y: number,
      split = false,
    ) => {
      const metrics = ctx.measureText(text);
      const height =
        metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;

      if (split) {
        const width = metrics.width;
        if (width > 622) {
          const words = text.split(" ");
          const half = Math.floor(words.length / 2);
          const firstHalf = words.slice(0, half).join(" ");
          const secondHalf = words.slice(half).join(" ");
          textWithMetrics(ctx, firstHalf, x, y);
          textWithMetrics(ctx, secondHalf, x, y + height + 10);
          return;
        }
      }

      ctx.fillText(text, x, y + height);
    },
    [],
  );

  const getSignature = (presenterId: string) => {
    return (
      signatures[presenterId as keyof typeof signatures] || SignatureImage0
    );
  };

  const loadImage = async (src: string | Blob) => {
    return new Promise<HTMLImageElement>((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);

      if (src instanceof Blob) {
        img.src = URL.createObjectURL(src);
        return;
      }

      img.src = src;
    });
  };

  useEffect(() => {
    setCanvas(document.createElement("canvas"));
  }, []);

  useEffect(() => {
    if (!canvas) {
      return;
    }

    (async () => {
      const name = certificate.user.name;
      const title = certificate.event.name;
      const month = new Date(certificate.event.date).toLocaleDateString(
        "es-ES",
        {
          month: "long",
        },
      );

      const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);

      const year = new Date(certificate.event.date).getFullYear();
      const date = `${capitalizedMonth}, ${year}`;

      const url = `cudicoders.dev/c/${certificate.id}`;

      const presenter = certificate.presenters[0].name;
      const presenterSignature = getSignature(certificate.presenters[0].id);

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;

      const qrCode = new QRCodeStyling({
        width: 160,
        height: 160,
        margin: 0,
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
        loadImage(TemplateImage.src),
        loadImage((await qrCode.getRawData("png")) as Blob),
        loadImage(presenterSignature.src),
      ]);

      canvas.height = template.height;
      canvas.width = template.width;

      ctx.drawImage(template, 0, 0);

      const scaleFactor = 171 / 96; // template PPI / canvas PPI
      ctx.scale(scaleFactor, scaleFactor);

      ctx.drawImage(qr, 902, 67);

      const signatureRatio = signature.width / signature.height;
      const signatureHeight = 52;
      const signatureWidth = signatureRatio * signatureHeight;
      ctx.drawImage(
        signature,
        977 - signatureWidth / 2,
        680 - signatureHeight,
        signatureWidth,
        signatureHeight,
      );

      ctx.fillStyle = "white";
      ctx.textBaseline = "bottom";

      ctx.font = "700 30.4pt Roboto Flex Variable";
      textWithMetrics(ctx, name, 79, 339);
      textWithMetrics(ctx, title, 79, 474);

      ctx.font = "700 12pt Roboto Flex Variable";
      textWithMetrics(ctx, date, 79, 695);
      textWithMetrics(ctx, url, 250, 695);

      ctx.font = "700 9pt Roboto Flex Variable";
      ctx.textAlign = "center";
      textWithMetrics(ctx, presenter, 977, 684);

      setImage(canvas.toDataURL("image/png"));
    })();
  }, [canvas, certificate, textWithMetrics]);

  const download = async () => {
    if (!image) return;

    const loadedImage = await loadImage(image);

    const pdf = new jsPDF("landscape", "px", [
      loadedImage.width,
      loadedImage.height,
    ]);

    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();

    pdf.addImage(loadedImage.src, "PNG", 0, 0, width, height);
    pdf.save("certificado.pdf");
  };

  return {
    image,
    download,
  };
}
