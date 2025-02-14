import {
  BufferGeometry,
  Camera,
  Line3,
  Object3D,
  Plane,
  Points,
  PointsMaterial,
  Scene,
  Vector2,
  Vector3,
} from "three";

import { GetViewportCoordinates } from "../utils/utils";
import { createSceneObjects } from "./SceneObjects";
import { SnapType } from "@/app/lib/features/snap/SnapTypes";
import { SnapState } from "@/app/lib/features/snap/snapSlice";
import { getPointOnMouseEvent } from "../utils/moseEventHelpers";
import { Size } from "@react-three/fiber";
import { toLines, toVector3 } from "../utils/converter";

export interface Snap {
  threshold: number;
  mid: boolean;
  end: boolean;
  near: boolean;
  point: boolean;
  smart: boolean;
  active: boolean;

  snapPlane: Plane;

  snapPoint: Vector3 | null;
  inputPoint: Vector3 | null;

  showSnapPoint: (scene: Scene, camera: Camera, pointer: Vector2) => void;

  setSnapPlane: (normal: Vector3) => void;

  setSnap: (type: SnapType, active: boolean) => void;
  getSnap: (type: SnapType) => boolean;

  resetSnapPoint: (scene: Scene) => void;
}

const pt = new BufferGeometry();
const mat = new PointsMaterial({
  color: "yellow",
  sizeAttenuation: true,
  size: 0.55,
});
const scenePt = new Points(pt, mat);

export const createSnap = (
  active: boolean = false,
  mid: boolean = false,
  end: boolean = false,
  near: boolean = false,
  point: boolean = false,
  smart: boolean = false
): Snap => {
  const objects = createSceneObjects();
  return {
    threshold: 0.1 * 0.1,
    snapPoint: null,
    active,
    mid,
    end,
    near,
    point,
    smart,
    inputPoint: null,
    snapPlane: new Plane(new Vector3(0, 1, 0)),
    setSnapPlane(normal: Vector3) {
      this.snapPlane.set(normal, 0);
    },
    setSnap(type: SnapType, active: boolean) {
      switch (type) {
        case "end":
          this.end = active;
          break;
        case "mid":
          this.mid = active;
          break;
        case "near":
          this.near = active;
          break;
        case "point":
          this.point = active;
          break;
        case "active":
          this.active = active;
          break;
        case "smart":
          this.smart = active;
          break;
        default:
          return;
      }
    },
    getSnap(type: SnapType) {
      switch (type) {
        case "end":
          return this.end;
        case "mid":
          return this.mid;
        case "near":
          return this.near;
        case "point":
          return this.point;
        case "active":
          return this.active;
        case "smart":
          return this.smart;
        default:
          return false;
      }
    },
    showSnapPoint(scene: Scene, camera: Camera, pointer: Vector2) {
      if (!this.active) {
        this.snapPoint = null;
        return;
      }

      const tempSnapPt = new Vector3();
      let snapFound = false;

      //calculate the snap plane // or create the method to get curson point
      const cursor = GetViewportCoordinates(camera, pointer, this.snapPlane);
      if (this.point) {
        const points = objects.getPoints(scene);

        points.forEach((pt) => {
          const dist = pt.distanceToSquared(cursor);

          if (dist <= this.threshold) {
            tempSnapPt.copy(pt);
            snapFound = true;
          }
        });
      }

      let lines: Line3[] = [];
      if (this.near || this.mid || this.end) {
        lines = objects.getLines(scene);
        // console.log(lines);
        if (this.near) {
          //console.log("finding near");

          const testPt = new Vector3();
          lines.forEach((ln) => {
            ln.closestPointToPoint(cursor, !this.smart, testPt);

            const dist = testPt.distanceToSquared(cursor);

            if (dist <= this.threshold) {
              tempSnapPt.copy(testPt);
              snapFound = true;
              //console.log(testPt);
            }
          });
        }

        if (this.end) {
          //console.log("finding end");
          lines.forEach((ln) => {
            if (ln.start.distanceToSquared(cursor) <= this.threshold) {
              tempSnapPt.copy(ln.start);

              snapFound = true;
            } else if (ln.end.distanceToSquared(cursor) <= this.threshold) {
              tempSnapPt.copy(ln.end);

              snapFound = true;
            }
          });
        }

        if (this.mid) {
          lines.forEach((ln) => {
            const center = new Vector3();
            ln.getCenter(center);
            if (center.distanceToSquared(cursor) <= this.threshold) {
              snapFound = true;
              tempSnapPt.copy(center);
            }
          });
        }
      }

      if (snapFound) {
        //display it
        this.snapPoint = new Vector3();
        this.snapPoint.copy(tempSnapPt);
        scenePt.geometry.setFromPoints([this.snapPoint]);

        scene.add(scenePt);
      } else {
        scene.remove(scenePt);
        this.snapPoint = null;
      }
    },
    resetSnapPoint(scene: Scene) {
      this.snapPoint = null;
      this.inputPoint = null;
      scene.remove(scenePt);
    },
  };
};

export const getSnapPoint = (
  e: MouseEvent,
  objects: Object3D[],
  snapState: SnapState,
  camera: Camera,
  size: Size,
  threshold: number = 0.01
): Vector3 | undefined => {
  let snapPoint: Vector3 | undefined = undefined;
  if (!snapState.active) {
    return snapPoint;
  }

  const tempSnapPt = new Vector3();
  let snapFound = false;

  //calculate the snap plane // or create the method to get curson point
  //const objects = createSceneObjects();

  const cursor = getPointOnMouseEvent(
    e,
    camera,
    size,
    new Plane(new Vector3(0, 1, 0))
  );
  if (snapState.point) {
    const pointsObjs = objects.filter((o) => o.type === "Points");
    const points: Vector3[] = [];
    pointsObjs.forEach((ptObj) => points.push(...toVector3(ptObj.geometry)));

    points.forEach((pt) => {
      const dist = pt.distanceToSquared(cursor);

      if (dist <= threshold) {
        tempSnapPt.copy(pt);
        snapFound = true;
      }
    });
  }

  const lines: Line3[] = [];
  if (snapState.near || snapState.mid || snapState.end) {
    const linesObjs = objects.filter((o) => o.type === "Line");
    console.log(linesObjs);
    linesObjs.forEach((lnObj) => lines.push(...toLines(lnObj.geometry)));
    // console.log(lines);
    if (snapState.near) {
      //console.log("finding near");

      const testPt = new Vector3();
      lines.forEach((ln) => {
        ln.closestPointToPoint(cursor, !snapState.smart, testPt);

        const dist = testPt.distanceToSquared(cursor);

        if (dist <= threshold) {
          tempSnapPt.copy(testPt);
          snapFound = true;
          //console.log(testPt);
        }
      });
    }

    if (snapState.end) {
      //console.log("finding end");
      lines.forEach((ln) => {
        if (ln.start.distanceToSquared(cursor) <= threshold) {
          tempSnapPt.copy(ln.start);

          snapFound = true;
        } else if (ln.end.distanceToSquared(cursor) <= threshold) {
          tempSnapPt.copy(ln.end);

          snapFound = true;
        }
      });
    }

    if (snapState.mid) {
      lines.forEach((ln) => {
        const center = new Vector3();
        ln.getCenter(center);
        if (center.distanceToSquared(cursor) <= threshold) {
          snapFound = true;
          tempSnapPt.copy(center);
        }
      });
    }
  }

  if (snapFound) {
    snapPoint = tempSnapPt;
  }

  return snapPoint;
};
