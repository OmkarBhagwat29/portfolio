import React from "react";

import LoadMap from "./LoadMap";
import { useMapContext } from "../context/MapContext";

const MapFeatures = () => {
  const { loadMap } = useMapContext();

  return (
    <>
      {loadMap && (
        <>
          {" "}
          <LoadMap />

        </>
      )}

    </>
  );
};

export default MapFeatures;
