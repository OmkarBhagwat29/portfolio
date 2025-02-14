import { toLines, toVector3 } from "@/app/three/utils/converter";
import * as THREE from "three";

class ObjectCollection {
  private static instance: ObjectCollection;

  public lines: THREE.Line[] = [];
  public points: THREE.Points[] = [];
  public meshes: THREE.Mesh[] = [];

  public lineGeometries: THREE.Line3[] = [];
  public pointGeometries: THREE.Vector3[] = [];

  private constructor() {} // Private constructor to prevent instantiation

  static getInstance(): ObjectCollection {
    if (!ObjectCollection.instance) {
      ObjectCollection.instance = new ObjectCollection();
    }
    return ObjectCollection.instance;
  }

  addLine(line: THREE.Line) {
    this.lines.push(line);
    this.lineGeometries.push(...toLines(line));
  }

  addPoint(point: THREE.Points) {
    this.points.push(point);
    this.pointGeometries.push(...toVector3(point));
  }

  addMesh(mesh: THREE.Mesh) {
    this.meshes.push(mesh);

    //find mesh vertices and edges for snapping
  }

  addObject(obj: THREE.Object3D) {
    if (obj.type === "Line") {
      this.addLine(obj as THREE.Line);
    } else if (obj.type === "Points") {
      this.addPoint(obj as THREE.Points);
    } else if (obj.type === "Mesh") {
      this.addMesh(obj as THREE.Mesh);
    }
  }

  removeObjectByUUID(uuid: string) {
    this.lines = this.lines.filter((obj) => obj.uuid !== uuid);
    this.points = this.points.filter((obj) => obj.uuid !== uuid);
    this.meshes = this.meshes.filter((obj) => obj.uuid !== uuid);
  }
}

// Export the singleton instance
export default ObjectCollection.getInstance();
