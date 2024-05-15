import {
  DragSelectionContext,
  SelectionBox,
  useDragSelection,
} from "@badasukerubin/react-simple-drag-selection";
import "./App.css";
import { useRef } from "react";

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function App() {
  const boxes = Array.from({ length: 30 }, (_, index) => index + 1);

  const selectContainerRef = useRef<HTMLDivElement | null>(null);
  const selectBoxRef = useRef<HTMLDivElement | null>(null);
  const selection = useDragSelection({
    containerRef: selectContainerRef,
    boxRef: selectBoxRef,
  });

  // console.log(selectBoxRef.current, selectContainerRef.current);

  return (
    <DragSelectionContext.Provider value={selection}>
      <div ref={selectContainerRef} className="container">
        <SelectionBox ref={selectBoxRef} />

        {boxes.map((box) => (
          <div
            key={box}
            className="box"
            style={{ backgroundColor: getRandomColor() }}
          ></div>
        ))}
      </div>
    </DragSelectionContext.Provider>
  );
}

export default App;
