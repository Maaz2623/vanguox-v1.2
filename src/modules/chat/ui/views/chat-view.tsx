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
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useModelStore } from "../../hooks/model-store";
import { UIMessage } from "ai";
import { Action } from "@/components/ai-elements/actions";
import { CheckIcon, CopyIcon, RefreshCcwIcon } from "lucide-react";
import { Loader } from "@/components/ai-elements/loader";
import { useChatIdStore } from "../../hooks/chatId-store";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
interface Props {
  previousMessages: UIMessage[];
  chatId: string;
}

export const ChatView = ({ previousMessages, chatId }: Props) => {
  const { chatId: storeChatId, setChatId } = useChatIdStore();
  const { pendingMessage, setPendingMessage } = useChatStore();
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
      sentRef.current = true; // prevent second run
      sendMessage(
        { text: pendingMessage },
        { body: { model: model.id, chatId: chatId } }
      );
      setPendingMessage(null);
    }
  }, [pendingMessage, sendMessage, setPendingMessage, model.id, chatId]);

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
              {messages.map((message) => (
                <div key={message.id}>
                  <Message from={message.role} key={message.id}>
                    <MessageContent
                      className={cn(
                        message.role === "assistant" && "bg-background!"
                      )}
                    >
                      {message.parts.map((part, i) => {
                        switch (part.type) {
                          case "text":
                            return (
                              <div
                                key={`${message.id}-${i}`}
                                className="flex items-start gap-3"
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
                                  <Response className="text-[15px] leading-relaxed max-w-[40vw] overflow-x-auto!">
                                    {part.text}
                                  </Response>
                                  {message.role === "assistant" && (
                                    <div className="flex gap-2 mt-2">
                                      <Action
                                        onClick={() => regenerate()}
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
                                return <div key={i}>Searching the web</div>;
                            }
                          case "tool-imageGenerator":
                            switch (part.state) {
                              case "input-available":
                                return <div key={i}>Generating your image</div>;
                            }
                          case "reasoning":
                            switch (part.state) {
                              case "streaming":
                                return (
                                  <Reasoning
                                    key={`${message.id}-${i}`}
                                    className="w-full"
                                    isStreaming={status === "streaming"}
                                  >
                                    <ReasoningTrigger state={part.state} />
                                    <ReasoningContent className="text-muted-foreground">
                                      {part.text}
                                    </ReasoningContent>
                                  </Reasoning>
                                );
                              case "done":
                                return (
                                  <Reasoning
                                    key={`${message.id}-${i}`}
                                    className="w-full"
                                    isStreaming={status === "streaming"}
                                  >
                                    <ReasoningTrigger state={part.state} />
                                    <ReasoningContent className="text-muted-foreground">
                                      {part.text}
                                    </ReasoningContent>
                                  </Reasoning>
                                );
                            }
                          default:
                            return null;
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
