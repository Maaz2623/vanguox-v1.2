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
import { useState } from "react";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { useChat } from "@ai-sdk/react";
import { Response } from "@/components/ai-elements/response";

export const HomeView = () => {
  const [open, setOpen] = useState(false);

  const [text, setText] = useState<string>("");
  const [model, setModel] = useState<string>(models[0].id);

  const { messages, sendMessage, status } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      sendMessage({ text: text });
      setText("");
    }
  };

  return (
    <div className="relative h-screen w-full flex items-starts justify-center">
      <div className={("flex flex-col items-center text-center mt-[30vh] md:mt-[15%]")}>
        <Image
          alt="logo"
          src="/globe.svg"
          width={100}
          height={100}
          className="mb-4 w-[100px]"
        />
        <h1 className="md:text-4xl text-2xl font-semibold">Welcome to Vanguox</h1>
        <p className="text-muted-foreground md:text-base text-sm  ">How can I help you today?</p>
      </div>
    </div>
  );
};
