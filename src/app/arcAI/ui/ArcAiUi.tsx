import React from "react";
import CanvasColorModal from "./components/CanvasColorModal";
import RenderToolbars from "./components/toolbar/RenderToolbars";
import MapUI from "./components/maps/MapUI";

const ArcAiUI = () => {
  return (
    <>
      <CanvasColorModal />
      <RenderToolbars />
      <MapUI />
    </>
  );
};

export default ArcAiUI;
