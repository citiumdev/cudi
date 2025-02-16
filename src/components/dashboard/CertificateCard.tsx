"use client";

import { type Certificate } from "@/types/Certificate";
import { Calendar, Clock, Download } from "lucide-react";
import { Button } from "../ui/button";
import useCertificate from "@/hooks/useCertificate";

interface Props {
  certificate: Certificate;
}

export default function CertificateCard({ certificate }: Props) {
  const { image, download } = useCertificate(certificate);

  const parsedDate = new Date(certificate.event.date).toLocaleDateString(
    "es-ES",
    {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hourCycle: "h12",
    },
  );

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border bg-neutral-900">
      <div className="relative aspect-[2000/1414] w-full">
        {image ? <img src={image} alt="Certificado" /> : null}
      </div>
      <div className="flex flex-col gap-2 p-4">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">
          {certificate.event.name}
        </h2>
        <div className="flex items-center gap-2 text-neutral-400">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">{parsedDate}</span>
        </div>
        <div className="flex items-center gap-2 text-neutral-400">
          <Clock className="h-4 w-4" />
          <span className="text-sm">{certificate.event.duration} horas</span>
        </div>
        <Button onClick={download}>
          Descargar <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
