import { Coordinates } from "../types";

export function drawSelectionBox(
  boxRef: HTMLElement,
  start: Coordinates,
  end: Coordinates,
  offset: Coordinates | undefined
): void {
  const offsetX = Math.abs(offset ? offset.x : 0);
  const offsetY = Math.abs(offset ? offset.y : 0);

  boxRef.style.top = `${
    Math.min(start.y, end.y) - (offset && offset.y > 0 ? offsetY : 0)
  }px`;
  boxRef.style.left = `${
    Math.min(start.x, end.x) - (offset && offset.x > 0 ? offsetX : 0)
  }px`;
  boxRef.style.width = `${Math.abs(end.x - start.x) + offsetX}px`;
  boxRef.style.height = `${Math.abs(end.y - start.y) + offsetY}px`;
}
