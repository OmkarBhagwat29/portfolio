import { DrawType } from "@/app/lib/features/draw/DrawType";
import { IconType } from "react-icons";
import { TbLine, TbPointFilled } from "react-icons/tb";
import { DrawLine, DrawPoint } from "../three/Drawables";
import { MdPolyline } from "react-icons/md";

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
    component: DrawPoint,
  },
  {
    command: "line",
    icon: TbLine,
    component: DrawLine,
  },
  {
    command: "polyline",
    icon: MdPolyline,
    component: DrawLine,
  },
];
