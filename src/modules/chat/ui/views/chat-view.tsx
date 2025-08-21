"use client";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { models } from "@/constants";
import { useEffect, useRef, useState } from "react";
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/components/ai-elements/message";
import { useChat } from "@ai-sdk/react";
import { Response } from "@/components/ai-elements/response";
import { useChatStore } from "../../hooks/chat-store";
import { useSharedChatContext } from "../components/chat-context";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useModelStore } from "../../hooks/model-store";
import { DefaultChatTransport } from "ai";
import { Action, Actions } from "@/components/ai-elements/actions";
import {
  CheckIcon,
  CopyIcon,
  RefreshCcwIcon,
  ThumbsUpIcon,
} from "lucide-react";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Loader } from "@/components/ai-elements/loader";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/source";
import { ChatInput } from "../components/chat-input";
import { Button } from "@/components/ui/button";

export const ChatView = () => {
  const { chat } = useSharedChatContext();
  const { pendingMessage, setPendingMessage } = useChatStore();
  const { model } = useModelStore();

  const { messages, sendMessage, regenerate, status } = useChat({
    chat,
    transport: new DefaultChatTransport({
      api: `/api/chat`,
    }),
  });

  const sentRef = useRef(false);

  useEffect(() => {
    if (pendingMessage && !sentRef.current) {
      sentRef.current = true; // prevent second run
      sendMessage({ text: pendingMessage }, { body: { model: model.id } });
      setPendingMessage(null);
    }
  }, [pendingMessage, sendMessage, setPendingMessage, model.id]);

  const modelIcon =
    models.find((m) => m.id === model.id)?.icon || "/model-logos/default.avif";

  const modelName = models.find((m) => m.name === model.name)?.name || "Gpt-4o";

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="mx-auto relative size-full h-screen w-full overflow-hidden">
      <div className="flex flex-col h-screen overflow-hidden">
        <Conversation className="max-h-screen  overflow-hidden  w-full">
          <ConversationContent className="w-[60%] mx-auto">
            <div className="h-full pb-[40vh] z-50">
              {messages.map((message, messageIndex) => (
                <Message from={message.role} key={message.id}>
                  <MessageContent
                    className={cn(message.role === "assistant" && "bg-white!")}
                  >
                    {message.parts.map((part, i) => {
                      switch (part.type) {
                        case "text":
                          const isLastMessage =
                            messageIndex === messages.length - 1;
                          return (
                            <div key={`${message.id}-${i}`}>
                              <Response>{part.text}</Response>
                              <div className="h-12 mt-2 w-full">
                                <Actions className="  ">
                                  <Action
                                    onClick={() => regenerate()}
                                    label="Retry"
                                  >
                                    <RefreshCcwIcon className="size-3" />
                                  </Action>
                                  <Action
                                    onClick={() =>
                                      navigator.clipboard.writeText(part.text)
                                    }
                                    label="Copy"
                                  >
                                    <CopyIcon className="size-3" />
                                  </Action>
                                </Actions>
                              </div>
                            </div>
                          );
                        default:
                          return null;
                      }
                    })}
                  </MessageContent>
                </Message>
              ))}
              {status === "submitted" && <Loader />}
            </div>
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      </div>
    </div>
  );
};
