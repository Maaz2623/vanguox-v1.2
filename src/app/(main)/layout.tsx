import { SidebarProvider } from "@/components/ui/sidebar";
import { db } from "@/db";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth/auth";
import { ChatProvider } from "@/modules/chat/ui/components/chat-context";
import { ChatInput } from "@/modules/chat/ui/components/chat-input";
import { ChatViewSidebar } from "@/modules/chat/ui/components/sidebar/chat-view-sidebar";
import { getQueryClient, trpc } from "@/trpc/server";
import { eq } from "drizzle-orm";
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

  const queryClient = getQueryClient();

  const data = await queryClient.fetchQuery(
    trpc.subscription.getCurrentSubscription.queryOptions()
  );

  if (!data) {
    await db.update(user).set({
      maxTokens: 50000,
    });
  }

  const [usage] = await db
    .select({
      tokensUsed: user.totalTokensUsed,
      maxTokens: user.maxTokens,
    })
    .from(user)
    .where(eq(user.id, authData.user.id));

  const limitReached = usage.tokensUsed >= usage.maxTokens;

  return (
    <ChatProvider>
      <div className="h-screen relative flex">
        <SidebarProvider
          className="bg-background!"
          style={
            {
              // "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <ChatViewSidebar
            auth={true}
            name={authData.user.name}
            email={authData.user.email}
            image={authData.user.image}
            userId={authData.user.id}
            variant="inset"
            className="border-r"
          />
          <div className="h-screen w-full relative">
            {/* <div className="h-[20vh] absolute top-0 right-0 w-[100px] bg-gradient-to-t from-transparent to-background z-40" />
            <div className="h-[20vh] absolute bottom-0 right-0 w-[100px] bg-gradient-to-b from-transparent to-background z-40" /> */}
            {/* <ChatSidebar userId={authData.user.id} /> */}
            <div className=" w-full h-screen">
              {children}
              <ChatInput limitReached={limitReached} />
            </div>
          </div>
        </SidebarProvider>
      </div>
    </ChatProvider>
  );
}
