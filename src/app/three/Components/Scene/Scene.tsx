import { Canvas } from "@react-three/fiber";
import React, { ReactNode } from "react";

const Scene = ({ children }: { children: ReactNode }) => {
  return (
    <Canvas
      camera={{ fov: 45 }}
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
      }}
    >
      {children}
    </Canvas>
  );
};

export default Scene;
