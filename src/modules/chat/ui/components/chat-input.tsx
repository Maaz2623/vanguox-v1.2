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
import { useChat } from "@ai-sdk/react";
import { MicIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export const ChatInput = () => {
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
