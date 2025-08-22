import { auth } from "@/lib/auth/auth";
import { ChatProvider } from "@/modules/chat/ui/components/chat-context";
import { ChatInput } from "@/modules/chat/ui/components/chat-input";
import { ChatSidebar } from "@/modules/chat/ui/components/chat-sidebar";
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

  return (
    <ChatProvider>
      <div className="h-screen relative flex">
        <ChatSidebar />
        <div className=" w-full h-screen">
          {children}
          <ChatInput />
        </div>
      </div>
    </ChatProvider>
  );
}
