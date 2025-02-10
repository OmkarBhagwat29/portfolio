"use client";

import Scene from "@/app/three/Components/Scene/Scene";

import React from "react";
import AppFeatures from "./AppFeatures";

const ProjectScene = () => {
  return (
    <>
      <Scene>
        <AppFeatures />
      </Scene>
    </>
  );
};

export default ProjectScene;
