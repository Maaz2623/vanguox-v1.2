"use client";
import {
  PromptInput,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { models } from "@/constants";
import { cn, convertFileToDataURL } from "@/lib/utils";
import {
  FileArchiveIcon,
  FileAudioIcon,
  FileCodeIcon,
  FileIcon,
  FileImageIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  FileVideoIcon,
  PlusIcon,
  XIcon,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { startTransition, useRef, useState } from "react";
import { useChatStore } from "../../hooks/chat-store";
import { useSharedChatContext } from "./chat-context";
import { useHydratedModel } from "../../hooks/model-store";
import { api } from "../../../../../convex/_generated/api";
import { useMutation } from "convex/react";
import { authClient } from "@/lib/auth/auth-client";
import { useChatIdStore } from "../../hooks/chatId-store";
import { ModelCombobox } from "@/components/model-combo-box";
import { Skeleton } from "@/components/ui/skeleton";
import { useUploadThing } from "@/lib/uploadthing";

export const ChatInput = () => {
  const [progress, setProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);

  const { startUpload } = useUploadThing("imageUploader", {
    onUploadProgress: (p) => {
      setUploading(true);
      setProgress(p); // p = percentage (0-100)
    },
    onClientUploadComplete: (data) => {
      setFileUrl(data[0].ufsUrl);
      setUploading(false);
      setProgress(100);
    },
  });

  const [text, setText] = useState<string>("");

  const [file, setFile] = useState<File | undefined>(undefined);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { chatId, setChatId } = useChatIdStore();
  const { setModel: setAiModel, model, hydrated } = useHydratedModel();
  const { clearChat, sendMessage, status, stop } = useSharedChatContext();

  const pathname = usePathname();
  const router = useRouter();
  const { setPendingMessage, setPendingFile, fileUrl, setFileUrl } =
    useChatStore();

  const createChat = useMutation(api.chats.createConvexChat);
  const { data: authData } = authClient.useSession();

  const canSubmit = text.trim().length > 0 && status !== "streaming";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ normalize into array
    const fileParts =
      file && fileUrl ? [await convertFileToDataURL(file, fileUrl)] : [];

    if (!canSubmit) return;

    const trimmed = text.trim();
    if (!trimmed || status !== "ready") return;

    if (pathname === "/") {
      if (!authData) return;
      clearChat();
      startTransition(async () => {
        const data = await createChat({ userId: authData.user.id });
        setChatId(data);
        router.push(`/chats/${data}`);
      });

      setPendingMessage(trimmed);
      setPendingFile(file ?? null); // 👈 persist file
      setFileUrl(fileUrl ?? null);
      setText("");
    } else {
      sendMessage(
        {
          role: "user",
          parts: [{ type: "text", text: trimmed }, ...fileParts], // ✅ now safe
        },
        {
          body: {
            model: model.id,
            chatId: chatId,
          },
        }
      );
      setText("");
      setFileUrl(null);
      setFile(undefined); // clear after sending
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
    setFile(undefined);
  };

  return (
    <div
      className={cn(
        "absolute md:w-[70%] w-[97vw] bg-background px-2 md:px-0 left-1/2 -translate-x-1/2 bottom-[20%] pb-2 transition-all duration-500",
        pathname !== "/" && "bottom-0",
        pathname === "/files" && "hidden",
        pathname === "/settings" && "hidden"
      )}
    >
      {/* hidden file input */}
      <input
        type="file"
        className="hidden"
        onChange={(event) => {
          event.preventDefault(); // 👈 avoids form submit
          if (event.target.files) {
            setFile(event.target.files[0]);
            startUpload(Array.from(event.target.files));
          }
        }}
        ref={fileInputRef}
      />

      {/* File preview area */}
      {file && (
        <div>
          <FilesPreview
            progress={progress}
            uploading={uploading}
            file={file}
            setFile={setFile}
            fileUrl={fileUrl}
            setFileUrl={setFileUrl}
          />
        </div>
      )}

      <PromptInput
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}
        className="bg-foreground/5"
      >
        <PromptInputTextarea
          onChange={(e) => setText(e.target.value)}
          value={text}
          className="py-4 px-4"
        />
        <PromptInputToolbar className="p-2">
          <PromptInputTools>
            <PromptInputButton
              type="button" // prevents ?message=... navigation
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
            >
              <PlusIcon size={16} />
            </PromptInputButton>

            {hydrated ? (
              <ModelCombobox
                models={models}
                value={model.id}
                onChange={(selectedModel) => setAiModel(selectedModel)}
              />
            ) : (
              <Skeleton className="w-[150px] h-8 bg-foreground/10" />
            )}
          </PromptInputTools>

          <PromptInputSubmit
            onClick={() => {
              if (status === "streaming") stop();
            }}
            disabled={status === "submitted" || uploading}
            status={status}
          />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
};

const getFileIcon = (file: File) => {
  if (file.type.startsWith("image/"))
    return <FileImageIcon className="w-5 h-5 text-blue-500" />;
  if (file.type.startsWith("video/"))
    return <FileVideoIcon className="w-5 h-5 text-purple-500" />;
  if (file.type.startsWith("audio/"))
    return <FileAudioIcon className="w-5 h-5 text-pink-500" />;
  if (file.type === "application/pdf")
    return <FileTextIcon className="w-5 h-5 text-red-500" />;
  if (
    file.type === "application/zip" ||
    file.type === "application/x-zip-compressed"
  )
    return <FileArchiveIcon className="w-5 h-5 text-yellow-500" />;

  if (
    file.type.includes("spreadsheet") ||
    file.name.endsWith(".xls") ||
    file.name.endsWith(".xlsx")
  )
    return <FileSpreadsheetIcon className="w-5 h-5 text-green-500" />;

  if (
    file.type.includes("json") ||
    file.type.includes("javascript") ||
    file.type.includes("typescript") ||
    file.type.includes("html") ||
    file.type.includes("css")
  )
    return <FileCodeIcon className="w-5 h-5 text-gray-600" />;

  return <FileIcon className="w-5 h-5 text-gray-400" />;
};
const FilesPreview = ({
  file,
  setFile,
  setFileUrl,
  progress,
  uploading,
}: {
  file: File;
  setFile: React.Dispatch<React.SetStateAction<File | undefined>>;
  setFileUrl: (url: string | null) => void;
  fileUrl: string | null;
  progress: number;
  uploading: boolean;
}) => {
  if (!file) return null;

  const handleRemove = () => {
    setFile(undefined);
    setFileUrl(null);
    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (input) input.value = "";
  };

  return (
    <div className="flex gap-2 p-2 bg-neutral-800 w-[98%] mx-auto rounded-t-lg overflow-hidden">
      <div className="flex items-center gap-2 border px-3 py-1 rounded-lg text-sm shadow-sm relative">
        {getFileIcon(file)}
        <span className="truncate max-w-[150px]">{file.name}</span>

        {/* 👇 show progress while uploading */}
        {uploading ? (
          <div className="w-20 h-2 bg-gray-700 rounded overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        ) : (
          <XIcon
            className="w-4 h-4 cursor-pointer text-gray-500 hover:text-red-500"
            onClick={handleRemove}
          />
        )}
      </div>
    </div>
  );
};
