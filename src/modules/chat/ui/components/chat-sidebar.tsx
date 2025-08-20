"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";

export const ChatSidebar = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
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
    </>
  );
};
