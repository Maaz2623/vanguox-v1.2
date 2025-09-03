import { create } from "zustand";

interface ChatStore {
  pendingMessage: string | null;
  pendingFile: File | null;
  fileUrl: string | null;
  setFileUrl: (url: string | null) => void;
  setPendingMessage: (msg: string | null) => void;
  setPendingFile: (file: File | null) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  fileUrl: null,
  pendingMessage: null,
  pendingFile: null,
  setPendingMessage: (msg) => set({ pendingMessage: msg }),
  setPendingFile: (file) => set({ pendingFile: file }),
  setFileUrl: (url) => set({ fileUrl: url }),
}));
