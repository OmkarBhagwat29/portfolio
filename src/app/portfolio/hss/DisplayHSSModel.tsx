import OrbitControls from "@/app/three/Components/Controls/OrbitControl";
import GLTFBinaryLoader from "@/app/three/Components/Loaders/GLTFBinaryLoader";
import React, { useEffect, useState } from "react";
import { Mesh } from "three";
import { GLTF } from "three/examples/jsm/Addons";

const DisplayHSSModel = () => {
  const [model, setModel] = useState<GLTF | undefined>(undefined);

  //only for model
  useEffect(() => {
    if (!model) return;

    console.log(model.scene);
    model.scene.traverse((child) => {
      //console.log(child.userData.extras);
      if (child instanceof Mesh) {
        child.frustumCulled = false;
        //console.log(child.material.color);
      }
    });
  }, [model]);

  //scene manipulation

  return (
    <>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
      </mesh>

      <ambientLight />
      <directionalLight position={[2, 2, 2]} intensity={1.5} />
      <OrbitControls />

      <axesHelper scale={5} />

      <GLTFBinaryLoader
        glbFile="/models/glb/hss/h_block.glb"
        useDraco={true}
        model={model}
        setModel={setModel}
      />
    </>
  );
};

export default DisplayHSSModel;
