import { Coordinates } from "../types";

export const emptyCoordinates: Coordinates = {
  x: 0,
  y: 0,
};

export const emptyDOMRect: DOMRect = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  toJSON: () => "",
};
