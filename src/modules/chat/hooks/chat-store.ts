import { create } from "zustand";

type ChatStore = {
  pendingMessage: string | null;
  setPendingMessage: (msg: string | null) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  pendingMessage: null,
  setPendingMessage: (msg) => set({ pendingMessage: msg }),
}));
