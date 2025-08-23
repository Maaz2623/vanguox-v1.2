"use client";

import React, { createContext, useContext, ReactNode, useState } from "react";
import { Chat } from "@ai-sdk/react";
import { DefaultChatTransport, UIMessage } from "ai";

interface ChatContextValue {
  chat: Chat<UIMessage>;
  clearChat: () => void;
  initialMessages: UIMessage[];
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

function createChat(initialMessages: UIMessage[] = []) {
  return new Chat<UIMessage>({
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });
}

export function ChatProvider({
  children,
  initialMessages = [],
}: {
  children: ReactNode;
  initialMessages?: UIMessage[];
}) {
  const [chat, setChat] = useState(() => createChat(initialMessages));

  const clearChat = () => {
    setChat(createChat(initialMessages)); // reset back to initial messages
  };

  return (
    <ChatContext.Provider value={{ chat, clearChat, initialMessages }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useSharedChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useSharedChatContext must be used within a ChatProvider");
  }
  return context;
}
