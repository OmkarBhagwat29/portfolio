import React, { useEffect } from "react";
import { useMapContext } from "../context/MapContext";

const ExtractBuildings = () => {
  const { map, city } = useMapContext();

  useEffect(() => {
    if (!map || !city) return;


  }, [map, city]);

  return <></>;
};

export default ExtractBuildings;
