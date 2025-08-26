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
        <div className="h-[20vh] absolute top-0 right-0 w-[100px] bg-gradient-to-t from-transparent to-background z-50" />
        <div className="h-[20vh] absolute bottom-0 right-0 w-[100px] bg-gradient-to-b from-transparent to-background z-50" />
        <ChatSidebar userId={authData.user.id} />
        <div className=" w-full h-screen">
          {children}
          <ChatInput />
        </div>
      </div>
    </ChatProvider>
  );
}
