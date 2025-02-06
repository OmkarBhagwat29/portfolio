import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import {
  Box3,
  BoxGeometry,
  BufferGeometry,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  Plane,
  Vector3,
} from "three";
import { getPointOnMouseEvent } from "../utils/moseEventHelpers";
import { Snap } from "../contexts/Snap";

export const useBox = (snap: Snap, color: string = "gray"): Object3D | null => {
  const [box, setBox] = useState<Object3D | null>(null);

  const { gl, scene, camera, size } = useThree();

  const preview_Geom = useMemo(() => {
    const lineGeom = new BufferGeometry();
    const lineMat = new LineBasicMaterial({
      color: color,
    });
    const ln = new Line(lineGeom, lineMat);
    ln.frustumCulled = false;
    scene.add(ln);

    return ln;
  }, [color, scene]);

  useEffect(() => {
    const clickedPoints: Vector3[] = [];
    let previewPoints: Vector3[] = [];
    let width = 0;
    let depth = 0;
    let height = 0;

    const updateGeometry = (points: Vector3[]) => {
      const geometry = new BufferGeometry();
      geometry.setFromPoints(points);
      preview_Geom.geometry.dispose(); // Dispose the previous geometry
      preview_Geom.geometry = geometry; // Assign the updated geometry
    };

    const drawFirstPoint = (e: MouseEvent) => {
      e.stopPropagation();

      const pt = getPointOnMouseEvent(e, camera, size, snap.snapPlane);

      if (snap.inputPoint) {
        pt.copy(snap.inputPoint);
      } else if (snap.snapPoint) {
        pt.copy(snap.snapPoint);
      }

      clickedPoints.push(pt.clone());

      gl.domElement.addEventListener("mousemove", drawSecondPoint);

      if (clickedPoints.length === 2) {
        gl.domElement.removeEventListener("mousemove", drawSecondPoint);
        gl.domElement.addEventListener("mousemove", drawThirdPoint);
      } else if (clickedPoints.length === 3) {
        gl.domElement.removeEventListener("mousemove", drawThirdPoint);
        gl.domElement.removeEventListener("click", drawFirstPoint);

        scene.remove(preview_Geom);

        const box3 = new Box3().setFromPoints(previewPoints);
        const boxCenter = new Vector3();
        box3.getCenter(boxCenter);

        const box = new BoxGeometry(width, height, depth);
        const msh = new Mesh(box, new MeshBasicMaterial({ color }));
        msh.position.set(boxCenter.x, boxCenter.y, boxCenter.z);

        msh.userData.controlPoints = previewPoints;

        setBox(msh);
      }
    };

    const drawSecondPoint = (e: MouseEvent) => {
      e.stopPropagation();

      previewPoints = [];

      const pt = getPointOnMouseEvent(e, camera, size, snap.snapPlane);

      if (snap.inputPoint) {
        pt.copy(snap.inputPoint);
      } else if (snap.snapPoint) {
        pt.copy(snap.snapPoint);
      }

      //draw rectangle base on 2 points
      const firstPt = clickedPoints[0];
      const secondPt = pt.clone();

      // Create rectangle base points
      const thirdPt = new Vector3(secondPt.x, firstPt.y, firstPt.z);
      const fourthPt = new Vector3(firstPt.x, firstPt.y, secondPt.z);

      previewPoints = [firstPt, thirdPt, secondPt, fourthPt, firstPt];

      width = firstPt.distanceTo(thirdPt);
      depth = secondPt.distanceTo(thirdPt);

      updateGeometry(previewPoints);
    };

    const drawThirdPoint = (e: MouseEvent) => {
      e.stopPropagation();

      const pln = new Plane(new Vector3(0, 0, 1));

      const pt = getPointOnMouseEvent(e, camera, size, pln);

      if (snap.inputPoint) {
        pt.copy(snap.inputPoint);
      } else if (snap.snapPoint) {
        pt.copy(snap.snapPoint);
      }

      height = pt.y;

      const bottomFace = previewPoints.slice(0, 4); // Base rectangle points
      const topFace = bottomFace.map((p) => new Vector3(p.x, height, p.z));

      // Combine bottom and top face points to form cuboid edges
      previewPoints = [
        ...bottomFace, // Bottom rectangle
        bottomFace[0], // Close bottom rectangle
        ...topFace, // Top rectangle
        topFace[0], // Close top rectangle
        // Vertical edges connecting top and bottom faces
        bottomFace[0],
        topFace[0],
        bottomFace[1],
        topFace[1],
        bottomFace[2],
        topFace[2],
        bottomFace[3],
        topFace[3],
      ];

      updateGeometry(previewPoints);
    };

    gl.domElement.addEventListener("click", drawFirstPoint);

    return () => {
      gl.domElement.removeEventListener("click", drawFirstPoint);
      gl.domElement.removeEventListener("mousemove", drawSecondPoint);
      gl.domElement.removeEventListener("mousemove", drawThirdPoint);
    };
  }, []);

  return box;
};
