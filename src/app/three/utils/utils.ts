import * as th from "three";

const rayCaster = new th.Raycaster();
const intersectionPoint = new th.Vector3();
const vec = new th.Vector3(); // create once and reuse

export const GetViewportCoordinates = (
  camera: th.Camera,
  mouse: th.Vector2,
  plane?: th.Plane
): th.Vector3 => {
  if (plane) {
    rayCaster.setFromCamera(mouse, camera);

    rayCaster.ray.intersectPlane(plane, intersectionPoint);
  } else {
    vec.set(mouse.x, mouse.y, 0.5);

    vec.unproject(camera);

    vec.sub(camera.position).normalize();

    const distance = -camera.position.z / vec.z;

    intersectionPoint.copy(camera.position).add(vec.multiplyScalar(distance));
  }

  return intersectionPoint;
};

export const GetMouseCoordinates = (
  clientX: number,
  clientY: number,
  canvasWidth: number,
  canvasHeight: number
): th.Vector2 => {
  const x = (clientX / canvasWidth) * 2 - 1;
  const y = -(clientY / canvasHeight) * 2 + 1;

  return new th.Vector2(x, y);
};

export const getCentroid = (obj: th.Object3D): th.Vector3 | null => {
  let geom: th.BufferGeometry;
  if (
    obj instanceof th.Mesh ||
    obj instanceof th.Points ||
    obj instanceof th.Line
  ) {
    geom = obj.geometry;
  } else {
    return null;
  }

  geom.computeBoundingBox();

  // Get the bounding box and calculate the center
  const boundingBox = geom.boundingBox;
  if (boundingBox) {
    const centroid = boundingBox.getCenter(new th.Vector3());

    // Apply the object's world matrix to the centroid for proper world positioning
    obj.updateMatrixWorld(true);
    centroid.applyMatrix4(obj.matrixWorld);

    return centroid;
  }

  return null;
};

export const getRandomWarmColor = () => {
  const hue = Math.floor(Math.random() * 60); // 0 to 60 for warm colors
  const saturation = Math.floor(60 + Math.random() * 40); // 60% to 100% saturation
  const lightness = Math.floor(40 + Math.random() * 20); // 40% to 60% lightness
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export const getObjectsByNames = (
  model: th.Object3D,
  names: string[]
): th.Object3D[] => {
  const foundObjs: th.Object3D[] = [];

  model.traverse((child) => {
    if (names.includes(child.name)) {
      foundObjs.push(child);
    }
  });
  return foundObjs;
};
