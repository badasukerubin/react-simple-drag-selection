import { useEffect, useRef, useState } from "react";
import { DrawArea, UseDragSelectionProps } from "./types";
import { Coordinates } from "../types";
import { emptyCoordinates, emptyDOMRect } from "../helpers/helper";
import { drawSelectionBox } from "../helpers/drawSelectionBox";
import { updateScrollAxis } from "../helpers/updateScrollAxis";

export default function useDragSelection({
  containerRef,
  boxRef,
  onSelectionStart,
  onSelection,
  onSelectionEnd,
}: UseDragSelectionProps) {
  const [selection, setSelection] = useState<DOMRect>(emptyDOMRect);

  const prevScrollAxis = useRef<Coordinates>({ x: 0, y: 0 });
  const isFirstScroll = useRef({ x: true, y: true });
  //   scroll top,right: negative y/xDelta
  //   scroll down,left: positive y/xDelta
  const prevScrollDelta = useRef<Coordinates>({ x: 0, y: 0 });

  const mouseDownRef = useRef(false);
  const drawAreaRef = useRef<DrawArea>({
    start: undefined,
    end: undefined,
    offset: undefined,
  });

  useEffect(() => {
    const containerElement = containerRef.current;
    const boxElement = boxRef.current;

    if (!containerElement || !boxElement) {
      return;
    }

    appendOrRemoveChild(containerElement, boxElement);

    const handleMouseMoveBound = (e: MouseEvent) =>
      handleMouseMove(e, containerElement, boxElement);
    const handleScrollBound = () => handleScroll(containerElement, boxElement);

    containerElement.addEventListener("mousedown", (e) =>
      handleMouseDown(
        e,
        containerElement,
        boxElement,
        handleMouseMoveBound,
        handleScrollBound
      )
    );
    document.addEventListener("mouseup", () =>
      handleMouseUp(
        containerElement,
        boxElement,
        handleMouseMoveBound,
        handleScrollBound
      )
    );

    return () => {
      containerElement.removeEventListener("mousedown", (e) =>
        handleMouseDown(
          e,
          containerElement,
          boxElement,
          handleMouseMoveBound,
          handleScrollBound
        )
      );
      document.removeEventListener("mouseup", () =>
        handleMouseUp(
          containerElement,
          boxElement,
          handleMouseMoveBound,
          handleScrollBound
        )
      );
    };
  }, [containerRef, boxRef]);

  function appendOrRemoveChild(
    containerElement: HTMLElement,
    boxElement: HTMLElement
  ) {
    if (mouseDownRef.current) {
      if (!document.body.contains(boxElement)) {
        containerElement.appendChild(boxElement);
      }
    } else {
      if (containerElement.contains(boxElement)) {
        containerElement.removeChild(boxElement);
      }
    }
  }

  function handleDrawArea(boxElement: HTMLElement) {
    const { start, end, offset } = drawAreaRef.current;

    if (start && end && boxElement) {
      drawSelectionBox(boxElement, start, end, offset);

      setSelection(boxElement.getBoundingClientRect());
    } else {
      drawSelectionBox(
        boxElement,
        emptyCoordinates,
        emptyCoordinates,
        emptyCoordinates
      );

      setSelection(emptyDOMRect);
    }
  }

  function handleMouseDown(
    e: MouseEvent,
    containerElement: HTMLElement,
    boxElement: HTMLElement,
    handleMouseMoveBound: (e: MouseEvent) => void,
    handleScrollBound: () => void
  ) {
    if (
      e.button !== 0 ||
      (e.target as HTMLElement).closest(".ignore-drag-selection")
    ) {
      return;
    }

    mouseDownRef.current = true;

    appendOrRemoveChild(containerElement, boxElement);

    if (containerElement.contains(e.target as HTMLElement)) {
      onSelectionStart?.();

      document.body.style.userSelect = "none";

      document.addEventListener("mousemove", handleMouseMoveBound);
      containerElement.addEventListener("scroll", handleScrollBound);

      drawAreaRef.current = {
        start: {
          x: e.clientX,
          y: e.clientY,
        },
        end: {
          x: e.clientX,
          y: e.clientY,
        },
        offset: undefined,
      };

      handleDrawArea(boxElement);
    }
  }

  function handleMouseMove(
    e: MouseEvent,
    containerElement: HTMLElement,
    boxElement: HTMLElement
  ) {
    drawAreaRef.current = {
      ...drawAreaRef.current,
      end: {
        x: e.clientX,
        y: e.clientY,
      },
    };

    onSelection?.(boxElement.getBoundingClientRect());
    handleDrawArea(boxElement);
    updateScrollAxis(boxElement, containerElement, e.clientX, e.clientY);
  }

  function handleScroll(
    containerElement: HTMLElement,
    boxElement: HTMLElement
  ) {
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

    drawAreaRef.current = {
      ...drawAreaRef.current,
      offset: prevScrollDelta.current,
    };

    handleDrawArea(boxElement);
  }

  function handleMouseUp(
    containerElement: HTMLElement,
    boxElement: HTMLElement,
    handleMouseMoveBound: (e: MouseEvent) => void,
    handleScrollBound: () => void
  ) {
    mouseDownRef.current = false;
    prevScrollAxis.current = { x: 0, y: 0 };
    prevScrollDelta.current = { x: 0, y: 0 };
    isFirstScroll.current = { x: true, y: true };

    onSelectionEnd?.();

    document.body.style.userSelect = "initial";

    document.removeEventListener("mousemove", handleMouseMoveBound);
    containerElement.removeEventListener("scroll", handleScrollBound);

    appendOrRemoveChild(containerElement, boxElement);
  }

  return selection;
}
