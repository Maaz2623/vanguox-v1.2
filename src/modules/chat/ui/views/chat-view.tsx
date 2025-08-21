"use client";
import {
  PromptInput,
  PromptInputButton,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { models } from "@/constants";
import { MicIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { useChat } from "@ai-sdk/react";
import { Response } from "@/components/ai-elements/response";
import { useChatStore } from "../../hooks/chat-store";
import { useSharedChatContext } from "../components/chat-context";
import { cn } from "@/lib/utils";

export const ChatView = () => {
  const [open, setOpen] = useState(false);

  const { chat } = useSharedChatContext();

  const [text, setText] = useState<string>("");
  const [model, setModel] = useState<string>(models[0].id);

  const { pendingMessage, setPendingMessage } = useChatStore();

  const { messages, sendMessage, status } = useChat({ chat });

  const sentRef = useRef(false);

  useEffect(() => {
    if (pendingMessage && !sentRef.current) {
      sentRef.current = true; // prevent second run
      sendMessage({
        text: pendingMessage,
      });
      setPendingMessage(null);
    }
  }, [pendingMessage, sendMessage, setPendingMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      sendMessage({ text: text });
      setText("");
    }
  };

  return (
    <div className="relative h-screen w-full">
      {/* Hover area */}
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
            <ConversationContent>
              {messages.map((message) => (
                <Message from={message.role} key={message.id}>
                  <MessageContent
                    className={cn(
                      "bg-white",
                      message.role === "assistant" && "bg-white!"
                    )}
                  >
                    {message.parts.map((part, i) => {
                      switch (part.type) {
                        case "text": // we don't use any reasoning or tool calls in this example
                          return (
                            <Response key={`${message.id}-${i}`}>
                              {part.text}
                            </Response>
                          );
                        default:
                          return null;
                      }
                    })}
                  </MessageContent>
                </Message>
              ))}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>
        </div>
      </ScrollArea>
    </div>
  );
};
