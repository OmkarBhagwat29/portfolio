import { Object3D } from "three";

export interface DrawProps {
  onStart?: () => void;
  onDrawing?: () => void;
  onDrawComplete?: (obj: Object3D) => void;
  onAbort?: (obj: Object3D) => void;
}
