import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  Object3D,
  Points,
  PointsMaterial,
  Vector3,
} from "three";
import { GetMouseCoordinates, GetViewportCoordinates } from "../utils/utils";
import { Snap } from "@/app/context/Snap";

export const usePoint = (
  snap: Snap,
  color: string = "gray"
): Object3D | null => {
  const [point, setPoint] = useState<Object3D | null>(null);
  const { size, camera, gl } = useThree();

  const point_geom = useMemo(() => {
    const point = new Points(
      new BufferGeometry(),
      new PointsMaterial({ color: color, size: 10, sizeAttenuation: false })
    );

    point.frustumCulled = false;

    return point;
  }, [color]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      e.stopPropagation();

      const mouse = GetMouseCoordinates(
        e.clientX,
        e.clientY,
        size.width,
        size.height
      );

      const pt = GetViewportCoordinates(camera, mouse, snap.snapPlane);

      if (snap.inputPoint) {
        pt.copy(snap.inputPoint);
      } else if (snap.snapPoint) {
        pt.copy(snap.snapPoint);
      }

      const positions = new Float32Array([0, 0, 0]);
      point_geom.geometry.setAttribute(
        "position",
        new BufferAttribute(positions, 3)
      );
      point_geom.geometry.attributes.position.needsUpdate = true;

      point_geom.userData.controlPoints = [new Vector3(0, 0, 0)];

      point_geom.position.set(pt.x, pt.y, pt.z);

      setPoint(point_geom);
    };

    gl.domElement.addEventListener("click", onClick);

    return () => {
      gl.domElement.removeEventListener("click", onClick);
    };
  }, []);

  return point;
};
