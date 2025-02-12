import React, { useEffect } from "react";
import { useDrawContext } from "../../context/DrawContext";
import { MapBuildingProps, useMapContext } from "../../context/MapContext";
import { useThree } from "@react-three/fiber";
import {
  DoubleSide,
  ExtrudeGeometry,
  Mesh,
  MeshStandardMaterial,
  Shape,
} from "three";
import { remap } from "@/app/libs/maths";

const DrawFeatures = () => {
  const { drawCommand } = useDrawContext();

  const { selectedMapObjects, setSelectedMapObjects } = useMapContext();

  const { scene } = useThree();

  useEffect(() => {
    if (selectedMapObjects.length === 0) return;

    console.log(selectedMapObjects);

    const scaleCoords = (scaleMultFactor: number, lon: number, lat: number) => {
      const x = lon * scaleMultFactor;
      const y = lat * scaleMultFactor;

      // console.log(lon);

      return { x, y };
    };

    selectedMapObjects.map((mapObj: MapBuildingProps) => {
      const coords = mapObj.coords;

      // console.log("main coords", coords);

      if (mapObj.polygonType === "Polygon") {
        const shape = new Shape();

        coords.map((set) => {
          const { minX, maxX, minY, maxY } = set.reduce(
            (acc, [x, y]) => ({
              minX: Math.min(acc.minX, x),
              maxX: Math.max(acc.maxX, x),
              minY: Math.min(acc.minY, y),
              maxY: Math.max(acc.maxY, y),
            }),
            {
              minX: Infinity,
              maxX: -Infinity,
              minY: Infinity,
              maxY: -Infinity,
            }
          );

          // console.log("min X", minX);
          // console.log("max X", maxX);
          // console.log("min Y", minY);
          // console.log("max Y", maxY);

          set.map((subSet: number[], index: number) => {
            const rX = remap(subSet[0], minX, maxX, 0, 1);
            const rY = remap(subSet[1], minY, maxY, 0, 1);

            const { x, y } = scaleCoords(100, rX, rY);

            if (index === 0) {
              shape.moveTo(x, y);
            } else {
              shape.lineTo(x, y);
            }
          });
        });
        const geom = new ExtrudeGeometry(shape, {
          depth: 2,
          bevelEnabled: false,
        });
        const mat = new MeshStandardMaterial({
          side: DoubleSide,
          color: "pink",
        });

        const mesh = new Mesh(geom, mat);
        mesh.geometry.rotateX((-90.0 * Math.PI) / 180.0);

        scene.add(mesh);
      } else {
        //buildings with multiple polygon found
      }
    });

    setSelectedMapObjects([]);
  }, [selectedMapObjects, scene]);

  return <></>;
};

export default DrawFeatures;
