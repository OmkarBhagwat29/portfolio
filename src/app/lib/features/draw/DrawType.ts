export type DrawType = undefined | "point" | "line";

export type DrawStatus =
  | "started"
  | "drawing"
  | "completed"
  | "aborted"
  | undefined;
