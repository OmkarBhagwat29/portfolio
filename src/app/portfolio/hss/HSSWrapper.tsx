import { Canvas } from "@react-three/fiber";
import React, { ReactNode } from "react";

const HSSWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <Canvas camera={{ fov: 45, far: 3000, near: 0.5, position: [10, 20, 50] }}>
      {children}
    </Canvas>
  );
};

export default HSSWrapper;
