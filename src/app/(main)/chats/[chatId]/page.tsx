import { loadChat } from "@/ai/functions";
import { ChatViewSiteHeader } from "@/modules/chat/ui/components/sidebar/chat-view-site-header";
import { ChatView } from "@/modules/chat/ui/views/chat-view";
import React from "react";

interface Props {
  params: Promise<{
    chatId: string;
  }>;
}

const ChatIdPage = async ({ params }: Props) => {
  const { chatId } = await params;

  const previousMessages = await loadChat(chatId);


  return (
    <div className="absolute top-0 left-0 w-full">
     

      <ChatView previousMessages={previousMessages} chatId={chatId} />
    </div>
  );
};

export default ChatIdPage;
