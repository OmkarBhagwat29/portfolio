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
import { UseLineOptions } from "./UseOptions";

export const useLine = ({
  color = "gray",
  lineWidth = 1,
  snapFunction,
  onStart,
  onDrawing,
  onDrawComplete,
  onAbort,
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

      if (snapFunction) {
        const snapPt = snapFunction();

        if (snapPt) {
          pt.copy(snapPt);
        }
      }

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

      if (snapFunction) {
        const snapPt = snapFunction();

        if (snapPt) {
          pt.copy(snapPt);
        }
      }

      startPt.copy(pt);

      if (onDrawing) {
        onDrawing();
      }

      gl.domElement.addEventListener("mousemove", getDynamiceLine);
      gl.domElement.addEventListener("click", getEndPoint);
      gl.domElement.removeEventListener("click", getStartPoint);
    };

    if (onStart) {
      onStart();
    }

    const handleAbort = (event) => (onAbort ? onAbort(ln) : () => {});

    gl.domElement.addEventListener("click", getStartPoint);

    if (onAbort) {
      document.addEventListener("keydown", handleAbort);
    }

    return () => {
      gl.domElement.removeEventListener("click", getStartPoint);
      gl.domElement.removeEventListener("mousemove", getDynamiceLine);
      gl.domElement.removeEventListener("click", getEndPoint);

      if (onAbort) {
        console.log("removing abort from line");
        document.removeEventListener("keydown", handleAbort);
      }
    };
  }, []);

  return line;
};
