"use client";

import { cn } from "@/lib/utils";
import { type ComponentProps, memo } from "react";
import { Streamdown } from "streamdown";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

type ResponseProps = ComponentProps<typeof Streamdown>;

export const Response = memo(
  ({ className, ...props }: ResponseProps) => (
    <Streamdown
      components={{
        a: ({ href, children, className, ...props }) => {
          if (typeof href === "string") {
            // ---- Spotify embed ----
            if (href.includes("open.spotify.com")) {
              const embedUrl = href.replace(
                "open.spotify.com/",
                "open.spotify.com/embed/"
              );
              return (
                <iframe
                  style={{ borderRadius: "12px" }}
                  src={embedUrl}
                  width="100%"
                  height="152"
                  className="my-3"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              );
            }

            // ---- YouTube embed ----
            const ytMatch = href.match(
              /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/
            );
            if (ytMatch) {
              const videoId = ytMatch[1];
              return (
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  width="560"
                  height="315"
                  className="rounded-lg shadow-md my-3 max-w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              );
            }
          }

          // fallback → normal link
          return (
            <a
              className={cn("font-medium underline", className)}
              rel="noreferrer"
              target="_blank"
              href={href}
              {...props}
            >
              {children}
            </a>
          );
        },
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
