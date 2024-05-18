import {
  DragSelectionContext,
  SelectionBox,
  useDragSelection,
} from "@badasukerubin/react-simple-drag-selection";
import "./App.css";
import { useMemo, useRef } from "react";
import Boxes from "./Boxes";
import { AppProps } from "../types";

function onSelectionStart() {
  console.log("Selection started");
}

function onSelection(selection: DOMRect) {
  console.log("Selection", selection);
}

function onSelectionEnd() {
  console.log("Selection ended");
}

export default function App({ axis, length = 30 }: AppProps) {
  const boxes = useMemo(
    () => Array.from({ length }, (_, index) => index + 1),
    [length]
  );

  const selectContainerRef = useRef<HTMLDivElement | null>(null);
  const selectBoxRef = useRef<HTMLDivElement | null>(null);
  const selection = useDragSelection({
    containerRef: selectContainerRef,
    boxRef: selectBoxRef,
    // optional callbacks
    onSelectionStart,
    onSelection,
    onSelectionEnd,
  });

  return (
    <DragSelectionContext.Provider value={selection}>
      <div ref={selectContainerRef} className={`overflow-${axis}`}>
        <SelectionBox ref={selectBoxRef} />

        <Boxes boxes={boxes} />
      </div>
    </DragSelectionContext.Provider>
  );
}
