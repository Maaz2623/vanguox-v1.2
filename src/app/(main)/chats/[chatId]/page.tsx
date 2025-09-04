import { loadChat } from "@/ai/functions";
import { db } from "@/db";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth/auth";
import { ChatView } from "@/modules/chat/ui/views/chat-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

interface Props {
  params: Promise<{
    chatId: string;
  }>;
}

const ChatIdPage = async ({ params }: Props) => {
  const authData = await auth.api.getSession({
    headers: await headers(),
  });

  if (!authData) {
    return redirect(`/auth`);
  }

  const { chatId } = await params;

  const previousMessages = await loadChat(chatId);

  const queryClient = getQueryClient();

  const data = await queryClient.fetchQuery(
    trpc.subscription.getCurrentSubscription.queryOptions()
  );

  if (!data) {
    await db.update(user).set({
      maxTokens: 50000,
    });
  }

  return (
    <div className="absolute top-0 left-0 w-full">
      <ChatView previousMessages={previousMessages} chatId={chatId} />
    </div>
  );
};

export default ChatIdPage;
