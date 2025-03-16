import { Context, createContext } from "react";

export const DragSelectionContext: Context<DOMRect | null> =
  createContext<DOMRect | null>(null);
