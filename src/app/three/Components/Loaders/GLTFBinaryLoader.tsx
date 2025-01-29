import React, { FC, useEffect, useMemo } from "react";
import { LoadingManager, Mesh, Object3D } from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three/examples/jsm/Addons.js";

interface GLTFBinaryLoaderProps {
  loadingManager?: LoadingManager;
  glbFile: string;
  setGltf: (object: GLTF) => void;
  useDraco: boolean;
}

const GLTFBinaryLoader: FC<GLTFBinaryLoaderProps> = ({
  loadingManager,
  glbFile,
  setGltf,
  useDraco,
}) => {
  const loader = useMemo(() => {
    const loader = new GLTFLoader(loadingManager);

    if (useDraco) {
      const dracoLoader = new DRACOLoader(loadingManager);
      dracoLoader.setDecoderPath("/draco/");

      const cpuCores = navigator.hardwareConcurrency || 4; // Default to 4 if unavailable
      console.log(`Setting DRACO worker limit to: ${cpuCores}`);

      dracoLoader.setWorkerLimit(cpuCores);

      loader.setDRACOLoader(dracoLoader);
    }
    return loader;
  }, [loadingManager]);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const model = await loader.loadAsync(glbFile, (e) => {
          console.log("loading");
        });
        setGltf(model);
      } catch (error) {
        throw error;
      }
    };

    loadModel();
  }, [glbFile]);

  return <></>;
};

export default GLTFBinaryLoader;
