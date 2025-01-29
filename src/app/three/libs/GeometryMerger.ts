import * as THREE from "three";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";

export class GeometryMerger {
  static mergeMeshes(meshes: THREE.Mesh[]): THREE.Mesh | null {
    try {
      // 1. Validate materials compatibility
      const baseMaterial = meshes[0].material;
      const sameMaterial = meshes.every((m) => m.material === baseMaterial);

      if (!sameMaterial) {
        console.warn(
          "Materials differ - merging will create a multi-material mesh"
        );
      }

      // 2. Extract and transform geometries
      const geometries = meshes.map((mesh) => {
        const geometry = mesh.geometry.clone();
        geometry.applyMatrix4(mesh.matrixWorld);
        return geometry;
      });

      const totalVertices = geometries.reduce(
        (sum, g) => sum + g.attributes.position.count,
        0
      );
      console.log("vertices count ->", totalVertices);
      if (totalVertices > 1000000) {
        console.warn("Exceeding recommended vertex count");
      }

      // 3. Merge geometries
      const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries);
      if (!mergedGeometry) throw new Error("Merge failed");
      console.log(mergedGeometry);
      // 4. Cleanup original meshes
      meshes.forEach((mesh) => {
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else {
          mesh.material.dispose();
        }
      });

      // After merging
      mergedGeometry.computeBoundingSphere();
      mergedGeometry.computeBoundingBox();

      return new THREE.Mesh(mergedGeometry, baseMaterial);
    } catch (error) {
      console.error("Merge error:", error);
      return null;
    }
  }
}
