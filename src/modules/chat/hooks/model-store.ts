import { create } from "zustand";
import { useEffect, useState } from "react";
import { Model } from "./types";
import { models } from "@/constants";

const STORAGE_KEY = "last_used_model";

type ModelStore = {
  model: Model;
  setModel: (model: Model) => void;
};

export const useModelStore = create<ModelStore>((set) => ({
  model: models[0], // default
  setModel: (model) => {
    set({ model });
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, model.id);
    }
  },
}));

// hydration hook
export const useHydratedModel = () => {
  const store = useModelStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const found = models.find((m) => m.id === saved);
      if (found) store.setModel(found);
    }
    setHydrated(true);
  }, []);

  return { ...store, hydrated };
};
