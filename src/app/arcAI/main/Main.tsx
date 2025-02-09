"use client";
import React, { useState } from "react";
import ProjectScene from "../three/components/ProjectScene";

import { CanvasContext } from "../context/CanvasContext";
import ArcAiUI from "../ui/ArcAiUi";

const Main = () => {
  const [backgroundColor, setBackgroundColor] = useState("");
  return (
    <>
      <CanvasContext value={{ backgroundColor, setBackgroundColor }}>
        <ProjectScene />
        <ArcAiUI />
      </CanvasContext>
    </>
  );
};

export default Main;
