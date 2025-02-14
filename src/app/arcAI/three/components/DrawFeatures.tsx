import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import React, { useEffect, useRef, useState } from "react";
import { getDrawData } from "../../context/DrawCommands";
import { setDrawStatus, setDrawType } from "@/app/lib/features/draw/drawSlice";
import { useThree } from "@react-three/fiber";
import { Object3D } from "three";

import ObjectCollection from "../../features/ObjectCollection";
import Snap from "../../features/SnapFeature";

const DrawFeatures = () => {
  const { scene, camera, size } = useThree();
  const dispatch = useAppDispatch();
  const drawState = useAppSelector((state) => state.draw);
  const snapState = useAppSelector((state) => state.snap);

  // Create a ref to track the latest snapState
  const snapStateRef = useRef(snapState);

  useEffect(() => {
    snapStateRef.current = snapState;
  }, [snapState]);

  const [drawComponent, setDrawComponent] = useState<
    React.ElementType | undefined
  >(undefined);

  const onStart = () => {
    dispatch(setDrawStatus("started"));
  };
  const onDrawComplete = (obj: Object3D) => {
    dispatch(setDrawStatus("completed"));
    ObjectCollection.addObject(obj);
  };
  const onDrawing = () => {
    dispatch(setDrawStatus("drawing"));
  };
  const onAbort = (obj: Object3D) => {
    scene.remove(obj);
    dispatch(setDrawType(undefined));
  };

  const onSnap = (e: MouseEvent) => {
    e.stopPropagation();
    // Access current state through the ref

    Snap.setSnapState(snapStateRef.current);
    Snap.setSnapPointOnMouseMove(e, camera, size, 0.1);
    //console.log(Snap.snapPoint);
    Snap.visualizeSnapPoint(scene);
    return Snap.snapPoint;
  };

  useEffect(() => {
    if (drawState.command !== undefined) {
      const data = getDrawData.find((d) => d.command === drawState.command);
      if (data && data.component) {
        // console.log("Found component:", data.component);
        setDrawComponent(() => data.component);
      } else {
        setDrawComponent(undefined); // Ensure it's null if not found
      }
    } else {
      setDrawComponent(undefined);
    }
  }, [drawState.command]);

  return (
    <>
      {" "}
      {drawComponent &&
        React.createElement(drawComponent, {
          onStart,
          onDrawComplete,
          onDrawing,
          onAbort,
          onSnap,
        })}
    </>
  );
};

export default DrawFeatures;
