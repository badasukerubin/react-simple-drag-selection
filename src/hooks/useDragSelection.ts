import { useCallback, useEffect, useRef, useState } from "react";
import { DrawArea, UseDragSelectionProps } from "./types";
import { Coordinates } from "../types";
import { emptyCoordinates, emptyDOMRect } from "../helpers/helper";
import { drawSelectionBox } from "../helpers/drawSelectionBox";
import { updateScrollAxis } from "../helpers/updateScrollAxis";

export default function useDragSelection({
  containerRef,
  boxRef,
}: UseDragSelectionProps) {
  const [mouseDown, setMouseDown] = useState(false);
  const [selection, setSelection] = useState<DOMRect>(emptyDOMRect);
  const [drawArea, setDrawArea] = useState<DrawArea>({
    start: undefined,
    end: undefined,
    offset: undefined,
  });

  const prevScrollAxis = useRef<Coordinates>(emptyCoordinates);
  const isFirstScroll = useRef({ x: true, y: true });
  //   scroll top,right: negative y/xDelta
  //   scroll down,left: positive y/xDelta
  const prevScrollDelta = useRef<Coordinates>(emptyCoordinates);

  const containerElement = containerRef.current;
  const boxElement = boxRef.current;

  const elementsNotReady = !containerElement || !boxElement;

  useEffect(() => {
    if (elementsNotReady) {
      return;
    }

    containerElement.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      containerElement.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [containerElement]);

  useEffect(() => {
    const { start, end, offset } = drawArea;

    if (start && end && boxElement) {
      drawSelectionBox(boxElement, start, end, offset);
      setSelection(boxElement.getBoundingClientRect());
    }
  }, [drawArea, boxElement]);

  useEffect(() => {
    if (elementsNotReady) {
      return;
    }

    if (mouseDown) {
      if (!document.body.contains(boxElement)) {
        containerElement.appendChild(boxElement);
      }
    } else {
      if (containerElement.contains(boxElement)) {
        containerElement.removeChild(boxElement);
      }
    }
  }, [mouseDown, containerElement, boxElement]);

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest(".ignore-drag-selection")) {
        return;
      }

      setMouseDown(true);

      if (
        containerElement &&
        containerElement.contains(e.target as HTMLElement)
      ) {
        document.body.style.userSelect = "none";
        document.addEventListener("mousemove", handleMouseMove);
        containerElement.addEventListener("scroll", handleScroll);

        setDrawArea((prev) => ({
          ...prev,
          start: {
            x: e.clientX,
            y: e.clientY,
          },
          end: {
            x: e.clientX,
            y: e.clientY,
          },
        }));
      }
    },
    [containerElement]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (elementsNotReady) {
        return;
      }

      setDrawArea(function (prev) {
        return {
          ...prev,
          end: {
            x: e.clientX,
            y: e.clientY,
          },
        };
      });

      updateScrollAxis(boxElement, containerElement, e.clientX, e.clientY);
    },
    [containerElement, boxElement]
  );

  const handleScroll = useCallback(() => {
    if (!containerElement) {
      return;
    }

    const currentScrollTop = containerElement.scrollTop;
    const currentScrollLeft = containerElement.scrollLeft;

    if (isFirstScroll.current.y) {
      prevScrollAxis.current.y = currentScrollTop;
      isFirstScroll.current.y = false;
    } else {
      const yDelta = currentScrollTop - prevScrollAxis.current.y;
      const yOffset = yDelta + prevScrollDelta.current.y;

      prevScrollAxis.current.y = currentScrollTop;
      prevScrollDelta.current.y = yOffset;
    }

    if (isFirstScroll.current.x) {
      prevScrollAxis.current.x = currentScrollLeft;
      isFirstScroll.current.x = false;
    } else {
      const xDelta = currentScrollLeft - prevScrollAxis.current.x;
      const xOffset = xDelta + prevScrollDelta.current.x;

      prevScrollAxis.current.x = currentScrollLeft;
      prevScrollDelta.current.x = xOffset;
    }

    setDrawArea(function (prev) {
      return {
        ...prev,
        offset: prevScrollDelta.current,
      };
    });
  }, [containerElement]);

  const handleMouseUp = useCallback(() => {
    if (!containerElement) {
      return;
    }

    prevScrollAxis.current = emptyCoordinates;
    prevScrollDelta.current = emptyCoordinates;
    isFirstScroll.current = { x: true, y: true };

    setDrawArea(() => ({
      start: undefined,
      end: undefined,
      offset: undefined,
    }));

    document.body.style.userSelect = "initial";
    document.removeEventListener("mousemove", handleMouseMove);
    containerElement.removeEventListener("scroll", handleScroll);

    setMouseDown(false);
  }, [containerElement]);

  return selection;
}
