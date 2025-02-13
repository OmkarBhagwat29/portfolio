import { addGeometryIds } from "@/app/lib/features/draw/drawSlice";
import { useAppDispatch } from "@/app/lib/hooks";
import { usePoint } from "@/app/three/hooks/drawables/usePoint";
import { useThree } from "@react-three/fiber";
import React, { FC, useEffect } from "react";
import { DrawProps } from "./DrawProps";

const DrawPoint: FC<DrawProps> = ({ onDrawing, onDrawComplete, onAbort }) => {
  const dispatch = useAppDispatch();
  const { scene } = useThree();


  const point = usePoint({ onDrawing, onDrawComplete, onAbort });

  useEffect(() => {
    if (!point) return;

    console.log(point);

    scene.add(point);

    dispatch(addGeometryIds([point.uuid]));
  }, [point, scene, dispatch]);

  return <></>;
};

export default DrawPoint;
