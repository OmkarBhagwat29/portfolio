/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useMemo } from "react";
import { LoadingManager, Object3D, ObjectLoader } from "three";

interface ObjLoaderProps {
  loadingManager?: LoadingManager;
  objFile: string;
  setModel: (object: Object3D) => void;
}

const ObjLoader: FC<ObjLoaderProps> = ({
  loadingManager,
  objFile,
  setModel,
}) => {
  const loader = useMemo(() => {
    const loader = new ObjectLoader(loadingManager);
    return loader;
  }, [loadingManager]);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const model = await loader.loadAsync(objFile, () => {
          console.log("loading");
        });

        setModel(model);
      } catch (error) {
        throw error;
      }
    };

    loadModel();
  }, [objFile]);

  return <></>;
};

export default ObjLoader;
