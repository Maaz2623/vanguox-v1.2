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
import { models } from "@/constants";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { MicIcon } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useChatStore } from "../../hooks/chat-store";
import { useSharedChatContext } from "./chat-context";

export const ChatInput = () => {
  const [text, setText] = useState<string>("");
  const [model, setModel] = useState<string>(models[0].id);

  const { chat } = useSharedChatContext();

  const { messages, sendMessage, status } = useChat({ chat });

  const pathname = usePathname();

  const router = useRouter();

  const { setPendingMessage } = useChatStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pathname === "/") {
      if (text.trim()) {
        router.push(`/chats/123`);
        setPendingMessage(text);
        setText("");
      }
    } else {
      sendMessage({
        text: text,
      });
      setText("");
    }
  };

  return (
    <div
      className={cn(
        "absolute md:w-[60%] w-full px-2 md:px-0 left-1/2 -translate-x-1/2 bottom-[16%] pb-2 bg-white transition-all duration-500",
        pathname !== "/" && "bottom-0"
      )}
    >
      <PromptInput onSubmit={handleSubmit} className="">
        <PromptInputTextarea
          onChange={(e) => setText(e.target.value)}
          value={text}
          className="py-4 px-4"
        />
        <PromptInputToolbar className="p-2">
          <PromptInputTools>
            <PromptInputButton>
              <MicIcon size={16} />
            </PromptInputButton>
            <PromptInputModelSelect
              onValueChange={(value) => setModel(value)}
              value={model}
            >
              <PromptInputModelSelectTrigger>
                <PromptInputModelSelectValue />
              </PromptInputModelSelectTrigger>
              <PromptInputModelSelectContent>
                {models.map((model) => (
                  <PromptInputModelSelectItem key={model.id} value={model.id}>
                    <div className="flex gap-x-2">
                      <Image
                        src={model.icon}
                        alt={model.name}
                        height={20}
                        width={20}
                        className="rounded-full"
                      />
                      {model.name}
                    </div>
                  </PromptInputModelSelectItem>
                ))}
              </PromptInputModelSelectContent>
            </PromptInputModelSelect>
          </PromptInputTools>
          <PromptInputSubmit disabled={!text} />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
};
