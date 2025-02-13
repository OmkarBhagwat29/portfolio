import {
  KeyboardEventModifier,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
} from "cesium";
import React, { useEffect } from "react";
import { useCesium } from "resium";

const CustomizeOrbit = () => {
  const { viewer } = useCesium();

  useEffect(() => {
    if (!viewer) return;

    // Disable orbit controls
    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.removeInputAction(
      ScreenSpaceEventType.MOUSE_MOVE,
      KeyboardEventModifier.CTRL
    );

    console.log("removing ctrl and left click");

    return () => {
      console.log("destoryed ctrl and left click");
      handler.destroy();
    };
    // handler.removeInputAction(ScreenSpaceEventType.RIGHT_DRAG);
    // handler.removeInputAction(ScreenSpaceEventType.MOUSE_WHEEL);
  }, [viewer]);

  return <></>;
};

export default CustomizeOrbit;
