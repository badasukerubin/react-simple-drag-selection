import { memo } from "react";
import Box from "./Box";
import { BoxesProps } from "./types";

export default memo(function Boxes({ boxes }: BoxesProps) {
  return (
    <>
      {boxes.map((key) => (
        <Box key={key} />
      ))}
    </>
  );
});
