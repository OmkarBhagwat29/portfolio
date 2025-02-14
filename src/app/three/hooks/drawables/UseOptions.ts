import { Object3D, Vector3 } from "three";

export interface UseLineOptions {
  color?: string;
  lineWidth?: number;
  onSnap?: (e: MouseEvent) => Vector3 | undefined;
  onStart?: () => void;
  onDrawing?: () => void;
  onDrawComplete?: (obj: Object3D) => void;
  onAbort?: (obj: Object3D) => void;
}

export interface UsePointOptions {
  color?: string;
  pointSize?: number;
  sizeAttenuation?: boolean;
  onSnap?: (e: MouseEvent) => Vector3 | undefined;
  onDrawing?: () => void;
  onDrawComplete?: (obj: Object3D) => void;
  onAbort?: (obj: Object3D) => void;
}
