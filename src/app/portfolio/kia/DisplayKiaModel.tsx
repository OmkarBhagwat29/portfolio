/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import AddAmbientLight from "@/app/three/Components/Lights/AddAmbientLight";
import {
  BufferGeometry,
  DirectionalLight,
  HemisphereLight,
  MathUtils,
  Mesh,
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
import { Sky } from "three/examples/jsm/Addons";
import { useKiaContext } from "../context/kia/KiaContext";

//add BVH extension three.js

BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
Mesh.prototype.raycast = acceleratedRaycast;

const DisplayKiaModel = () => {
  const { sm, model, setModel } = useKiaContext();

  const [ambLight, setAmbLight] = useState<AmbientLight | undefined>(undefined);

  const [dirLight, setDirLight] = useState<DirectionalLight | undefined>(
    undefined
  );

  const [loadingStatus, setLoadingStatus] = useState("0%");

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

      const sky = new Sky();
      sky.scale.setScalar(450000);
      sm.scene.add(sky);

      const skyUniforms = sky.material.uniforms;
      skyUniforms["turbidity"].value = 1;
      skyUniforms["rayleigh"].value = 0.08;
      skyUniforms["mieCoefficient"].value = 0.003;
      skyUniforms["mieDirectionalG"].value = 0.7;

      // Set sun position for evening lighting
      const sun = new Vector3();
      const phi = MathUtils.degToRad(90 - 10); // Low sun angle
      const theta = MathUtils.degToRad(180);
      sun.setFromSphericalCoords(1, phi, theta);
      skyUniforms["sunPosition"].value.copy(sun);
    }
  }, [sm, ambLight, dirLight]);

  useEffect(() => {
    if (sm?.scene) {
      const loadModel = async () => {
        const { lowDetailModel, highDetailModel } = await loadKiaModels(
          setLoadingStatus
        );

        sm.lod.addLevel(lowDetailModel, 35);

        sm.lod.addLevel(highDetailModel, 10);

        sm.scene.add(sm.lod);

        setModel(lowDetailModel);

        //sm.scene.add(new AxesHelper(5));
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
            }
          });
        });
      }
    };
  }, [sm?.scene]);

  return (
    <>
      <AddAmbientLight color="white" intensity={0.05} setLight={setAmbLight} />

      <AddDirectionalLight
        color="white"
        intensity={0.025}
        setLight={setDirLight}
        position={new Vector3(5, 5, 5)}
      />

      {!model && (
        <div className="select-none text-lg absolute bg-white/90 rounded-full p-5 flex-col top-1/2 left-[47%]">
          <div>Model</div>
          <div>Loading...{loadingStatus}</div>
        </div>
      )}
    </>
  );
};

export default DisplayKiaModel;
