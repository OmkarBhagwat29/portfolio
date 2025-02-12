"use client";

import Scene from "@/app/three/Components/Scene/Scene";

import React from "react";
import AppFeatures from "./AppFeatures";
import RenderMap from "../map/RenderMap";

const ProjectScene = () => {
  return (
    <>
      <Scene>
        <AppFeatures />
      </Scene>
      <RenderMap />
    </>
  );
};

export default ProjectScene;
