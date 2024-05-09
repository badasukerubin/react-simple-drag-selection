import { Context, createContext } from "react";
import { emptyDOMRect } from "../helpers/helper";

export const DragSelectionContext: Context<DOMRect> =
  createContext<DOMRect>(emptyDOMRect);
