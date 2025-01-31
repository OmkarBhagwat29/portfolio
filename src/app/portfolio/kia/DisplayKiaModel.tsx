/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useKiaContext } from "@/app/context/kia/KiaContext";
import AddAmbientLight from "@/app/three/Components/Lights/AddAmbientLight";
import {
  AxesHelper,
  BoxGeometry,
  BufferGeometry,
  DirectionalLight,
  DoubleSide,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  SphereGeometry,
  SRGBColorSpace,
  Vector3,
} from "three";
import React, { useEffect, useState } from "react";
import { AmbientLight } from "three";
import AddDirectionalLight from "@/app/three/Components/Lights/AddDirectionalLight";

import {
  acceleratedRaycast,
  computeBoundsTree,
  disposeBoundsTree,
} from "three-mesh-bvh";
import { loadKiaModels } from "./KiaHelper";

//add BVH extension three.js

BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
Mesh.prototype.raycast = acceleratedRaycast;

const DisplayKiaModel = () => {
  const { sm, setModel } = useKiaContext();

  const [ambLight, setAmbLight] = useState<AmbientLight | undefined>(undefined);

  const [dirLight, setDirLight] = useState<DirectionalLight | undefined>(
    undefined
  );

  //setup loop
  useEffect(() => {
    if (sm && ambLight && dirLight) {
      sm.renderer.shadowMap.enabled = false;
      sm.renderer.setPixelRatio(0.75);
      sm.renderer.shadowMap.enabled = false;
      sm.renderer.outputColorSpace = SRGBColorSpace;
      sm.renderer.sortObjects = false;
      sm.renderer.info.autoReset = false;
      sm.renderer.debug.checkShaderErrors = false;

      sm.camera.position.set(0, 95, 0);

      console.log("adding infra");

      const ambient = new HemisphereLight(0xffffff, 0x444444, 5.0);
      const dirLight = new DirectionalLight(0xffffff, 1.0);
      dirLight.position.set(10, 20, 10);
      sm.scene.add(ambient, dirLight);
      //sm?.scene.add(topLight);

      sm!.controls.minDistance = 0.1;
      sm!.controls.maxDistance = 100;
    }
  }, [sm, ambLight, dirLight]);

  useEffect(() => {
    if (sm?.scene) {
      const loadModel = async () => {
        const { lowDetailModel, highDetailModel } = await loadKiaModels();

        sm.lod.addLevel(lowDetailModel, 35);

        sm.lod.addLevel(highDetailModel, 10);

        sm.scene.add(sm.lod);

        setModel(lowDetailModel);

        // console.log(highDetailModel);

        sm.scene.add(new AxesHelper(5));
      };

      loadModel();

  
    }

    return () => {
      if (sm && sm.scene) {
        sm.lod.levels.forEach((l) => {
          l.object.children.forEach((c) => {
            if (c instanceof Mesh && c.geometry.disposeBoundsTree) {
              c.geometry.disposeBoundsTree();
              c.geometry.dispose();
              console.log("dispositng");
            }
          });
        });
      }
    };
  }, [sm?.scene]);

  return (
    <>
      <AddAmbientLight color="white" intensity={15} setLight={setAmbLight} />

      <AddDirectionalLight
        color="white"
        intensity={10}
        setLight={setDirLight}
        position={new Vector3(5, 5, 5)}
      />

      {/* <AddDirectionalLight
        color="white"
        intensity={5}
        setLight={setTopLight}
        position={new Vector3(0, 20, 0)}
      /> */}
    </>
  );
};

export default DisplayKiaModel;
