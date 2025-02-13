import {
  addGeometryIds,
  setDrawStatus,
} from "@/app/lib/features/draw/drawSlice";
import { useAppDispatch } from "@/app/lib/hooks";
import { useLine } from "@/app/three/hooks/drawables/useLine";
import { useThree } from "@react-three/fiber";
import React, { useEffect } from "react";

const DrawLine = () => {
  const dispatch = useAppDispatch();
  const { scene } = useThree();

  const line = useLine({
    onDrawComplete: () => {
      dispatch(setDrawStatus("completed"));
    },
    onDrawing: () => {
      dispatch(setDrawStatus("drawing"));
    },
  });

  useEffect(() => {
    if (!line) return;

    console.log(line);

    scene.add(line);
    dispatch(addGeometryIds([line.uuid]));

    return () => {
      console.log("unmounting draw line");
    };
  }, [line, scene, dispatch]);

  return <></>;
};

export default DrawLine;
