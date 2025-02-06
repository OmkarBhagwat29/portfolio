import { Size } from "@react-three/fiber";
import { Camera, Plane, Vector3 } from "three";
import { GetMouseCoordinates, GetViewportCoordinates } from "./utils";

export const getPointOnMouseEvent = (
  e: MouseEvent,
  camera: Camera,
  size: Size,
  snapPlane: Plane
): Vector3 => {
  const mouse = GetMouseCoordinates(
    e.clientX,
    e.clientY,
    size.width,
    size.height
  );

  const pt = GetViewportCoordinates(camera, mouse, snapPlane);

  return pt;
};
