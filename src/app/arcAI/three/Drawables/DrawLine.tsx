import { addGeometryIds } from "@/app/lib/features/draw/drawSlice";
import { useAppDispatch } from "@/app/lib/hooks";
import { useLine } from "@/app/three/hooks/drawables/useLine";
import { useThree } from "@react-three/fiber";
import React, { FC, useEffect } from "react";
import { DrawProps } from "./DrawProps";

const DrawLine: FC<DrawProps> = ({
  onStart,
  onDrawing,
  onDrawComplete,
  onAbort,
  onSnap,
}) => {
  const dispatch = useAppDispatch();
  const { scene } = useThree();

  const line = useLine({ onStart, onDrawing, onDrawComplete, onAbort, onSnap });

  useEffect(() => {
    if (!line) return;

    console.log(line);

    scene.add(line);
    dispatch(addGeometryIds([line.uuid]));

    return () => {};
  }, [line, scene, dispatch]);

  return <></>;
};

export default DrawLine;
