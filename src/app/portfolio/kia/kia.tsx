"use client";
import { KiaContext } from "@/app/context/kia/KiaContext";

import Viewer from "@/app/three/Components/Viewer";
import SceneManager from "@/app/three/SceneManager";
import React, { FC, useEffect, useRef, useState } from "react";
import { Object3D } from "three";
import KiaWrapper from "./KiaWrapper";

interface KiaProps {
  imageNames: string[];
}

const Kia: FC<KiaProps> = ({ imageNames }) => {
  const [sm, setSm] = useState<SceneManager | undefined>(undefined);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [model, setModel] = useState<Object3D | undefined>(undefined);

  useEffect(() => {
    if (canvasRef.current) {
      const sm = SceneManager.getInstance(canvasRef.current);

      setSm(sm);
    }
  }, [canvasRef]);

  return (
    <>
      <Viewer ref={canvasRef} />

      <KiaContext value={{ sm: sm, setSceneManager: setSm, model, setModel }}>
        <KiaWrapper imageNames={imageNames} />
      </KiaContext>
    </>
  );
};

export default Kia;
