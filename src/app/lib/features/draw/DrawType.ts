export type DrawType = undefined | "point" | "line" | "polyline";

export type DrawStatus =
  | "started"
  | "drawing"
  | "completed"
  | "aborted"
  | undefined;
