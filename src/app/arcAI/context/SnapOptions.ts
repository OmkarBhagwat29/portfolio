export interface SnapOption {
  name: string;
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
];
