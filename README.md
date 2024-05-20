<!-- attach gif -->
<p align="center">
    <img src="./assets/react-simple-drag-selection.gif" alt="react-simple-drag-selection" style="width:900px" />
</p>

# react-simple-drag-selection

A simple and configurable React library that provides an efficient and effective drag selection logic.

## Setup

1. Install the repo

   ```
   npm install @badasukerubin/react-simple-drag-selection
   ```

2. Import the component, hooks and wrap your component with the `DragSelectionContext` provider

   ```tsx
   import {
     DragSelectionContext,
     SelectionBox,
     useDragSelection,
   } from "@badasukerubin/react-simple-drag-selection";

   ...

   const selectContainerRef = useRef<HTMLDivElement | null>(null);
   const selectBoxRef = useRef<HTMLDivElement | null>(null);
   const selection = useDragSelection({
     containerRef: selectContainerRef,
     boxRef: selectBoxRef,
   });

   <DragSelectionContext.Provider value={selection}>
     <div ref={selectContainerRef} className={`overflow-${axis}`}>
        <SelectionBox ref={selectBoxRef} />

        <Boxes boxes={boxes} />
      </div>
   </DragSelectionContext.Provider>;
   ```

3. Use the `useDragSelected` hook to get the selection state in the component you want to use it in (Box).

   ```tsx
   import {
     DragSelectionContext,
     useDragSelected,
   } from "@badasukerubin/react-simple-drag-selection";

   ...

   export default memo(function Box() {
     const [color] = useState(getRandomColor());

     const boxRef = useRef<HTMLDivElement | null>(null);

     const selection = useContext(DragSelectionContext);
     const isSelected = useDragSelected({
        elementRef: boxRef,
        selection
     });

     return (
        <div
        ref={boxRef}
        className="box"
        style={{ backgroundColor: isSelected ? "black" : color }}
        ></div>
     );
   });

    ...
   ```

## Available props

1. `DragSelectionContext` is the context provider that provides the selection state to the components that need it.

2. `SelectionBox` is the selection box component that is rendered when the selection starts. You can customise this component by passing values for `className`, `style` or any other prop that you'd pass to a `div` element.

3. `useDragSelection` has the following options:

   - `containerRef`: React ref to the container element
   - `boxRef`: React ref to the selection box element
   - `onSelectionStart`: Optional callback function that is called when the selection starts
   - `onSelection`: Optional callback function that is called when the selection changes
   - `onSelectionEnd`: Optional callback function that is called when the selection ends

4. `useDragSelected` has the following options:
   - `elementRef`: React ref to the element that you want to check if it is selected
   - `selection`: The selection object that is provided by the `DragSelectionContext`
   - `onSelected`: Optional callback function that is called when the element is selected

## Example

A full example can be found in the [example](./example/) directory.
