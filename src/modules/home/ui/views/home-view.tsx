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
    <div className=" relative h-screen w-full">
      
    </div>
  );
};
