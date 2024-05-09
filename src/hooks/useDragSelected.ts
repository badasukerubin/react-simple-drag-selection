import { RefObject, useEffect, useState } from "react";

export default function useDragSelected(
  elementRef: RefObject<HTMLElement>,
  selection: DOMRect | null
) {
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
    }
  }, [hoveredElement, selection]);

  return isSelected;
}
