import { useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { PerspectiveCamera } from "three";

export const usePerspectiveCamera = (
  fov: number = 45,
  near: number = 0.5,
  far: number = 1000
): PerspectiveCamera | null => {
  const { set, size } = useThree();

  const [pCam, setPCam] = useState<PerspectiveCamera | null>(null);

  useEffect(() => {
    const aspect = size.width / size.height;

    const cam = new PerspectiveCamera(fov, aspect, near, far);

    set({ camera: cam });

    setPCam(cam);

    const handleResize = () => {
      if (cam) {
        const aspect = window.innerWidth / window.innerHeight;

        cam.aspect = aspect;

        cam.updateProjectionMatrix();
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return pCam;
};
