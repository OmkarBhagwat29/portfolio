"use client";

import Viewer from "@/app/three/Components/Viewer";
import SceneManager from "@/app/three/SceneManager";
import React, { useEffect, useRef, useState } from "react";
import { Object3D } from "three";
import KiaWrapper from "./KiaWrapper";
import { KiaContext } from "../context/kia/KiaContext";

const Kia = () => {
  const [imageNames, setImageNames] = useState<string[]>([]);
  const [sm, setSm] = useState<SceneManager | undefined>(undefined);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [model, setModel] = useState<Object3D | undefined>(undefined);

  useEffect(() => {
    if (canvasRef.current) {
      const sm = SceneManager.getInstance(canvasRef.current);
      setSm(sm);
    }
  }, [canvasRef]);

  useEffect(() => {
    // Fetch image names if not passed as props

    fetch("/api/images")
      .then((res) => res.json())
      .then((data) => setImageNames(data))
      .catch((error) => console.error("Failed to fetch images", error));
  }, []);

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
