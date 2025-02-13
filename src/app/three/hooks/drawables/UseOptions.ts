import { Object3D, Vector3 } from "three";

export interface UseLineOptions {
  color?: string;
  lineWidth?: number;
  snapFunction?: () => Vector3 | undefined;
  onStart?: () => void;
  onDrawing?: () => void;
  onDrawComplete?: (obj: Object3D) => void;
  onAbort?: (obj: Object3D) => void;
}

export interface UsePointOptions {
  color?: string;
  pointSize?: number;
  sizeAttenuation?: boolean;
  snapFunction?: () => Vector3 | undefined;
  onDrawing?: () => void;
  onDrawComplete?: (obj: Object3D) => void;
  onAbort?: (obj: Object3D) => void;
}
