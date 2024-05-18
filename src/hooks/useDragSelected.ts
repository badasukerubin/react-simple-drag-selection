import { useEffect, useState } from "react";
import { UseDragSelectedProps } from "./types";

export default function useDragSelected({
  elementRef,
  selection,
  onSelected,
}: UseDragSelectedProps) {
  const [isSelected, setIsSelected] = useState(false);
  const hoveredElement = elementRef.current;

  useEffect(() => {
    if (!hoveredElement || !selection) {
      setIsSelected(false);
    } else {
      const a = hoveredElement.getBoundingClientRect();
      const b = selection;

      setIsSelected(
        !(
          a.y + a.height < b.y ||
          a.y > b.y + b.height ||
          a.x + a.width < b.x ||
          a.x > b.x + b.width
        )
      );

      onSelected?.(isSelected);
    }
  }, [hoveredElement, selection]);

  return isSelected;
}
