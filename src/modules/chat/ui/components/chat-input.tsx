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
import { useModelStore } from "../../hooks/model-store";
import { Model } from "../../hooks/types";
import { DefaultChatTransport } from "ai";

export const ChatInput = () => {
  const [text, setText] = useState<string>("");

  const { setModel: setAiModel, model } = useModelStore();
  const { chat } = useSharedChatContext();
  const { sendMessage, status } = useChat({
    chat,
    transport: new DefaultChatTransport({
      api: `/api/chat`,
    }),
  });

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
      sendMessage(
        {
          text: text,
        },
        {
          body: {
            model: model.id,
          },
        }
      );
      setText("");
    }
  };

  return (
    <div
      className={cn(
        "absolute md:w-[60%] w-full bg-white px-2 md:px-0 left-1/2 -translate-x-1/2 bottom-[16%] pb-2 transition-all duration-500",
        pathname !== "/" && "bottom-0"
      )}
    >
      <PromptInput onSubmit={handleSubmit} className="bg-transparent">
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
              onValueChange={(value) => {
                // Find the model
                const selectedModel = models.find(
                  (model) => model.id === value
                );

                if (selectedModel) {
                  // Type assertion to ensure that selectedModel is of type Model
                  setAiModel(selectedModel as Model);
                }
              }}
              value={model.id}
            >
              <PromptInputModelSelectTrigger>
                <PromptInputModelSelectValue>
                  <div className="flex items-center gap-x-2">
                    <Image
                      src={model.icon}
                      alt={model.name}
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                    {model.name}
                  </div>
                </PromptInputModelSelectValue>
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
          <PromptInputSubmit disabled={!text} status={status} />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
};
