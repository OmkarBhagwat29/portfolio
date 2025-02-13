import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import {
  BufferGeometry,
  Float32BufferAttribute,
  Line,
  LineBasicMaterial,
  Object3D,
  Vector3,
} from "three";
import { getPointOnMouseEvent } from "../utils/moseEventHelpers";
import { Snap } from "@/app/context/Snap";

export const usePolyline = (
  snap: Snap,
  color: string = "gray",
  lineWidth: number = 1
): Object3D | null => {
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
  }, [color, lineWidth]);

  const points = useMemo(() => {
    const pts: Vector3[] = [];
    return pts;
  }, []);

  useEffect(() => {
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

      const pt = new Vector3().copy(
        getPointOnMouseEvent(e, camera, size, snap.snapPlane)
      );

      if (snap.inputPoint) {
        pt.copy(snap.inputPoint);
      } else if (snap.snapPoint) {
        pt.copy(snap.snapPoint);
      }

      points.push(pt);
      setLinePoints();
    };

    const mouseMove = (e: MouseEvent) => {
      //e.stopPropagation();

      if (points.length === 0) return;

      if (points.length > 1) {
        points.pop();
      }

      const pt = new Vector3();
      if (snap.inputPoint) {
        pt.copy(snap.inputPoint);
      } else if (snap.snapPoint) {
        pt.copy(snap.snapPoint);
      } else {
        pt.copy(getPointOnMouseEvent(e, camera, size, snap.snapPlane));
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

      setPl(newPolyline);
    };

    gl.domElement.addEventListener("click", clickPoint);

    gl.domElement.addEventListener("contextmenu", exit);

    gl.domElement.addEventListener("mousemove", mouseMove);

    return () => {
      console.log("event disposing");
      gl.domElement.removeEventListener("click", clickPoint);
      gl.domElement.removeEventListener("contextmenu", exit);
      gl.domElement.removeEventListener("mousemove", mouseMove);
    };
  }, []);

  return pl;
};
