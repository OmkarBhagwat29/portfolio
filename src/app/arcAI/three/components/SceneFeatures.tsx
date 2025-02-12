import OrbitControls from "@/app/three/Components/OrbitControls";
import { useThree } from "@react-three/fiber";
import React, { useEffect } from "react";
import { useCanvasContext } from "../../context/CanvasContext";

const SceneFeatures = () => {
  const { backgroundColor } = useCanvasContext();
  const { gl } = useThree();
  useEffect(() => {
    //set canvas color
    gl.domElement.style.background = backgroundColor;
  }, [gl, backgroundColor]);
  return (
    <>
      <axesHelper scale={3} />
      <gridHelper scale={2} />
      <OrbitControls />
      <ambientLight />
    </>
  );
};

export default SceneFeatures;
