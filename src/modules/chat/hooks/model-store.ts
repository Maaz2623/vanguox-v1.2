import { create } from "zustand";
import { Model } from "./types";
import { models } from "@/constants";

type ModelStore = {
  model: Model; // The store state now expects the model to match the Model type
  setModel: (model: Model) => void; // The setModel function will accept a model with exact types
};

export const useModelStore = create<ModelStore>((set) => ({
  model:  models[0],
  setModel: (model) => set({ model }), // Setting the model to the state
}));
