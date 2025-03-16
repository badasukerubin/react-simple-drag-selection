import { RefObject } from "react";
import { Coordinates } from "../types";

export interface UseDragSelectionProps {
  containerRef: RefObject<HTMLElement>;
  boxRef: RefObject<HTMLDivElement>;
  mouseMoveThreshold?: number;
  onSelectionStart?: () => void;
  onSelection?: (selection: DOMRect) => void;
  onSelectionEnd?: () => void;
}

export interface UseDragSelectedProps {
  elementRef: RefObject<HTMLElement>;
  selection: DOMRect | null;
  onSelected?: (isSelected: boolean) => void;
}

export interface DrawArea {
  start: undefined | Coordinates;
  end: undefined | Coordinates;
  offset?: undefined | Coordinates;
}
