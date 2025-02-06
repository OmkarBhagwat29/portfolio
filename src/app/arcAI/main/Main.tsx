"use client";
import React, { useState } from "react";
import ProjectScene from "../three/components/ProjectScene";
import Ui from "../ui/components/Ui";
import { CanvasContext } from "../context/CanvasContext";

const Main = () => {
  const [backgroundColor, setBackgroundColor] = useState("");
  return (
    <>
      <CanvasContext value={{ backgroundColor, setBackgroundColor }}>
        <ProjectScene />
        <Ui />
      </CanvasContext>
    </>
  );
};

export default Main;
