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
import { startTransition, useState } from "react";
import { useChatStore } from "../../hooks/chat-store";
import { useSharedChatContext } from "./chat-context";
import { useHydratedModel, useModelStore } from "../../hooks/model-store";
import { Model } from "../../hooks/types";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai";
import { api } from "../../../../../convex/_generated/api";
import { useMutation } from "convex/react";
import { authClient } from "@/lib/auth/auth-client";
import { useChatIdStore } from "../../hooks/chatId-store";
import { ModelCombobox } from "@/components/model-combo-box";
import { Skeleton } from "@/components/ui/skeleton";

export const ChatInput = () => {
  const [text, setText] = useState<string>("");

  const { chatId, setChatId } = useChatIdStore();

  const { setModel: setAiModel, model, hydrated } = useHydratedModel();
  const { clearChat, sendMessage, status } = useSharedChatContext();

  const pathname = usePathname();
  const router = useRouter();
  const { setPendingMessage } = useChatStore();

  const createChat = useMutation(api.chats.createConvexChat);

  const { data: authData } = authClient.useSession();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pathname === "/") {
      if (text.trim()) {
        if (!authData) {
          return;
        }
        clearChat();
        startTransition(async () => {
          const data = await createChat({
            userId: authData.user.id,
          });
          console.log("convex:", data);
          // Pass both text + files in query string (files can later be handled in ChatView)
          setChatId(data);
          router.push(`/chats/${data}`);
        });
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
            chatId: chatId,
          },
        }
      );
      setText("");
    }
  };

  return (
    <div
      className={cn(
        "absolute md:w-[60%] w-full bg-background px-2 md:px-0 left-1/2 -translate-x-1/2 bottom-[20%] pb-2 transition-all duration-500",
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
            {hydrated ? (
              <ModelCombobox
                models={models}
                value={model.id}
                onChange={(selectedModel) => setAiModel(selectedModel)}
              />
            ) : (
              <Skeleton className="w-[150px] h-8 bg-neutral-200" />
            )}
            {/* <PromptInputModelSelect
              onValueChange={(value) => {
                // Find the model
                const selectedModel = models.find(
                  (model) => model.id === value
                );

                if (selectedModel) {
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
              <PromptInputModelSelectContent className="max-h-[500px]">
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
            </PromptInputModelSelect> */}
          </PromptInputTools>
          <PromptInputSubmit disabled={!text} status={status} />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
};
