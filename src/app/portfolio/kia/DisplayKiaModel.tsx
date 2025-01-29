/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useKiaContext } from "@/app/context/kia/KiaContext";
import AddAmbientLight from "@/app/three/Components/Lights/AddAmbientLight";
import {
  DirectionalLight,
  HemisphereLight,
  Mesh,
  Object3D,
  SRGBColorSpace,
  Vector3,
} from "three";
import React, { useEffect, useState } from "react";
import { AmbientLight } from "three";
import AddDirectionalLight from "@/app/three/Components/Lights/AddDirectionalLight";

import { ChunkedLoader } from "@/app/three/libs/ChunkLoader";

import { adjustMeshPosition } from "@/app/three/libs/ObjectHelper";


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

      //helpers
      //const dirHelper = new DirectionalLightHelper(dirLight, 5);

      //sm?.scene.add(dirHelper);
      //sm?.scene.add(topHelper);
    }
  }, [sm, ambLight, dirLight]);

  useEffect(() => {
    if (sm?.scene) {
      const loadModel = async () => {
        const chunkLowUrls = [
          //panelModel,
          "/models/glb/kia/low-details/kia_1.glb",

          "/models/glb/kia/low-details/transition.glb",

          "/models/glb/kia/low-details/kia_3.glb",
        ];

        const chunkHightUrls = [
          "/models/glb/kia/high-details/kia_1.glb",
          "/models/glb/kia/high-details/transition.glb",
          "/models/glb/kia/high-details/kia_3.glb",
        ];

        const processMesh = (mesh: Mesh) => {
          const originalScale = mesh.scale.clone();
          //console.log("orginal scale", originalScale);
          mesh.frustumCulled = false;
          mesh.castShadow = false;
          mesh.receiveShadow = false;
          //mesh.geometry = BufferGeometryUtils.mergeVertices(mesh.geometry);
          mesh.geometry.scale(
            0.00005 / originalScale.x,
            0.00005 / originalScale.y,
            0.00005 / originalScale.z
          );

          mesh.scale.set(1, 1, 1);

          adjustMeshPosition(mesh);
        };

        const loader = new ChunkedLoader();

        const lowLevelDetails: Object3D = new Object3D();
        const highLevelDetails: Object3D = new Object3D();

        const lowChunks = await loader.loadModelChunks(
          chunkLowUrls,
          (progress) => {
            console.log(`Loading progress: ${Math.round(progress * 100)}%`);
          }
        );

        lowChunks.forEach((chunk) => {
          // console.log(chunk);
          const model = chunk.scene;
          model.traverse((msh) => {
            if (msh instanceof Mesh) {
              processMesh(msh);

              console.log("adding low details");

              lowLevelDetails.add(msh.clone());
            }
          });
        });

        sm.lod.addLevel(lowLevelDetails, 35);

        loader
          .loadModelChunks(chunkHightUrls, (progress) => {
            console.log(
              console.log(`Loading progress: ${Math.round(progress * 100)}%`)
            );
          })
          .then((gltfs) => {
            gltfs.forEach((gltf) => {
              const model = gltf.scene;

              model.traverse((obj) => {
                if (obj instanceof Mesh) {
                  processMesh(obj);
                  highLevelDetails.add(obj.clone());
                }
              });
            });
            console.log("adding High detailed model to scene *********");
            sm.lod.addLevel(highLevelDetails, 5);
          });
        //const mergedGeom =
        //  BufferGeometryUtils.mergeGeometries(geometriesToMerge);

        // const mergedMesh = new Mesh(mergedGeom, material);

        console.log(highLevelDetails);

        // sm.lod.addLevel(highLevelDetails, 5);

        const currentLevelId = sm.lod.getCurrentLevel();

        const level = sm.lod.levels[currentLevelId];

        if (level && level.object) {
          setModel(level.object);
        }
      };

      loadModel();
    }
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
