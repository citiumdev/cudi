import { type Certificate } from "@/types/certificate";
import { Calendar, Clock, Download, GraduationCap, User } from "lucide-react";
import { Button } from "../ui/button";

interface Props {
  certificate: Certificate;
}

export default function CertificatePageCard({ certificate }: Props) {
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

  const certificateUrl = `/api/certificates/${certificate.id}`;

  return (
    <main>
      <div className="absolute top-0 z-[-2] h-screen w-full bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(140,82,255,0.3),rgba(255,255,255,0))]" />

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
            <img src={certificateUrl} />
          </div>

          <Button asChild variant="outline">
            <a href={certificateUrl + "?pdf=true"} download>
              Descargar <Download className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </main>
  );
}
