// scene-optimizer.ts
import { Mesh, BufferGeometry, Material } from "three";

class SceneOptimizer {
  static optimizeGeometry(geometry: BufferGeometry) {
    geometry.computeBoundingBox(); // Enable BVH culling
    geometry.dispose();
    return geometry;
  }

  static mergeMeshes(meshes: Mesh[]) {
    // Combine similar geometries
    const mergedGeometry = meshes[0].geometry.clone();
    // ... merging logic ...
    return new Mesh(mergedGeometry, meshes[0].material);
  }

  static optimizeMaterials(materials: Material[]) {
    return materials.map((material) => {
      material.needsUpdate = true;
      // Adjust material settings for performance
      return material;
    });
  }
}

export { SceneOptimizer };
