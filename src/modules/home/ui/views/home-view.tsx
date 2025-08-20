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

export const HomeView = () => {
  const [open, setOpen] = useState(false);

  const [text, setText] = useState<string>("");
  const [model, setModel] = useState<string>(models[0].id);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(text);
    setText("");
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
          sm:w-[90%] 
          md:w-[80%] 
          lg:w-[70%] 
          xl:w-[60%] 
          bg-yellow-500 
          h-screen 
          mx-auto
        "
      >
        <div className="absolute w-full bottom-0 pb-2">
          <PromptInput onSubmit={handleSubmit} className="mt-4">
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
      </ScrollArea>
    </div>
  );
};
