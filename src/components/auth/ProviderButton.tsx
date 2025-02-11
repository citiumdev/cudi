"use client";

import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import { Github } from "lucide-react";

interface Props {
  providerId: string;
  providerName: string;
  callbackUrl?: string;
}

export default function ProviderButton({
  providerId,
  providerName,
  callbackUrl,
}: Props) {
  return (
    <Button
      key={providerId}
      variant="outline"
      onClick={() =>
        signIn(providerId, {
          callbackUrl,
        })
      }
    >
      <Github />
      <span>{providerName}</span>
    </Button>
  );
}
