"use client";

import { type Certificate } from "@/types/Certificate";
import { Calendar, Clock, Download, GraduationCap, User } from "lucide-react";
import { Button } from "../ui/button";
import useCertificate from "@/hooks/useCertificate";
import Gradient from "../Gradient";

interface Props {
  certificate: Certificate;
}

export default function CertificatePageCard({ certificate }: Props) {
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
    <main>
      <Gradient />
      <div className="container mx-auto flex min-h-screen w-full max-w-4xl items-center overflow-y-auto">
        <div className="flex w-full flex-col gap-4 p-4">
          <h1 className="text-4xl font-bold">Certificado Válido</h1>

          <div className="flex w-full flex-col gap-2">
            <div className="flex items-center gap-2 text-neutral-400">
              <User className="h-4 w-4" />
              <span className="text-sm">{certificate.user.name}</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-400">
              <GraduationCap className="h-4 w-4" />
              <span className="text-sm">{certificate.event.name}</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-400">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">{parsedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-400">
              <Clock className="h-4 w-4" />
              <span className="text-sm">
                {certificate.event.duration} horas
              </span>
            </div>
          </div>

          <div className="aspect-[2000/1414] w-full bg-neutral-800 p-2">
            {image ? <img src={image} alt="Certificado" /> : null}
          </div>

          <Button variant="outline" onClick={download}>
            Descargar <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </main>
  );
}
