import { Toaster } from "../ui/toaster";

interface Props {
  children: React.ReactNode;
}

export default function Providers({ children }: Props) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
