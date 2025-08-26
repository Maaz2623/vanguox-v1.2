"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  UIMessage,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai";

interface ChatContextValue {
  messages: UIMessage[];
  sendMessage: ReturnType<typeof useChat>["sendMessage"];
  regenerate: ReturnType<typeof useChat>["regenerate"];
  status: ReturnType<typeof useChat>["status"];
  clearChat: () => void;
  setMessages: ReturnType<typeof useChat>["setMessages"]; // 👈 add this
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);
export function ChatProvider({
  children,
  initialMessages = [],
}: {
  children: ReactNode;
  initialMessages?: UIMessage[];
}) {
  const { messages, sendMessage, regenerate, status, setMessages } = useChat({
    messages: initialMessages,
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
  });

  const clearChat = () => {
    setMessages([]); // reset messages
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        sendMessage,
        regenerate,
        status,
        clearChat,
        setMessages,
      }}
    >
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
