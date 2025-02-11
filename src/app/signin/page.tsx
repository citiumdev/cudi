import ProviderButton from "@/components/auth/ProviderButton";
import Logo from "@/components/svg/Logo";
import { getProviders } from "next-auth/react";

export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  const providers = await getProviders();

  return (
    <main className="flex min-h-screen w-full items-center justify-center">
      <div className="absolute top-0 z-[-2] h-screen w-full bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(140,82,255,0.3),rgba(255,255,255,0))]"></div>

      <div className="flex w-[400px] flex-col items-center rounded-md border bg-neutral-950 px-8 py-10">
        <Logo className="size-20 fill-white" />
        <h1 className="mt-2 text-2xl font-bold">Iniciar Sesión</h1>
        <div className="mt-8 flex w-full flex-col">
          {providers
            ? Object.values(providers).map((provider) => (
                <ProviderButton
                  key={provider.id}
                  providerId={provider.id}
                  providerName={provider.name}
                  callbackUrl={callbackUrl}
                />
              ))
            : null}
        </div>
      </div>
    </main>
  );
}
