import { ChunkedLoader } from "@/app/three/libs/ChunkLoader";
import { mergeMeshes } from "@/app/three/libs/ObjectHelper";
import { Material, Mesh, Object3D } from "three";

export const loadKiaModels = async (
  setLoadingStatus: (status: string) => void
): Promise<{
  lowDetailModel: Object3D;
  highDetailModel: Object3D;
}> => {
  const chunkLowUrls = [
    //panelModel,
    "/models/glb/kia/low-details/kia_1.glb",
    "/models/glb/kia/low-details/kia_2.glb",
    "/models/glb/kia/low-details/kia_3.glb",
  ];

  const chunkHightUrls = [
    "/models/glb/kia/high-details/kia_1.glb",
    "/models/glb/kia/high-details/kia_2.glb",
    "/models/glb/kia/high-details/kia_3.glb",
  ];

  const processMesh = (mesh: Mesh) => {
    const originalScale = mesh.scale.clone();

    mesh.frustumCulled = true;
    mesh.castShadow = false;
    mesh.receiveShadow = false;

    mesh.geometry.scale(
      0.00005 / originalScale.x,
      0.00005 / originalScale.y,
      0.00005 / originalScale.z
    );

    // mesh.scale.set(1, 1, 1);

    //adjustMeshPosition(mesh);
  };

  const loader = new ChunkedLoader();

  const lowLevelDetails: Object3D = new Object3D();
  const highLevelDetails: Object3D = new Object3D();

  const lowChunks = await loader.loadModelChunks(chunkLowUrls, () => {
    // console.log(`Loading progress: ${Math.round(progress * 100)}%`);
  });

  lowChunks.forEach((chunk) => {
    // console.log(chunk);
    const model = chunk.scene;
    model.traverse((msh) => {
      if (msh instanceof Mesh) {
        processMesh(msh);

        //console.log("adding low details");

        lowLevelDetails.add(msh.clone());
      }
    });
  });

  //sm.lod.addLevel(lowLevelDetails, 35);
  // let veriticesCount = 0;
  const hgihChunks = await loader.loadModelChunks(
    chunkHightUrls,
    (progress) => {
      //console.log(`Loading progress: ${Math.round(progress * 100)}%`);

      setLoadingStatus(` ${Math.round(progress * 100)}%`);
    }
  );

  hgihChunks.forEach((chunk) => {
    const model = chunk.scene;

    const meshes: Mesh[] = [];
    model.traverse((obj) => {
      if (obj instanceof Mesh) {
        processMesh(obj);

        meshes.push(obj);

        // highLevelDetails.add(obj.clone());

        //veriticesCount += obj.geometry.attributes.position.count;
      }
    });

    const material = meshes[0].material as Material;

    const mergedMesh = mergeMeshes(meshes, material);

    if (mergedMesh) {
      highLevelDetails.add(mergedMesh);
    } else {
      highLevelDetails.add(...meshes);
    }
  });

  return { lowDetailModel: lowLevelDetails, highDetailModel: highLevelDetails };
};
