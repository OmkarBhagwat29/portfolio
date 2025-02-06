import React, { forwardRef } from "react";
import CreateCanvas, { CanvasRef } from "./CreateCanvas";

const Viewer = forwardRef<CanvasRef>((props, ref) => {
  return (
    <>
      <div className="absolute w-full h-full select-none">
        <CreateCanvas ref={ref} />
      </div>
    </>
  );
});

Viewer.displayName = "Viewer";

export default Viewer;
