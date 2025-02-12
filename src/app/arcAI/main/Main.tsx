"use client";
import React, { useState } from "react";
import ProjectScene from "./ProjectScene";

import { CanvasContext } from "../context/CanvasContext";
import ArcAiUI from "../ui/ArcAiUi";
import { DrawContext } from "../context/DrawContext";
import { DrawCommand } from "../context/DrawCommands";
import { CityProps, MapBuildingProps, MapContext } from "../context/MapContext";
import { Viewer } from "cesium";

const Main = () => {
  const [backgroundColor, setBackgroundColor] = useState("");

  const [drawCommand, setDrawCommand] = useState<DrawCommand>("none");

  const [city, setCity] = useState<CityProps | undefined>(undefined);

  const [loadMap, setLoadMap] = useState(false);

  const [map, setMap] = useState<Viewer | undefined>(undefined);

  const [selectedMapObjects, setSelectedMapObjects] = useState<
    MapBuildingProps[]
  >([]);

  return (
    <>
      <CanvasContext value={{ backgroundColor, setBackgroundColor }}>
        <DrawContext value={{ drawCommand, setDrawCommand }}>
          <MapContext
            value={{
              selectedMapObjects,
              setSelectedMapObjects,
              city,
              setCity,
              loadMap,
              setLoadMap,
              map,
              setMap,
            }}
          >
            <ProjectScene />
            <ArcAiUI />
          </MapContext>
        </DrawContext>
      </CanvasContext>
    </>
  );
};

export default Main;
