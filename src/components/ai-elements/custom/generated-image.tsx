"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DownloadIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  src: string;
  alt: string;
  className?: string;
}

export const GeneratedImage = ({ src, alt, className }: Props) => {
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState(false);

  const handleDownload = async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = alt || "download"; // fallback filename
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <span
      className={cn(
        "inline-block relative rounded-lg my-3 cursor-pointer",
        className
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {loading && (
        <span className="flex items-center justify-center w-[350px] h-[250px] bg-muted rounded-lg">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </span>
      )}

      <img
        src={src}
        alt={alt ?? ""}
        className={`rounded-lg shadow-none border object-contain transition-opacity duration-300 ${
          loading ? "opacity-0 absolute" : "opacity-100 relative"
        }`}
        width={350}
        height={250}
        onLoad={() => setLoading(false)}
      />

      {/* 🔹 Hover overlay */}
      {!loading && hovered && (
        <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/50 to-transparent rounded-t-lg">
          <Button
            onClick={handleDownload}
            className="absolute text-white top-2 right-2 rounded-full"
            variant="ghost"
            size="icon"
          >
            <DownloadIcon />
          </Button>
        </span>
      )}
    </span>
  );
};
