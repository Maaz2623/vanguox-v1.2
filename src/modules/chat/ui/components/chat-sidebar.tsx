"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FilesIcon, HistoryIcon, PlusIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth/auth-client";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePathname } from "next/navigation";
import { useChatIdStore } from "../../hooks/chatId-store";

interface Props {
  userId: string;
}

export const ChatSidebar = ({ userId }: Props) => {
  const [open, setOpen] = useState(false);

  const { data } = authClient.useSession();

  const [sheetType, setSheetType] = useState<"settings" | "history" | "files">(
    "files"
  );

  const { setChatId } = useChatIdStore();

  const chats = useQuery(api.chats.getChats, {
    userId: userId,
  });

  const pathname = usePathname();

  if (!data) {
    return null;
  }

  return (
    <div
      className="w-[20%] z-50 h-full"
      onMouseLeave={() => {
        setOpen(false);
      }}
    >
      {/* Sidebar icons */}
      <div
        onMouseEnter={() => {
          setOpen(true);
        }}
        className="absolute top-0 left-0 border-r flex flex-col w-[0.5%] md:w-[4vw] bg-background h-full "
      >
        <Image
          src={`/logo.png`}
          width={400}
          height={300}
          className="w-[100px]"
          alt="logo"
        />

        <div className="h-full mt-4 mx-auto flex flex-col z-50">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/`}>
              <PlusIcon />
            </Link>
          </Button>
          <div className="mt-8 h-full flex flex-col gap-y-2">
            <Button
              onMouseEnter={() => {
                setSheetType("files");
              }}
              variant="ghost"
              size="sm"
            >
              <FilesIcon />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onMouseEnter={() => {
                setSheetType("history");
              }}
            >
              <HistoryIcon />
            </Button>
          </div>
          <div className="h-full mt-auto flex flex-col justify-end pb-4 gap-y-2">
            <Button
              variant="ghost"
              size="sm"
              onMouseEnter={() => {
                setSheetType("settings");
              }}
            >
              <SettingsIcon />
            </Button>
            <Avatar className="mx-auto size-8">
              {data && data.user.image && (
                <AvatarImage src={data?.user.image} />
              )}
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* 🔹 Slide-in sheet */}
      <div
        className={cn(
          "h-[98vh] w-[15%] border -z-50 absolute left-[4.5vw] top-2 px-2 py-3 rounded-lg bg-background  transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-[50vw]"
        )}
      >
        {/* History Sheet */}
        {sheetType === "history" && (
          <div className="w-full h-full flex flex-col gap-y-2">
            <div className="flex gap-x-1 items-center">
              <HistoryIcon className="size-5" />
              <h2 className="text-xl">History</h2>
            </div>
            <Separator />
            <ScrollArea className="flex flex-col h-[90vh] overflow-hidden space-y-2">
              {chats?.map((item) => {
                const isActive = pathname === `/chats/${item._id}`;
                return (
                  <Button
                    key={item._id}
                    className={cn(
                      "",
                      isActive && "bg-neutral-500/10 font-semibold"
                    )}
                    variant="ghost"
                    onClick={() => {
                      setChatId(item._id);
                    }}
                    asChild
                  >
                    <Link href={`/chats/${item._id}`}>
                      <span className="w-[150px] truncate">{item.title}</span>
                    </Link>
                  </Button>
                );
              })}
            </ScrollArea>
          </div>
        )}

        {/* Files Sheet (Dummy Data) */}
        {sheetType === "files" && (
          <div className="w-full h-full flex flex-col gap-y-2">
            <div className="flex gap-x-1 items-center">
              <FilesIcon className="size-5" />
              <h2 className="text-xl">Files</h2>
            </div>
            <Separator />
            <ScrollArea className="flex flex-col h-[90vh] space-y-2">
              {["resume.pdf", "design.png", "notes.txt"].map((file, i) => (
                <Button key={i} variant="ghost" className="justify-start">
                  {file}
                </Button>
              ))}
            </ScrollArea>
          </div>
        )}

        {/* Settings Sheet (Dummy Data) */}
        {sheetType === "settings" && (
          <div className="w-full h-full flex flex-col gap-y-2">
            <div className="flex gap-x-1 items-center">
              <SettingsIcon className="size-5" />
              <h2 className="text-xl">Settings</h2>
            </div>
            <Separator />
            <ScrollArea className="flex flex-col h-[90vh] space-y-2">
              {["Profile", "Preferences", "Billing"].map((item, i) => (
                <Button key={i} variant="ghost" className="justify-start">
                  {item}
                </Button>
              ))}
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
};
