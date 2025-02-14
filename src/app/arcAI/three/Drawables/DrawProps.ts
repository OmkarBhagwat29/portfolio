import { Object3D, Vector3 } from "three";

export interface DrawProps {
  onStart?: () => void;
  onDrawing?: () => void;
  onDrawComplete?: (obj: Object3D) => void;
  onAbort?: (obj: Object3D) => void;
  onSnap?: () => Vector3 | undefined;
}
