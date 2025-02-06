import { BufferGeometry, Line, Line3, Vector3 } from "three";
import { Line2 } from "three/examples/jsm/Addons.js";

export const toVector3 = (geometry: BufferGeometry): Vector3[] => {
  const positions = geometry.attributes.position.array;
  const vectors: Vector3[] = [];

  for (let i = 0; i < positions.length; i += 3) {
    vectors.push(new Vector3(positions[i], positions[i + 1], positions[i + 2]));
  }

  return vectors;
};

export const toLines = (obj: Line | Line2): Line3[] => {
  const geom = obj.geometry as BufferGeometry;
  if (!geom.attributes.position) return [];

  const pos = geom.attributes.position.array;

  const lns = [];

  //it is a line
  for (let i = 0; i < pos.length - 3; i += 3) {
    const start = new Vector3(pos[i], pos[i + 1], pos[i + 2]);
    const end = new Vector3(pos[i + 3], pos[i + 4], pos[i + 5]);

    // Apply the world matrix to get the transformed position
    const startWorld = start.applyMatrix4(obj.matrixWorld);
    const endWorld = end.applyMatrix4(obj.matrixWorld);

    const ln3 = new Line3(startWorld, endWorld);

    lns.push(ln3);
  }

  return lns;
};
