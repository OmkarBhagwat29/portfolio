import React, { FC, useEffect } from "react";
import { DrawProps } from "./DrawProps";
import { useThree } from "@react-three/fiber";
import { useAppDispatch } from "@/app/lib/hooks";
import { usePolyline } from "@/app/three/hooks/drawables/usePolyline";
import { addGeometryIds } from "@/app/lib/features/draw/drawSlice";

const DrawPolyline: FC<DrawProps> = ({
  onStart,
  onDrawing,
  onDrawComplete,
  onAbort,
  onSnap,
}) => {
  const dispatch = useAppDispatch();
  const { scene } = useThree();

  const pl = usePolyline({
    onStart,
    onDrawing,
    onDrawComplete,
    onAbort,
    onSnap,
  });

  useEffect(() => {
    if (!pl) return;

    console.log(pl);

    scene.add(pl);
    dispatch(addGeometryIds([pl.uuid]));

    return () => {};
  }, [pl, scene, dispatch]);

  return <></>;
};

export default DrawPolyline;
