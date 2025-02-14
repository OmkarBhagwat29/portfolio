import { SnapType } from "@/app/lib/features/snap/SnapTypes";

export interface SnapOption {
  name: SnapType;
  isActive?: boolean;
}

export const getSnapOptions: SnapOption[] = [
  {
    name: "active",
  },
  {
    name: "point",
  },
  {
    name: "end",
  },
  {
    name: "mid",
  },
  {
    name: "near",
  },
  {
    name: "smart",
  },
  {
    name: "ortho",
  },
];
