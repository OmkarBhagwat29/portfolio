import { BufferGeometry, Line, Line3, Points, Vector3 } from "three";
import { Line2 } from "three/examples/jsm/Addons.js";

export const toVector3 = (point: Points): Vector3[] => {
  const positions = point.geometry.attributes.position.array;
  const vectors: Vector3[] = [];

  for (let i = 0; i < positions.length; i += 3) {
    vectors.push(
      new Vector3(positions[i], positions[i + 1], positions[i + 2]).add(
        point.position
      )
    );
  }

  return vectors;
};

export const toLines = (obj: Line | Line2): Line3[] => {
  const geom = obj.geometry as BufferGeometry;
  if (!geom.attributes.position) return [];

  //geom.translate(obj.position.x, obj.position.y, obj.position.y);

  const pos = geom.attributes.position.array;

  const lns = [];

  //it is a line
  for (let i = 0; i < pos.length - 3; i += 3) {
    let start = new Vector3(pos[i], pos[i + 1], pos[i + 2]);

    let end = new Vector3(pos[i + 3], pos[i + 4], pos[i + 5]);

    start = new Vector3().addVectors(start, obj.position);
    end = new Vector3().addVectors(end, obj.position);

    const ln3 = new Line3(start, end);
    console.log(ln3);

    lns.push(ln3);
  }

  return lns;
};
