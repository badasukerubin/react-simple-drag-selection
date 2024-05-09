import { RefObject } from "react";
import { Coordinates } from "../types";

export interface UseDragSelectionProps {
  containerRef: RefObject<HTMLElement>;
  boxRef: RefObject<HTMLDivElement>;
}

export interface DrawArea {
  start: undefined | Coordinates;
  end: undefined | Coordinates;
  offset?: undefined | Coordinates;
}
