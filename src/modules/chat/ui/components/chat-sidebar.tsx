"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import {
  ClockIcon,
  FilesIcon,
  HistoryIcon,
  PlusIcon,
  SettingsIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth/auth-client";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

export const ChatSidebar = () => {
  const [open, setOpen] = useState(false);

  const { data } = authClient.useSession();

  const [sheetType, setSheetType] = useState<"settings" | "history" | "files">(
    "files"
  );

  if (!data) {
    return;
  }

  return (
    <div
      className="w-[20%] z-50 h-full"
      onMouseLeave={() => {
        setOpen(false);
      }}
    >
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
          <Button variant={`outline`} size={`sm`} asChild>
            <Link href={`/`}>
              <PlusIcon />
            </Link>
          </Button>
          <div className="mt-8 h-full flex flex-col gap-y-2">
            <Button
              onMouseEnter={() => {
                setSheetType("files");
              }}
              variant={`ghost`}
              size={`sm`}
              style={{}}
            >
              <FilesIcon />
            </Button>
            <Button
              variant={`ghost`}
              size={`sm`}
              onMouseEnter={() => {
                setSheetType("history");
              }}
            >
              <HistoryIcon />
            </Button>
          </div>
          <div className="h-full mt-auto flex flex-col justify-end pb-4 gap-y-2">
            <Button
              variant={`ghost`}
              size={`sm`}
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

      {/* Sheet controlled by state */}
      {/* Sheet controlled by state */}
      <div
        className={cn(
          "h-[98vh] w-[15%] border -z-50 absolute left-[4.5vw] top-2 px-2 py-3 rounded-lg bg-background  transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-[50vw]"
        )}
      >
        <h2 className="capitalize text-xl font-medium">{sheetType}</h2>
      </div>
    </div>
  );
};
