import {
  Color,
  LOD,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import Stats from "three/examples/jsm/libs/stats.module.js";

class SceneManager {
  static isntance: SceneManager;

  canvas: HTMLCanvasElement;
  scene: Scene;
  camera: PerspectiveCamera;
  width: number;
  height: number;
  renderer: WebGLRenderer;
  controls: OrbitControls;
  lod: LOD;

  stats = new Stats();
  private constructor(_canvas: HTMLCanvasElement) {
    this.canvas = _canvas;
    this.width = this.canvas.clientWidth;
    this.height = this.canvas.clientHeight;
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(
      45,
      this.width / this.height,
      0.01,
      1000
    );

    this.lod = new LOD();

    this.camera.position.set(2, 2, 2);

    this.scene.add(this.camera);
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true, // Disable antialiasing for better performance
      precision: "lowp", // Use low precision shaders
      powerPreference: "high-performance", // Optimize for performance
      logarithmicDepthBuffer: true, // Prevent z-fighting for large models
      alpha: false, // Avoid transparency calculations
    });
    this.renderer.setSize(this.width, this.height);
    const color = new Color().setRGB(0.5, 0.5, 0.75, SRGBColorSpace);
    this.renderer.setClearColor(color);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = false;

    //this.scene.add(new AxesHelper(3));

    this.animate();

    window.addEventListener("resize", this.onWindowResize);

    document.body.appendChild(this.stats.dom);
  }

  private onWindowResize = () => {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.renderer.setSize(this.width, this.height);

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  };

  private animate = () => {
    this.stats.begin();
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    this.renderer.clearDepth();

    this.lod.update(this.camera);

    this.stats.end();

    requestAnimationFrame(this.animate);
  };

  public static getInstance(canvas?: HTMLCanvasElement) {
    if (!SceneManager.isntance && canvas) {
      SceneManager.isntance = new SceneManager(canvas);
    }

    return SceneManager.isntance;
  }
}

export default SceneManager;
