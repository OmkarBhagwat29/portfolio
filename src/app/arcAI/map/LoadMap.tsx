import React from "react";
import { CesiumTerrainProvider, Ion } from "cesium";

import { Viewer } from "resium";

import "cesium/Build/Cesium/Widgets/widgets.css";
import JumpToLocation from "./JumpToLocation";
import ExtractBuildings from "./ExtractMapBuildings";
import CustomizeOrbit from "./CustomizeOrbit";

const LoadMap = () => {
  window.CESIUM_BASE_URL = "/cesium";
  Ion.defaultAccessToken = process.env.NEXT_PUBLIC_MAP_API_KEY;

  return (
    <>
      {
        <Viewer
          terrainProvider={CesiumTerrainProvider.fromIonAssetId(1, {
            requestVertexNormals: true,
          })}
          full
          homeButton={false}
          animation={false}
          timeline={false}
          navigationInstructionsInitiallyVisible={false}
          projectionPicker={false}
          sceneModePicker={false}
          resolutionScale={0.5}
          scene3DOnly={true}
        >
          <JumpToLocation />
          <ExtractBuildings />
          <CustomizeOrbit />
        </Viewer>
      }
    </>
  );
};

export default LoadMap;
