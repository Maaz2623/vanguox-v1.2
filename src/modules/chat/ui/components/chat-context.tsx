"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  UIMessage,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai";
import { useModelStore } from "../../hooks/model-store";
import { useTRPC } from "@/trpc/client";
import { useQueryClient } from "@tanstack/react-query";

interface ChatContextValue {
  messages: UIMessage[];
  sendMessage: ReturnType<typeof useChat>["sendMessage"];
  regenerate: ReturnType<typeof useChat>["regenerate"];
  status: ReturnType<typeof useChat>["status"];
  clearChat: () => void;
  setMessages: ReturnType<typeof useChat>["setMessages"]; // 👈 add this
  stop: ReturnType<typeof useChat>["stop"];
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);
export function ChatProvider({
  children,
  initialMessages = [],
}: {
  children: ReactNode;
  initialMessages?: UIMessage[];
}) {
  const { model } = useModelStore();

  const queryClient = useQueryClient();

  const trpc = useTRPC();

  const { messages, sendMessage, regenerate, status, setMessages, stop } =
    useChat({
      messages: initialMessages,
      transport: new DefaultChatTransport({
        api: "/api/chat",
        body: {
          model: model.id,
        },
      }),
      sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
      onFinish: async () => {
        queryClient.invalidateQueries(trpc.usage.getUsage.queryOptions());
      },
    });

  const clearChat = () => {
    setMessages([]); // reset messages
  };

  return (
    <ChatContext.Provider
      value={{
        stop,
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
