import { authConfig } from "@/auth";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authConfig);

  if (!session?.user) {
    redirect("/signin");
  }

  return <DashboardSidebar user={session.user}>{children}</DashboardSidebar>;
}
