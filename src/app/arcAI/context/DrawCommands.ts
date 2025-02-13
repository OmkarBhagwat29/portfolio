import { DrawType } from "@/app/lib/features/draw/DrawType";
import { IconType } from "react-icons";
import { TbLine, TbPointFilled } from "react-icons/tb";
import DrawLine from "../three/Drawables/DrawLine";

interface DrawProps {
  command: DrawType;
  component?: React.ElementType;
  icon?: IconType;
  children?: DrawProps[];
}

export const getDrawData: DrawProps[] = [
  {
    command: "point",
    icon: TbPointFilled,
  },
  {
    command: "line",
    icon: TbLine,
    component: DrawLine,
  },
];
