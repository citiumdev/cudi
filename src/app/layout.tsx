import type { Metadata } from "next";
import "./globals.css";
import "@fontsource-variable/roboto-flex";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "CUDI",
  description: "Comunidad Universitaria Desarrollo e Innovación",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={"antialiased dark"}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
