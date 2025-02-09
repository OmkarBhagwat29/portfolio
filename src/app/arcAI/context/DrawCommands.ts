import { IconType } from "react-icons";
import { TbLine, TbPointFilled } from "react-icons/tb";

interface DrawCommand {
  type: DrawType;
  component?: React.ElementType;
  icon?: IconType;
  children?: DrawCommand[];
}

export type DrawType = "line" | "point";

export const getDrawCommands: DrawCommand[] = [
  {
    type: "point",
    icon: TbPointFilled,
  },
  {
    type: "line",
    icon: TbLine,
  },
];
