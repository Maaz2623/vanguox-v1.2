"use client";

import { cn } from "@/lib/utils";
import { type ComponentProps, memo } from "react";
import { Streamdown } from "streamdown";
import { CodeBlock, CodeBlockCopyButton } from "./code-block";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

type ResponseProps = ComponentProps<typeof Streamdown>;

export const Response = memo(
  ({ className, ...props }: ResponseProps) => (
    <Streamdown
      components={{
        table: ({ className, ...props }) => (
          <ScrollArea className="overflow-x-auto border rounded-md max-w-[40vw]">
            <table className={cn("", className)} {...props} />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        ),
      }}
      className={cn(
        "size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        className
      )}
      {...props}
    />
  ),

  (prevProps, nextProps) => prevProps.children === nextProps.children
);

Response.displayName = "Response";
