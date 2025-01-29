/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useMemo } from "react";
import { LoadingManager, Object3D } from "three";
import { Rhino3dmLoader } from "three/examples/jsm/Addons.js";

interface RhinoLoaderProps {
  loadingManager?: LoadingManager;
  rhinoFile: string;
  setModel: (object: Object3D) => void;
}

const RhinoLoader: FC<RhinoLoaderProps> = ({
  loadingManager,
  rhinoFile,
  setModel,
}) => {
  const loader = useMemo(() => {
    const loader = new Rhino3dmLoader(loadingManager);
    loader.setLibraryPath("https://cdn.jsdelivr.net/npm/rhino3dm@8.4.0/");

    return loader;
  }, [loadingManager]);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const model = await loader.loadAsync(rhinoFile, () => {
          console.log("loading");
        });
        setModel(model);
      } catch (error) {
        throw error;
      }
    };

    loadModel();
  }, [rhinoFile]);

  return <></>;
};

export default RhinoLoader;
