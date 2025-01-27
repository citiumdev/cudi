import { type Certificate } from "@/types/certificate";
import { Calendar, Clock, Download } from "lucide-react";
import { Button } from "../ui/button";

interface Props {
  certificate: Certificate;
}

export default function CertificateCard({ certificate }: Props) {
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
    <div className="flex flex-col overflow-hidden rounded-lg border bg-neutral-900">
      <div className="aspect-[2000/1414] w-full">
        <img src={certificateUrl} />
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
        <Button asChild>
          <a href={certificateUrl + "?pdf=true"} download>
            Descargar <Download className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}
