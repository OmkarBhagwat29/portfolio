import React from "react";
import DrawCommandToolbar from "./DrawCommandToolbar";
import SnapOptionToolbar from "./SnapOptionToolbar";

const RenderToolbars = () => {
  return (
    <>
      <DrawCommandToolbar isVertical={true} />

      <SnapOptionToolbar isVertical={false} />
    </>
  );
};

export default RenderToolbars;
