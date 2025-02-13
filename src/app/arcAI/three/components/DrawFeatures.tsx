import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import React from "react";
import { getDrawData } from "../../context/DrawCommands";
import { setDrawStatus, setDrawType } from "@/app/lib/features/draw/drawSlice";
import { useThree } from "@react-three/fiber";
import { Object3D } from "three";

const DrawFeatures = () => {
  const { scene } = useThree();
  const dispatch = useAppDispatch();
  const drawState = useAppSelector((state) => state.draw);

  let ComponentToRender: React.ElementType | null = null;

  const onStart = () => {
    dispatch(setDrawStatus("started"));
  };
  const onDrawComplete = () => {
    dispatch(setDrawStatus("completed"));
  };
  const onDrawing = () => {
    dispatch(setDrawStatus("drawing"));
  };
  const onAbort = (obj: Object3D) => {
    scene.remove(obj);
    dispatch(setDrawType(undefined));
  };
  
  if (drawState.command !== undefined) {
    const data = getDrawData.filter((d) => d.command === drawState.command);

    if (data.length === 1 && data[0].component) {
      ComponentToRender = data[0].component;
    }
  }

  return (
    <>
      {" "}
      {ComponentToRender &&
        React.createElement(ComponentToRender, {
          onStart,
          onDrawComplete,
          onDrawing,
          onAbort,
        })}
    </>
  );
};

export default DrawFeatures;
