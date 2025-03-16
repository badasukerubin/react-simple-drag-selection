import { useCallback, useEffect, useRef, useState } from "react";
import { DrawArea, UseDragSelectionProps } from "./types";
import { Coordinates } from "../types";
import { emptyCoordinates } from "../helpers/helper";
import { drawSelectionBox } from "../helpers/drawSelectionBox";
import { updateScrollAxis } from "../helpers/updateScrollAxis";

export default function useDragSelection({
  containerRef,
  boxRef,
  mouseMoveThreshold = 5,
  onSelectionStart,
  onSelection,
  onSelectionEnd,
}: UseDragSelectionProps) {
  const [selection, setSelection] = useState<DOMRect | null>(null);
  const isDragging = useRef(false);

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

    const handleMouseMoveBound = (e: MouseEvent | TouchEvent) =>
      handleMouseMove(e, containerElement, boxElement);
    const handleScrollBound = () => handleScroll(containerElement, boxElement);

    // Mouse events
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

    // Touch events
    containerElement.addEventListener("touchstart", (e) =>
      handleMouseDown(
        e,
        containerElement,
        boxElement,
        handleMouseMoveBound,
        handleScrollBound
      )
    );

    document.addEventListener("touchend", () =>
      handleMouseUp(
        containerElement,
        boxElement,
        handleMouseMoveBound,
        handleScrollBound
      )
    );

    return () => {
      // Mouse events
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

      // Touch events
      containerElement.removeEventListener("touchstart", (e) =>
        handleMouseDown(
          e,
          containerElement,
          boxElement,
          handleMouseMoveBound,
          handleScrollBound
        )
      );
      document.removeEventListener("touchend", () =>
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

  const handleDrawArea = useCallback((boxElement: HTMLElement) => {
    const { start, end, offset } = drawAreaRef.current;

    if (start && end && boxElement && isDragging.current) {
      drawSelectionBox(boxElement, start, end, offset);
      setSelection(boxElement.getBoundingClientRect());
    } else {
      drawSelectionBox(
        boxElement,
        emptyCoordinates,
        emptyCoordinates,
        emptyCoordinates
      );
      setSelection(null);
    }
  }, []);

  function handleMouseDown(
    e: MouseEvent | TouchEvent,
    containerElement: HTMLElement,
    boxElement: HTMLElement,
    handleMouseMoveBound: (e: MouseEvent | TouchEvent) => void,
    handleScrollBound: () => void
  ) {
    const clientX =
      (e as MouseEvent).clientX ?? (e as TouchEvent).touches[0].clientX;
    const clientY =
      (e as MouseEvent).clientY ?? (e as TouchEvent).touches[0].clientY;

    if (
      ((e as MouseEvent).button !== undefined &&
        (e as MouseEvent).button !== 0) ||
      (e.target as HTMLElement).closest(".ignore-drag-selection")
    ) {
      return;
    }

    mouseDownRef.current = true;
    isDragging.current = false;

    appendOrRemoveChild(containerElement, boxElement);

    if (containerElement.contains(e.target as HTMLElement)) {
      onSelectionStart?.();

      document.body.style.userSelect = "none";

      document.addEventListener("mousemove", handleMouseMoveBound);
      document.addEventListener("touchmove", handleMouseMoveBound);
      containerElement.addEventListener("scroll", handleScrollBound);

      drawAreaRef.current = {
        start: {
          x: clientX,
          y: clientY,
        },
        end: {
          x: clientX,
          y: clientY,
        },
        offset: undefined,
      };

      handleDrawArea(boxElement);
    }
  }

  function handleMouseMove(
    e: MouseEvent | TouchEvent,
    containerElement: HTMLElement,
    boxElement: HTMLElement
  ) {
    if (e.type === "touchmove") {
      e.preventDefault();
    }

    const clientX =
      (e as MouseEvent).clientX ?? (e as TouchEvent).touches[0].clientX;
    const clientY =
      (e as MouseEvent).clientY ?? (e as TouchEvent).touches[0].clientY;

    if (!isDragging.current) {
      const start = drawAreaRef.current.start;
      if (start) {
        const deltaX = Math.abs(clientX - start.x);
        const deltaY = Math.abs(clientY - start.y);

        if (deltaX > mouseMoveThreshold || deltaY > mouseMoveThreshold) {
          isDragging.current = true;
        }
      }
    }

    if (isDragging.current) {
      drawAreaRef.current = {
        ...drawAreaRef.current,
        end: { x: clientX, y: clientY },
      };

      handleDrawArea(boxElement);
      onSelection?.(boxElement.getBoundingClientRect());
      updateScrollAxis(boxElement, containerElement, clientX, clientY);
    }
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
    handleMouseMoveBound: (e: MouseEvent | TouchEvent) => void,
    handleScrollBound: () => void
  ) {
    const wasDragging = isDragging.current;
    isDragging.current = false;
    mouseDownRef.current = false;
    prevScrollAxis.current = { x: 0, y: 0 };
    prevScrollDelta.current = { x: 0, y: 0 };
    isFirstScroll.current = { x: true, y: true };

    onSelectionEnd?.();

    document.body.style.userSelect = "initial";

    document.removeEventListener("mousemove", handleMouseMoveBound);
    document.removeEventListener("touchmove", handleMouseMoveBound);
    containerElement.removeEventListener("scroll", handleScrollBound);

    if (wasDragging) {
      const clickHandler = (e: MouseEvent) => {
        e.stopPropagation();
        document.removeEventListener("click", clickHandler, true);
      };
      document.addEventListener("click", clickHandler, true);
    }

    appendOrRemoveChild(containerElement, boxElement);
  }

  return selection;
}
