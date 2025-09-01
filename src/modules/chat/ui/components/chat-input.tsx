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
import { MicIcon, PlusIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { useChatStore } from "../../hooks/chat-store";
import { useSharedChatContext } from "./chat-context";
import { useHydratedModel } from "../../hooks/model-store";
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
  const { clearChat, sendMessage, status, stop } = useSharedChatContext();

  const pathname = usePathname();
  const router = useRouter();
  const { setPendingMessage } = useChatStore();

  const createChat = useMutation(api.chats.createConvexChat);
  const { data: authData } = authClient.useSession();

  // 👇 central place for validation
  const canSubmit = text.trim().length > 0 && status !== "streaming"; // only allow when idle

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit) {
      return;
    }

    const trimmed = text.trim();

    // prevent empty, not-ready, or streaming submits
    if (!trimmed || status !== "ready") return;

    if (pathname === "/") {
      if (!authData) return;

      clearChat();
      startTransition(async () => {
        const data = await createChat({ userId: authData.user.id });
        setChatId(data);
        router.push(`/chats/${data}`);
      });

      setPendingMessage(trimmed);
      setText("");
    } else {
      sendMessage(
        { text: trimmed },
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
        "absolute md:w-[70%]  w-[97vw] bg-background px-2 md:px-0 left-1/2 -translate-x-1/2 bottom-[20%] pb-2 transition-all duration-500",
        pathname !== "/" && "bottom-0",
        pathname === "/files" && "hidden",
        pathname === "/settings" && "hidden"
      )}
    >
      <PromptInput onSubmit={handleSubmit} className="bg-foreground/5">
        <PromptInputTextarea
          onChange={(e) => setText(e.target.value)}
          value={text}
          className="py-4 px-4"
        />
        <PromptInputToolbar className="p-2">
          <PromptInputTools>
            <PromptInputButton variant={`secondary`}>
              <PlusIcon size={16} />
            </PromptInputButton>
            {hydrated ? (
              <ModelCombobox
                models={models}
                value={model.id}
                onChange={(selectedModel) => setAiModel(selectedModel)}
              />
            ) : (
              <Skeleton className="w-[150px] h-8 bg-foreground/10" />
            )}
          </PromptInputTools>
          <PromptInputSubmit
            onClick={() => {
              if (status === "streaming") {
                stop();
              }
            }}
            disabled={status === "submitted"}
            status={status}
          />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
};
