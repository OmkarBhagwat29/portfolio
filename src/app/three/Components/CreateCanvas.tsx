import React, { forwardRef } from "react";

export type CanvasRef = HTMLCanvasElement | null;

const CreateCanvas = forwardRef<CanvasRef>((props, ref) => {
  return <canvas ref={ref} className=" w-full h-full"></canvas>;
});

CreateCanvas.displayName = "CreateCanvas";

export default CreateCanvas;
