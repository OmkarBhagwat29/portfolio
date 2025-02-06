import { useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { OrthographicCamera } from "three";

export const useOrthographicCamera = (
  fov: number = 45,
  near: number = 0.5,
  far: number = 1000,
  camera_z: number = 2
) => {
  const { set, size } = useThree();

  const [orthCam, setOrthCam] = useState<OrthographicCamera | null>(null);

  useEffect(() => {

    const aspect = size.width / size.height;

    // Adjust the orthographic camera to match the perspective camera's fov
    const zoom = 2 * Math.tan((fov * Math.PI) / 180 / 2); // Calculate the zoom factor
    const height = zoom * camera_z; //this perspective camera position.z;

    const left = -height * aspect;
    const right = height * aspect;
    const top = height;
    const bottom = -height;

    const orthCam = new OrthographicCamera(
      left,
      right,
      top,
      bottom,
      near, // near
      far // far
    );

    set({ camera: orthCam });

    setOrthCam(orthCam);

    const handleResize = () => {
      if (orthCam) {
        const aspect = window.innerWidth / window.innerHeight;
        const height = zoom * camera_z;

        orthCam.left = -height * aspect;
        orthCam.right = height * aspect;
        orthCam.top = height;
        orthCam.bottom = -height;
        orthCam.updateProjectionMatrix();
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return orthCam;
};
