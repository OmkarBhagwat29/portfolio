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
import { UseLineOptions } from "./UseOptions";
import { GetMouseCoordinates, GetViewportCoordinates } from "../../utils/utils";

export const useLine = ({
  color = "gray",
  lineWidth = 1,
  onStart,
  onDrawing,
  onDrawComplete,
  onAbort,
  onSnap,
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

    let snapPoint: Vector3 | undefined = undefined;

    const getDynamiceLine = (e: MouseEvent) => {
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

      scene.remove(ln);

      line.position.set(midpoint.x, midpoint.y, midpoint.z);
      // line.geometry.translate(midpoint.x, midpoint.y, midpoint.z);

      setLine(line);

      if (onDrawComplete) {
        onDrawComplete(line);
      }
      gl.domElement.removeEventListener("mousemove", getDynamiceLine);
      gl.domElement.removeEventListener("click", getEndPoint);
    };

    const getStartPoint = (e: MouseEvent) => {
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

      startPt.copy(pt);

      if (onDrawing) {
        onDrawing();
      }

      gl.domElement.addEventListener("click", getEndPoint);
      gl.domElement.addEventListener("mousemove", getDynamiceLine);

      gl.domElement.removeEventListener("click", getStartPoint);
    };

    if (onStart) {
      onStart();
    }

    const handleAbort = () => (onAbort ? onAbort(ln) : () => {});
    const handleSnap = (e: MouseEvent) =>
      onSnap ? (snapPoint = onSnap(e)) : () => {};

    if (onSnap) {
      gl.domElement.addEventListener("mousemove", handleSnap);
    }

    if (onAbort) {
      document.addEventListener("keydown", handleAbort);
    }

    gl.domElement.addEventListener("click", getStartPoint);

    return () => {
      gl.domElement.removeEventListener("click", getStartPoint);
      gl.domElement.removeEventListener("mousemove", getDynamiceLine);
      gl.domElement.removeEventListener("click", getEndPoint);

      if (onAbort) {
        console.log("removing abort from line");
        document.removeEventListener("keydown", handleAbort);
      }

      if (onSnap) {
        gl.domElement.removeEventListener("mousemove", handleSnap);
      }
    };
  }, []);

  return line;
};
