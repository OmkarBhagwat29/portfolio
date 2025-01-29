import {
  Box3,
  BoxGeometry,
  BufferGeometry,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  Vector3,
} from "three";

export const getLastParentOfObject = (object: Object3D): Object3D => {
  let currentParent = object;
  while (currentParent.parent && currentParent.parent.type !== "Scene") {
    currentParent = currentParent.parent;
  }

  return currentParent;
};

export const createLineWrapper = (start: Vector3, end: Vector3): Mesh => {
  const direction = new Vector3().subVectors(end, start);
  const length = direction.length();

  // Normalize direction
  direction.normalize();

  // Create a box that represents the bounding volume
  const boxGeometry = new BoxGeometry(0.05, 0.05, length); // Adjust width/height as needed
  const boxMaterial = new MeshBasicMaterial({
    color: 0xff0000,
    wireframe: false,
    visible: false,
    transparent: true,
    opacity: 0.5,
  });
  const boxMesh = new Mesh(boxGeometry, boxMaterial);

  // Position the box at the midpoint of the line
  const midpoint = new Vector3().addVectors(start, end).multiplyScalar(0.5);
  boxMesh.position.copy(midpoint);

  // Align the box along the line
  const up = new Vector3(0, 0, 1); // Default orientation (z-axis up)
  boxMesh.quaternion.setFromUnitVectors(up, direction);

  return boxMesh;
};

export const orientLineWrapper = (
  boxMesh: Mesh,
  start: Vector3,
  end: Vector3
) => {
  const direction = new Vector3().subVectors(end, start);

  // Normalize direction
  direction.normalize();

  // Position the box at the midpoint of the line
  const midpoint = new Vector3().addVectors(start, end).multiplyScalar(0.5);
  boxMesh.position.copy(midpoint);

  // Align the box along the line
  const up = new Vector3(0, 0, 1); // Default orientation (z-axis up)
  boxMesh.quaternion.setFromUnitVectors(up, direction);
};

export const adjustMeshPosition = (mesh: Mesh) => {
  // Compute the bounding box of the geometry
  const bbox = new Box3().setFromObject(mesh);
  const centroid = new Vector3();

  // Get the center of the bounding box
  bbox.getCenter(centroid);

  // Translate the geometry vertices so the center is at (0, 0, 0)
  mesh.geometry.translate(-centroid.x, -centroid.y, -centroid.z);

  // Set the mesh position to the centroid
  mesh.position.copy(centroid);
};

export const createGeometryEdges = (
  geometry: BufferGeometry,
  thresholdAngle: number = 1,
  color: string = "black"
) => {
  const edges = new EdgesGeometry(geometry, thresholdAngle);
  const edgesMaterial = new LineBasicMaterial({ color });
  const edgeLines = new LineSegments(edges, edgesMaterial);

  return edgeLines;
};

export const getCenteroid = (vecs: Vector3[]): Vector3 => {
  const center = new Vector3();

  vecs.forEach((v) => {
    center.x += v.x;
    center.y += v.y;
    center.z += v.z;
  });

  center.x /= vecs.length;
  center.y /= vecs.length;
  center.z /= vecs.length;

  return center;
};
