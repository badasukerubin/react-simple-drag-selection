import { memo, useContext, useRef, useState } from "react";
import {
  DragSelectionContext,
  useDragSelected,
} from "@badasukerubin/react-simple-drag-selection";

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";

  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
}

function onSelected(isSelected: boolean) {
  console.log("Selected", isSelected);
}

export default memo(function Box() {
  const [color] = useState(getRandomColor());

  const boxRef = useRef<HTMLDivElement | null>(null);

  const selection = useContext(DragSelectionContext);
  const isSelected = useDragSelected({
    elementRef: boxRef,
    selection,
    // optional callback
    onSelected,
  });

  return (
    <div
      ref={boxRef}
      className="box"
      style={{ backgroundColor: isSelected ? "black" : color }}
    ></div>
  );
});
