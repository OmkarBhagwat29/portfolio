import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import {
  BufferGeometry,
  Float32BufferAttribute,
  Line,
  LineBasicMaterial,
  Object3D,
  Plane,
  Vector3,
} from "three";
import { UseLineOptions } from "./UseOptions";
import { getPointOnMouseEvent } from "../../utils/moseEventHelpers";
import { GetMouseCoordinates, GetViewportCoordinates } from "../../utils/utils";

export const usePolyline = ({
  color = "gray",
  lineWidth = 1,
  onSnap,
  onStart,
  onDrawing,
  onDrawComplete,
  onAbort,
}: UseLineOptions = {}): Object3D | null => {
  const [pl, setPl] = useState<Object3D | null>(null);

  const { camera, scene, size, gl } = useThree();

  const polyline = useMemo(() => {
    const lineGeom = new BufferGeometry();
    const lineMat = new LineBasicMaterial({
      color: color,
      linewidth: lineWidth,
    });

    const ply = new Line(lineGeom, lineMat);

    ply.frustumCulled = false;

    scene.add(ply);

    return ply;
  }, [color, lineWidth, scene]);

  const points = useMemo(() => {
    const pts: Vector3[] = [];
    return pts;
  }, []);

  useEffect(() => {
    let snapPoint: Vector3 | undefined = undefined;

    const setLinePoints = () => {
      if (points.length === 1) return;

      const attArray: number[] = [];

      for (let i = 0; i < points.length; i++) {
        const prvPt = points[i];

        attArray.push(prvPt.x, prvPt.y, prvPt.z);
      }

      polyline.geometry.setAttribute(
        "position",
        new Float32BufferAttribute(attArray, 3)
      );
      polyline.geometry.attributes.position.needsUpdate = true;
    };

    const clickPoint = (e: MouseEvent) => {
      e.stopPropagation();

      if (onDrawing) {
        onDrawing();
      }

      const pt = new Vector3().copy(
        getPointOnMouseEvent(e, camera, size, new Plane(new Vector3(0, 1, 0)))
      );

      if (snapPoint) {
        pt.copy(snapPoint);
      }

      points.push(pt);
      setLinePoints();
    };

    const mouseMove = (e: MouseEvent) => {
      e.stopPropagation();

      if (points.length === 0) return;

      if (points.length > 1) {
        points.pop();
      }

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

      points.push(pt.clone());

      setLinePoints();
    };

    const exit = (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      if (points.length <= 1) {
        scene.remove(polyline);
        return;
      }

      scene.remove(polyline);

      points.pop();
      setLinePoints();

      const mid = new Vector3();

      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        mid.x += p.x;
        mid.y += p.y;
        mid.z += p.z;
      }

      mid.x /= points.length;
      mid.y /= points.length;
      mid.z /= points.length;

      const pointsAtOrigin: Vector3[] = [];

      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        const mapPt = p.clone().sub(mid);
        pointsAtOrigin.push(mapPt);
      }

      const geometry = new BufferGeometry().setFromPoints(pointsAtOrigin);

      const newPolyline = new Line(
        geometry,
        new LineBasicMaterial({
          color: color,
          linewidth: lineWidth,
        })
      );

      newPolyline.userData.controlPoints = pointsAtOrigin;

      newPolyline.position.set(mid.x, mid.y, mid.z);

      if (onDrawComplete) {
        onDrawComplete(newPolyline);
      }

      setPl(newPolyline);
    };

    if (onStart) {
      onStart();
    }

    gl.domElement.addEventListener("click", clickPoint);

    gl.domElement.addEventListener("contextmenu", exit);

    gl.domElement.addEventListener("mousemove", mouseMove);

    const handleAbort = () => (onAbort ? onAbort(polyline) : () => {});

    if (onAbort) {
      document.addEventListener("keydown", handleAbort);
    }

    const handleSnap = (e: MouseEvent) =>
      onSnap ? (snapPoint = onSnap(e)) : () => {};

    if (onSnap) {
      gl.domElement.addEventListener("mousemove", handleSnap);
    }

    return () => {
      console.log("event disposing");
      gl.domElement.removeEventListener("click", clickPoint);
      gl.domElement.removeEventListener("contextmenu", exit);
      gl.domElement.removeEventListener("mousemove", mouseMove);

      if (onAbort) {
        console.log("removing abort from polylinr");
        document.removeEventListener("keydown", handleAbort);
      }

      if (onSnap) {
        gl.domElement.removeEventListener("mousemove", handleSnap);
      }
    };
  }, []);

  return pl;
};
