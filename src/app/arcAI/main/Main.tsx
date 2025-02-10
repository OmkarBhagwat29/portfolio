"use client";
import React, { useState } from "react";
import ProjectScene from "./ProjectScene";

import { CanvasContext } from "../context/CanvasContext";
import ArcAiUI from "../ui/ArcAiUi";
import { DrawContext } from "../context/DrawContext";
import { DrawCommand } from "../context/DrawCommands";

const Main = () => {
  const [backgroundColor, setBackgroundColor] = useState("");

  const [drawCommand, setDrawCommand] = useState<DrawCommand>("none");
  return (
    <>
      <CanvasContext value={{ backgroundColor, setBackgroundColor }}>
        <DrawContext value={{ drawCommand, setDrawCommand }}>
          <ProjectScene />
          <ArcAiUI />
        </DrawContext>
      </CanvasContext>
    </>
  );
};

export default Main;
