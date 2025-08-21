"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { models } from "@/constants";
import { useEffect, useRef, useState } from "react";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { useChat } from "@ai-sdk/react";
import { Response } from "@/components/ai-elements/response";
import { useChatStore } from "../../hooks/chat-store";
import { useSharedChatContext } from "../components/chat-context";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useModelStore } from "../../hooks/model-store";
import { DefaultChatTransport } from "ai";

export const ChatView = () => {
  const { chat } = useSharedChatContext();

  const { pendingMessage, setPendingMessage } = useChatStore();

  const { model } = useModelStore();

  const { messages, sendMessage } = useChat({
    chat,
    transport: new DefaultChatTransport({
      api: `/api/chat`,
    }),
  });

  const sentRef = useRef(false);

  useEffect(() => {
    if (pendingMessage && !sentRef.current) {
      sentRef.current = true; // prevent second run
      sendMessage(
        {
          text: pendingMessage,
        },
        {
          body: {
            model: model.id,
          },
        }
      );
      setPendingMessage(null);
    }
  }, [pendingMessage, sendMessage, setPendingMessage]);

  const modelIcon =
    models.find((m) => m.id === model.id)?.icon || "/model-logos/default.avif"; // Default fallback if not found

  return (
    <div className="relative h-screen w-full">
      {/* Main scroll area */}
      <ScrollArea
        className="
          w-full 
          relative
          h-screen 
          mx-auto
        "
      >
        <div className="h-full mx-auto pb-[40vh] w-full md:w-[60%]">
          <Conversation>
            <ConversationScrollButton className="z-[100px]" />

            <ConversationContent>
              {messages.map((message) => (
                <Message from={message.role} key={message.id}>
                  <MessageContent
                    className={cn(
                      "bg-white",
                      message.role === "assistant" && "bg-white!"
                    )}
                  >
                    <div className="flex gap-x-2 items-start">
                      {message.role === "assistant" && (
                        <div className="h-full items-start">
                          <Image
                            src={modelIcon}
                            alt="logo"
                            className="-mt-0.5 rounded-full"
                            width={25}
                            height={25}
                          />
                        </div>
                      )}
                      {message.parts.map((part, i) => {
                        switch (part.type) {
                          case "text": // we don't use any reasoning or tool calls in this example
                            return (
                              <Response key={`${message.id}-${i}`} className="">
                                {part.text}
                              </Response>
                            );
                          default:
                            return null;
                        }
                      })}
                    </div>
                  </MessageContent>
                </Message>
              ))}
            </ConversationContent>
          </Conversation>
        </div>
      </ScrollArea>
    </div>
  );
};
