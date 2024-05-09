import React, { HTMLAttributes, forwardRef } from "react";

const SelectionBox = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  (props, ref) => {
    return (
      <div
        style={{
          position: "fixed",
          background: "rgba(64, 64, 64, 0.4)",
          border: "1px solid rgba(64, 64, 64, 0.8)",
          pointerEvents: "none",
          zIndex: 1,
        }}
        ref={ref}
        {...props}
      ></div>
    );
  }
);

SelectionBox.displayName = "SelectionBox";

export default SelectionBox;
