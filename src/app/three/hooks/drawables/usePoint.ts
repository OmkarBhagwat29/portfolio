import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  Object3D,
  Plane,
  Points,
  PointsMaterial,
  Vector3,
} from "three";

import { UsePointOptions } from "./UseOptions";
import { GetMouseCoordinates, GetViewportCoordinates } from "../../utils/utils";

export const usePoint = ({
  color = "gray",
  sizeAttenuation = false,
  pointSize = 10,
  onSnap,
  onDrawing,
  onDrawComplete,
  onAbort,
}: UsePointOptions = {}): Object3D | null => {
  const [point, setPoint] = useState<Object3D | null>(null);
  const { size, camera, gl } = useThree();

  const point_geom = useMemo(() => {
    const point = new Points(
      new BufferGeometry(),
      new PointsMaterial({ color: color, size: pointSize, sizeAttenuation })
    );

    point.frustumCulled = false;

    return point;
  }, [color, pointSize, sizeAttenuation]);

  useEffect(() => {
    let snapPoint: Vector3 | undefined = undefined;

    const onClick = (e: MouseEvent) => {
      e.stopPropagation();

      const mouse = GetMouseCoordinates(
        e.clientX,
        e.clientY,
        size.width,
        size.height
      );

      const pt = GetViewportCoordinates(
        camera,
        mouse,
        new Plane(new Vector3(0, 1, 0))
      );

      if (snapPoint) {
        pt.copy(snapPoint);
      }

      const positions = new Float32Array([0, 0, 0]);
      point_geom.geometry.setAttribute(
        "position",
        new BufferAttribute(positions, 3)
      );
      point_geom.geometry.attributes.position.needsUpdate = true;

      point_geom.userData.controlPoints = [new Vector3(0, 0, 0)];

      point_geom.position.set(pt.x, pt.y, pt.z);

      const output = point_geom.clone();
      setPoint(output);

      if (onDrawComplete) {
        onDrawComplete(output);
      }
    };

    if (onDrawing) {
      onDrawing();
    }

    gl.domElement.addEventListener("click", onClick);

    const handleAbort = () => (onAbort ? onAbort(point_geom) : () => {});

    if (onAbort) {
      document.addEventListener("keydown", handleAbort);
    }

    const handleSnap = (e: MouseEvent) =>
      onSnap ? (snapPoint = onSnap(e)) : () => {};

    if (onSnap) {
      gl.domElement.addEventListener("mousemove", handleSnap);
    }

    return () => {
      console.log("unmounting point");

      gl.domElement.removeEventListener("click", onClick);

      if (onAbort) {
        console.log("removing abort from point");
        document.removeEventListener("keydown", handleAbort);
      }

      if (onSnap) {
        gl.domElement.removeEventListener("mousemove", handleSnap);
      }
    };
  }, []);

  return point;
};
