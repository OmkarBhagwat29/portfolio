// chunked-loader.ts

import { DRACOLoader, GLTF, GLTFLoader } from "three/examples/jsm/Addons.js";

const initializeDracoLoader = () => {
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");

  const cpuCores = navigator.hardwareConcurrency || 4;

  dracoLoader.setWorkerLimit(cpuCores); // Use 4 web workers
  return dracoLoader;
};

export { initializeDracoLoader };

class ChunkedLoader {
  private loader: GLTFLoader;

  constructor() {
    this.loader = new GLTFLoader();
    this.loader.setDRACOLoader(initializeDracoLoader());
  }

  async loadModelChunks(
    chunkUrls: string[],
    onProgress?: (progress: number) => void
  ) {
    const models = [];
    for (let i = 0; i < chunkUrls.length; i++) {
      const model = await this.loadChunk(chunkUrls[i]);
      models.push(model);
      if (onProgress) onProgress((i + 1) / chunkUrls.length);
    }
    return models;
  }

  private async loadChunk(url: string): Promise<GLTF> {
    return new Promise((resolve, reject) => {
      this.loader.load(url, resolve, undefined, reject);
    });
  }

 
}

export { ChunkedLoader };
