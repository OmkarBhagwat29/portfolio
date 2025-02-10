import { IconType } from "react-icons";
import { TbLine, TbPointFilled } from "react-icons/tb";

interface DrawProps {
  command: DrawCommand;
  component?: React.ElementType;
  icon?: IconType;
  children?: DrawProps[];
}

export type DrawCommand = "line" | "point" | "none";

export const getDrawData: DrawProps[] = [
  {
    command: "point",
    icon: TbPointFilled,
  },
  {
    command: "line",
    icon: TbLine,
  },
];
