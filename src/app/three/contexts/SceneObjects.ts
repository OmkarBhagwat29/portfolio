import { Line, Line3, Object3D, Points, Scene, Vector3 } from "three";
import { toLines, toVector3 } from "../utils/converter";

export interface SceneObjects {
  pointsGeom: Object3D[];
  linesGeom: Object3D[];
  getPoints: (scene: Scene) => Vector3[];
  getLines: (scene: Scene) => Line3[];
}

export const createSceneObjects = (): SceneObjects => {
  return {
    pointsGeom: [],
    linesGeom: [],
    getPoints(scene: Scene) {
      this.pointsGeom = [];

      scene.getObjectsByProperty("type", "Points", this.pointsGeom);

      const pts: Vector3[] = [];

      this.pointsGeom.forEach((ptObj) => {
        if (ptObj instanceof Points) {
          pts.push(...toVector3(ptObj.geometry));
        }
      });

      return pts;
    },
    getLines(scene: Scene) {
      this.linesGeom = [];

      scene.getObjectsByProperty("type", "Line2", this.linesGeom);
      scene.getObjectsByProperty("type", "Line", this.linesGeom);

      const lines: Line3[] = [];
      this.linesGeom.forEach((lnGeom) => {
        if (lnGeom instanceof Line) {
          const lns = toLines(lnGeom);

          lines.push(...lns);
        }
      });

      return lines;
    },
  };
};
