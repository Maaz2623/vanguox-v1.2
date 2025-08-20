import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authData = await auth.api.getSession({
    headers: await headers(),
  });

  if (!authData) {
    redirect(`/auth`);
  }

  return <div className="max-h-screen">{children}</div>;
}
