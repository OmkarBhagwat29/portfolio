import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import {
  BufferGeometry,
  Line,
  LineBasicMaterial,
  Object3D,
  Plane,
  Vector3,
} from "three";
import { getPointOnMouseEvent } from "../../utils/moseEventHelpers";

interface UseLineOptions {
  color?: string;
  lineWidth?: number;
  snapFunction?: () => Vector3 | undefined;
  onDrawing?: () => void;
  onDrawComplete?: (line: Line) => void;
}

export const useLine = ({
  color = "gray",
  lineWidth = 1,
  snapFunction,
  onDrawing,
  onDrawComplete,
}: UseLineOptions = {}): Object3D | null => {
  const [line, setLine] = useState<Object3D | null>(null);

  const { scene, camera, size, gl } = useThree();

  const ln = useMemo(() => {
    const lineGeom = new BufferGeometry();
    const lineMat = new LineBasicMaterial({
      color: color,
      linewidth: lineWidth,
    });
    const ln = new Line(lineGeom, lineMat);
    ln.frustumCulled = false;
    scene.add(ln);

    return ln;
  }, [color, lineWidth, scene]);

  useEffect(() => {
    const startPt = new Vector3();
    const endPt = new Vector3();

    const getDynamiceLine = (e: MouseEvent) => {
      const pt = getPointOnMouseEvent(
        e,
        camera,
        size,
        new Plane(new Vector3(0, 1, 0))
      );

      endPt.copy(pt);

      ln.geometry.setFromPoints([startPt, endPt]);

      ln.geometry.attributes.position.needsUpdate = true;
    };

    const getEndPoint = (e: MouseEvent) => {
      e.stopPropagation();

      const midpoint = new Vector3();
      midpoint.addVectors(startPt, endPt).multiplyScalar(0.5);

      // Step 3: Adjust vertices to be relative to the new origin
      const localStart = startPt.clone().sub(midpoint); // Local position of start relative to midpoint
      const localEnd = endPt.clone().sub(midpoint); // Local position of end relative to midpoint

      const geometry = new BufferGeometry().setFromPoints([
        localStart,
        localEnd,
      ]);

      const line = new Line(
        geometry,
        new LineBasicMaterial({
          color: color,
          linewidth: lineWidth,
        })
      );

      line.userData.controlPoints = [localStart, localEnd];

      scene.remove(ln);

      line.position.set(midpoint.x, midpoint.y, midpoint.z);

      setLine(line);

      if (onDrawComplete) {
        onDrawComplete(line);
      }
      gl.domElement.removeEventListener("mousemove", getDynamiceLine);
      gl.domElement.removeEventListener("click", getEndPoint);
    };

    const getStartPoint = (e: MouseEvent) => {
      e.stopPropagation();
      const pt = getPointOnMouseEvent(
        e,
        camera,
        size,
        new Plane(new Vector3(0, 1, 0))
      );

      startPt.copy(pt);

      gl.domElement.addEventListener("mousemove", getDynamiceLine);
      gl.domElement.addEventListener("click", getEndPoint);
      gl.domElement.removeEventListener("click", getStartPoint);
    };

    if (onDrawing) {
      onDrawing();
    }
    gl.domElement.addEventListener("click", getStartPoint);

    return () => {
      gl.domElement.removeEventListener("click", getStartPoint);
      gl.domElement.removeEventListener("mousemove", getDynamiceLine);
      gl.domElement.removeEventListener("click", getEndPoint);
    };
  }, [color, lineWidth, scene, camera, gl, ln, size]);

  return line;
};
