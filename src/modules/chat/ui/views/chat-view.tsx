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

export const ChatView = () => {
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
    <div className="bg-green-500 relative h-screen w-full">
      {/* Hover area */}
      <div
        className="absolute top-0 left-0 bg-pink-500 w-[2%] h-full z-50 cursor-pointer"
        onMouseEnter={() => setOpen(true)}
      ></div>

      {/* Sheet controlled by state */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          overlay={false}
          side="left"
          className="w-[20%]"
          onMouseLeave={() => setOpen(false)}
        >
          <SheetHeader>
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Some sidebar content here...</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      {/* Main scroll area */}
      <ScrollArea
        className="
          w-full 
          relative
          bg-yellow-500 
          h-screen 
          mx-auto
        "
      >
        <div className="w-[60%] bg-amber-800 h-full mx-auto pb-[40vh]">
          <Conversation>
            <ConversationContent>
              {messages.map((message) => (
                <Message from={message.role} key={message.id}>
                  <MessageContent>
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
          <div className="absolute w-[60%] bottom-0 pb-2 bg-white">
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
                        <PromptInputModelSelectItem
                          key={model.id}
                          value={model.id}
                        >
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
        </div>
      </ScrollArea>
    </div>
  );
};
