import React, { useEffect, useRef } from "react";
import { Ion, Viewer as cViewer } from "cesium";
import { useMapContext } from "../context/MapContext";

import { CesiumComponentRef, Viewer } from "resium";

import "cesium/Build/Cesium/Widgets/widgets.css";
import JumpToLocation from "./JumpToLocation";

const LoadMap = () => {
  const { loadMap } = useMapContext();

  const viewerRef = useRef<CesiumComponentRef<cViewer> | null>(null);

  useEffect(() => {
    console.log("map loaded");

    window.CESIUM_BASE_URL = "/cesium";
    Ion.defaultAccessToken = process.env.NEXT_PUBLIC_MAP_API_KEY;
    if (viewerRef.current) {
      console.log(viewerRef.current.cesiumElement);
    }

    return () => {
      console.log("map unloaded");
    };
  }, []);

  return (
    <>
      {
        <Viewer full>
          <JumpToLocation />
        </Viewer>
      }
    </>
  );
};

export default LoadMap;
