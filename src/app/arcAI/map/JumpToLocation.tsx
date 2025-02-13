import React, { useEffect } from "react";
import { useMapContext } from "../context/MapContext";
import {
  Cartesian3,
  Math as CesiumMath,
  Cesium3DTileset,
  createOsmBuildingsAsync,
} from "cesium";
import { useCesium } from "resium";

const JumpToLocation = () => {
  const { city } = useMapContext();

  const { viewer } = useCesium();

  useEffect(() => {
    console.log(viewer);

    if (!viewer) return;

    const { lon, lat } = city ? city : { lon: -122.4175, lat: 37.655 };

    const loadBuildings = async () => {
      await loadOSMFeatures();

      viewer.camera.flyTo({
        destination: Cartesian3.fromDegrees(lon, lat, 400),
        orientation: {
          heading: CesiumMath.toRadians(0.0),
          pitch: CesiumMath.toRadians(-90.0),
        },
      });

      console.log("redirected");
      console.log("city loaded");
    };

    const loadOSMFeatures = async () => {
      try {
        const osmTileset =  await createOsmBuildingsAsync(); // Cesium OSM Buildings & Features
        viewer.scene.primitives.add(osmTileset);
      } catch (error) {
        console.error("Failed to load OSM features:", error);
      }
    };

    loadBuildings();
  }, [viewer]);

  return <></>;
};

export default JumpToLocation;
