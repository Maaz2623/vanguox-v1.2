"use client";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { models } from "@/constants";
import { useEffect, useRef, useState } from "react";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";
import { useChatStore } from "../../hooks/chat-store";
import { useSharedChatContext } from "../components/chat-context";
import { cn, convertFileToDataURL, sanitizeText } from "@/lib/utils";
import Image from "next/image";
import { useModelStore } from "../../hooks/model-store";
import { UIMessage } from "ai";
import { Action } from "@/components/ai-elements/actions";
import { CheckIcon, CopyIcon, FileIcon, RefreshCcwIcon } from "lucide-react";
import { Loader } from "@/components/ai-elements/loader";
import { useChatIdStore } from "../../hooks/chatId-store";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChatViewSiteHeader } from "../components/sidebar/chat-view-site-header";
interface Props {
  previousMessages: UIMessage[];
  chatId: string;
}

export const ChatView = ({ previousMessages, chatId }: Props) => {
  const { chatId: storeChatId, setChatId } = useChatIdStore();
  const {
    pendingMessage,
    setPendingMessage,
    pendingFile,
    setPendingFile,
    fileUrl,
    setFileUrl,
  } = useChatStore();
  const { model } = useModelStore();

  const { messages, sendMessage, regenerate, status, setMessages } =
    useSharedChatContext();

  useEffect(() => {
    if (previousMessages?.length) {
      setMessages(previousMessages); // directly set into Chat instance
    }
  }, [previousMessages, chatId]);
  const sentRef = useRef(false);

  useEffect(() => {
    if (!storeChatId) {
      setChatId(chatId);
    }

    if (pendingMessage && !sentRef.current) {
      sentRef.current = true;

      const send = async () => {
        const fileParts =
          pendingFile && fileUrl
            ? [await convertFileToDataURL(pendingFile, fileUrl)]
            : [];
        sendMessage(
          {
            role: "user",
            parts: [{ type: "text", text: pendingMessage }, ...fileParts],
          },
          { body: { model: model.id, chatId: chatId } }
        );

        setPendingMessage(null);
        setPendingFile(null);
        setFileUrl(null);
      };

      send();
    }
  }, [
    pendingMessage,
    pendingFile,
    sendMessage,
    setPendingMessage,
    setPendingFile,
    model.id,
    chatId,
  ]);

  const modelIcon =
    models.find((m) => m.id === model.id)?.icon || "/model-logos/default.avif";

  const modelName = models.find((m) => m.name === model.name)?.name || "Gpt-4o";

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const isMobile = useIsMobile();

  const { open } = useSidebar();

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const safeRegenerate = () => {
    // Only regenerate if the last assistant message has valid content
    const lastAssistant = [...messages]
      .reverse()
      .find((m) => m.role === "assistant");

    if (
      !lastAssistant ||
      !lastAssistant.parts?.some((p) => p.type === "text" && p.text.trim())
    ) {
      console.warn(
        "Cannot regenerate: last assistant message has no text content."
      );
      return;
    }

    regenerate();
  };

  return (
    <div className="mx-auto relative size-full h-screen w-full overflow-hidden">
      {!isMobile && (
        <SidebarTrigger className="absolute top-5 left-5 z-[1000] size-8" />
      )}
      {isMobile && <ChatViewSiteHeader chatId={chatId} />}
      <div className="flex flex-col h-screen overflow-hidden">
        <Conversation className="max-h-screen  overflow-hidden  w-full">
          <ConversationContent
            className={cn("w-[70%] mx-auto", isMobile && "w-full")}
          >
            <div className="h-full pb-[40vh] z-50">
              {messages.map((message) => (
                <div key={message.id}>
                  <Message from={message.role} key={message.id}>
                    <MessageContent
                      className={cn(
                        "bg-transparent!",
                        message.role === "assistant" && "bg-background!"
                      )}
                    >
                      {[...message.parts].reverse().map((part, i) => {
                        switch (part.type) {
                          case "file":
                            return (
                              <div
                                key={`${message.id}-file-${i}`}
                                className="flex mb-2 items-center gap-2 border px-1 py-1 rounded-lg text-sm shadow-sm max-w-[200px] h-[40px] bg-muted justify-start w-[150px]"
                              >
                                {/* show file icon based on mediaType */}
                                {part.mediaType.startsWith("image/") ? (
                                  <Image
                                    src={part.url}
                                    alt="uploaded file"
                                    width={40}
                                    height={40}
                                    className="rounded-md object-cover"
                                  />
                                ) : (
                                  <FileIcon className="size-5" />
                                )}
                                <p className="text-md mx-auto text-muted-foreground">
                                  {part.mediaType}
                                </p>
                              </div>
                            );
                          case "reasoning":
                            return (
                              <Reasoning
                                key={`${message.id}-${i}`}
                                className="w-full"
                                isStreaming={status === "streaming"}
                              >
                                <ReasoningTrigger />
                                <ReasoningContent>{part.text}</ReasoningContent>
                              </Reasoning>
                            );
                          case "text":
                            return (
                              <div
                                key={`${message.id}-${i}`}
                                className={cn(
                                  "flex items-start gap-3",
                                  message.role === "user" && " justify-end px-2"
                                )}
                              >
                                {message.role === "assistant" && (
                                  <Image
                                    src={modelIcon}
                                    width={25}
                                    height={25}
                                    alt="model-logo"
                                    className="rounded-full shrink-0"
                                  />
                                )}
                                {/* Right: Text + Actions */}
                                <div className="flex flex-col mt-0 gap-y-2">
                                  {message.role === "assistant" && (
                                    <span className="text-base text-muted-foreground font-semibold">
                                      {modelName}
                                    </span>
                                  )}
                                  <Response
                                    className={cn(
                                      "text-[16px] leading-relaxed max-w-[40vw]! overflow-x-auto!",
                                      message.role === "user" &&
                                        "dark:bg-primary/20! px-3 py-2 text-[16px] !rounded-tl-2xl !rounded-tr-2xl !rounded-bl-2xl !rounded-br-none",
                                      isMobile && "text-[14px] max-w-[60vw]!",
                                      open && !isMobile && "max-w-[35vw]!"
                                    )}
                                  >
                                    {sanitizeText(part.text)}
                                  </Response>
                                  {message.role === "assistant" && (
                                    <div className="flex gap-2 mt-2 mb-4">
                                      <Action
                                        onClick={safeRegenerate}
                                        label="Retry"
                                      >
                                        <RefreshCcwIcon className="size-3.5" />
                                      </Action>
                                      <Action
                                        onClick={() =>
                                          handleCopy(
                                            `${message.id}-${i}`,
                                            part.text
                                          )
                                        }
                                        label="Copy"
                                      >
                                        {copiedId === `${message.id}-${i}` ? (
                                          <CheckIcon className="size-3.5" />
                                        ) : (
                                          <CopyIcon className="size-3.5" />
                                        )}{" "}
                                      </Action>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          case "tool-appBuilder":
                            switch (part.state) {
                              case "input-available":
                                return <div key={i}>Building your app..</div>;
                              case "output-available":
                                return <div key={i}>Built</div>;
                            }
                          case "tool-webSearcher":
                            switch (part.state) {
                              case "input-available":
                                return (
                                  <div key={i} className="animate-pulse">
                                    Searching the web
                                  </div>
                                );
                            }
                          case "tool-imageGenerator":
                            switch (part.state) {
                              case "input-available":
                                return (
                                  <div key={i} className="animate-pulse">
                                    Generating your image
                                  </div>
                                );
                            }
                        }
                      })}
                    </MessageContent>
                  </Message>
                </div>
              ))}
              {status === "submitted" && <Loader className="ml-5 mt-5" />}
            </div>
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      </div>
    </div>
  );
};
