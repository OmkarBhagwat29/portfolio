import { useThree } from "@react-three/fiber";
import React, { useEffect } from "react";
import { OrbitControls as Controls } from "three/examples/jsm/Addons.js";

const OrbitControls = () => {
  const { camera, gl, set } = useThree();

  useEffect(() => {
    if (camera && gl) {
      const controls = new Controls(camera, gl.domElement);

      set({ controls });
    }
  }, [camera, gl]);

  return <></>;
};

export default OrbitControls;
