"use client";
import {
  BufferGeometry,
  Object3D,
  Points,
  PointsMaterial,
  SRGBColorSpace,
  Texture,
  TextureLoader,
} from "three";
import { toVector3 } from "./converter";

const assignSRGB = (texture: Texture) => {
  texture.colorSpace = SRGBColorSpace;
};

const map = new TextureLoader().load("/icons/control_point.png", assignSRGB);

export class ControlPoints {
  static getControlPoints(object: Object3D): Points[] {
    const geometry = object.geometry;

    const controls = toVector3(geometry);

    const data: Points[] = [];

    controls.forEach((c) => {
      const pointsGeom = new BufferGeometry();
      const material = new PointsMaterial({
        size: 10,
        map: map,
        transparent: true,
        sizeAttenuation: false,
      });

      pointsGeom.setFromPoints([c]);

      const points = new Points(pointsGeom, material);

      points.applyMatrix4(object.matrixWorld);

      data.push(points);
    });

    return data;
  }
}
