/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useEffect,
  useMemo,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { LoadingManager } from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three/examples/jsm/Addons.js";

interface GLTFBinaryLoaderProps {
  loadingManager?: LoadingManager;
  glbFile: string;
  useDraco: boolean;
  model: GLTF | undefined;
  setModel: (gltf: GLTF) => void;
}

const GLTFBinaryLoader = forwardRef<GLTF | undefined, GLTFBinaryLoaderProps>(
  ({ loadingManager, glbFile, useDraco, setModel, model }, ref) => {

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
          const model = await loader.loadAsync(glbFile, () => {
            console.log("loading");
          });

          setModel(model);
        } catch (error) {
          throw error;
        }
      };

      loadModel();
    }, [glbFile]);

    // Expose the model via the ref
    useImperativeHandle(ref, () => model, [model]);

    return <>{model && <primitive object={model.scene} />}</>;
  }
);

GLTFBinaryLoader.displayName = "LoadGltfModel";

export default GLTFBinaryLoader;
