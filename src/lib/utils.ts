import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { customAlphabet } from "nanoid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sanitizeText = (text: string) => {
  return text.replace(/<think>[\s\S]*?<\/think>/g, ""); // remove reasoning traces
};

export function formatNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
}

type FilePart = {
  type: "file";
  mediaType: string;
  url: string; // can be base64 (before upload) or uploaded URL (after upload)
};

// ✅ File conversion helperexport
export async function convertFileToDataURL(
  file: File,
  uploadedUrl?: string
): Promise<FilePart> {
  return new Promise<FilePart>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        type: "file",
        mediaType: file.type,
        // ✅ use uploadedUrl if provided, else fallback to base64 preview
        url: uploadedUrl ?? (reader.result as string),
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789");
