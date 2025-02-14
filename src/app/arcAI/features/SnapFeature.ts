import { SnapState } from "@/app/lib/features/snap/snapSlice";
import { getPointOnMouseEvent } from "@/app/three/utils/moseEventHelpers";
import { Size } from "@react-three/fiber";
import {
  BufferGeometry,
  Camera,
  Plane,
  Points,
  PointsMaterial,
  Scene,
  Vector3,
} from "three";
import ObjectCollection from "./ObjectCollection";

class Snap {
  private static instance: Snap;

  public snapPoint: Vector3 | null = null;
  public snapPlane: Plane | null = null;

  public state: SnapState | null = null;

  public color: string = "yellow";
  public size: number = 10;

  public material = new PointsMaterial({
    color: "yellow",
    size: 10,
    sizeAttenuation: false,
  });

  public pointsGeom = new Points(new BufferGeometry(), this.material);

  static getInstance(): Snap {
    if (!Snap.instance) {
      Snap.instance = new Snap();
    }

    return Snap.instance;
  }

  setSnapState(_snapState: SnapState) {
    this.state = _snapState;
  }

  setSnapPlane(e: MouseEvent) {
    this.snapPlane = new Plane(new Vector3(0, 1, 0));
  }

  visualizeSnapPoint(scene: Scene) {
    scene.remove(this.pointsGeom);

    if (this.snapPoint) {
      this.pointsGeom.geometry.setFromPoints([this.snapPoint]);
      scene.add(this.pointsGeom);
    }
  }

  setSnapPointOnMouseMove(
    e: MouseEvent,
    camera: Camera,
    size: Size,
    threshold: number = 0.01
  ) {
    if (!this.state || !this.state.active) {
      this.snapPoint = null;
      this.snapPlane = null;
      return;
    }
    let tempSnapPt: Vector3 | null = null;

    this.setSnapPlane(e);

    const cursor = getPointOnMouseEvent(e, camera, size, this.snapPlane!);

    const snapTempPoint = this.calculatePointState(cursor, threshold);

    const snapTempLine = this.calculateLineState(cursor, threshold);

    if (snapTempPoint) {
      tempSnapPt = snapTempPoint;
    }

    if (snapTempLine) {
      tempSnapPt = snapTempLine;
    }

    this.snapPoint = tempSnapPt ? tempSnapPt.clone() : null;
  }

  private calculatePointState(
    cursor: Vector3,
    threshold: number
  ): Vector3 | null {
    let tempPt: Vector3 | null = null;

    if (this.state?.point) {
      const points = ObjectCollection.pointGeometries;

      points.forEach((pt) => {
        const dist = pt.distanceToSquared(cursor);

        if (dist <= threshold) {
          tempPt = pt;
        }
      });
    }

    return tempPt;
  }

  private calculateLineState(
    cursor: Vector3,
    threshold: number
  ): Vector3 | null {
    let tempPt: Vector3 | null = null;

    const lines =
      this.state?.near ||
      this.state?.end ||
      this.state?.mid ||
      this.state?.smart
        ? ObjectCollection.lineGeometries
        : [];

    // console.log(lines);
    if (lines) {
      if (this.state?.near) {
        lines.forEach((ln) => {
          const testPt = new Vector3();
          ln.closestPointToPoint(cursor, !this.state!.smart, testPt);

          const dist = testPt.distanceTo(cursor);
          if (dist <= threshold) {
            tempPt = testPt;
          }
        });
        // console.log(tempPt);
      }

      if (this.state?.end) {
        //console.log("finding end");
        lines.forEach((ln) => {
          if (ln.start.distanceTo(cursor) <= threshold) {
            tempPt = ln.start;
          } else if (ln.end.distanceTo(cursor) <= threshold) {
            tempPt = ln.end;
          }
        });

        // console.log(tempPt);
      }

      if (this.state?.mid) {
        lines.forEach((ln) => {
          const center = new Vector3();
          ln.getCenter(center);
          if (center.distanceTo(cursor) <= threshold) {
            tempPt = center;
          }
        });

        // console.log(tempPt);
      }
    }

    return tempPt;
  }
}

export default Snap.getInstance();
