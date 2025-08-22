import { create } from "zustand";

type ChatIdStore = {
  chatId: string | null;
  setChatId: (chatId: string) => void;
};

export const useChatIdStore = create<ChatIdStore>((set) => ({
  chatId: null,
  setChatId: (chatId) =>
    set({
      chatId: chatId,
    }),
}));
