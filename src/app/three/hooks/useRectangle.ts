import { useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { Object3D } from "three";

export const useRectangle = (): Object3D | null => {
  const [rec, setRectangle] = useState<Object3D | null>(null);

  const { gl } = useThree();

  useEffect(() => {
    const onMouseDown = () => {};

    const onMouseUp = () => {};

    gl.domElement.addEventListener("mousedown", onMouseDown);
    gl.domElement.addEventListener("mouseup", onMouseUp);

    return () => {
      gl.domElement.removeEventListener("mousedown", onMouseDown);
      gl.domElement.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return rec;
};
