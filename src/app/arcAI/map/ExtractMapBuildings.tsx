import React, { useEffect, useState } from "react";
import { useCesium } from "resium";
import * as Cesium from "cesium";

const ExtractBuildings = () => {
  const { viewer } = useCesium();
  const [startPosition, setStartPosition] = useState<Cesium.Cartesian2 | null>(
    null
  );
  const [endPosition, setEndPosition] = useState<Cesium.Cartesian2 | null>(
    null
  );
  const [selectedEntities, setSelectedEntities] = useState<Cesium.Entity[]>([]);
  const [selectionBoxStyle, setSelectionBoxStyle] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    if (!viewer) return;

    const canvas = viewer.canvas;

    canvas.addEventListener("mousedown", () => {
      console.log("you clicked me");
    });
    console.log(canvas);

    const startSelection = (event: MouseEvent) => {
      console.log("selections started");
      if (!event.ctrlKey) return; // Only activate if Ctrl is held down
      const start = new Cesium.Cartesian2(event.clientX, event.clientY);
      setStartPosition(start);
      setSelectionBoxStyle({
        left: start.x,
        top: start.y,
        width: 0,
        height: 0,
      });

      // Prevent Cesium's default camera behavior (like orbiting or zooming)
      event.preventDefault();
      event.stopPropagation();
    };

    const updateSelection = (event: MouseEvent) => {
      if (startPosition) {
        const end = new Cesium.Cartesian2(event.clientX, event.clientY);
        setEndPosition(end);

        // Calculate the size and position of the selection box
        const left = Math.min(startPosition.x, end.x);
        const top = Math.min(startPosition.y, end.y);
        const width = Math.abs(startPosition.x - end.x);
        const height = Math.abs(startPosition.y - end.y);

        setSelectionBoxStyle({ left, top, width, height });
      }
    };

    const endSelection = () => {
      if (startPosition && endPosition) {
        const selected = getEntitiesInSelection(
          viewer,
          startPosition,
          endPosition
        );
        setSelectedEntities(selected);
        highlightEntities(selected);
      }
      setStartPosition(null);
      setEndPosition(null);
      setSelectionBoxStyle(null); // Hide selection box
    };
    console.log("registered events");
    canvas.addEventListener("mousedown", startSelection);
    canvas.addEventListener("mousemove", updateSelection);
    canvas.addEventListener("mouseup", endSelection);

    return () => {
      console.log("removed events");
      canvas.removeEventListener("mousedown", startSelection);
      canvas.removeEventListener("mousemove", updateSelection);
      canvas.removeEventListener("mouseup", endSelection);
    };
  }, [viewer, startPosition, endPosition]);

  const getEntitiesInSelection = (
    viewer: Cesium.Viewer,
    start: Cesium.Cartesian2,
    end: Cesium.Cartesian2
  ): Cesium.Entity[] => {
    const scene = viewer.scene;
    const entities = viewer.entities.values;

    const minX = Math.min(start.x, end.x);
    const maxX = Math.max(start.x, end.x);
    const minY = Math.min(start.y, end.y);
    const maxY = Math.max(start.y, end.y);

    return entities.filter((entity) => {
      if (!entity.position) return false;

      const position = scene.cartesianToCanvasCoordinates(
        entity.position.getValue(viewer.clock.currentTime)
      );
      if (!position) return false;

      return (
        position.x >= minX &&
        position.x <= maxX &&
        position.y >= minY &&
        position.y <= maxY
      );
    });
  };

  const highlightEntities = (entities: Cesium.Entity[]) => {
    entities.forEach((entity) => {
      if (entity.polygon) {
        entity.polygon.material = Cesium.Color.YELLOW.withAlpha(0.5);
      }
      if (entity.polyline) {
        entity.polyline.material = Cesium.Color.RED;
      }
    });
  };

  return (
    <>
      {/* Selection box overlay using Tailwind CSS */}
      {selectionBoxStyle && (
        <div
          style={{
            left: `${selectionBoxStyle.left}px`,
            top: `${selectionBoxStyle.top}px`,
            width: `${selectionBoxStyle.width}px`,
            height: `${selectionBoxStyle.height}px`,
          }}
          className="absolute bg-green-300 bg-opacity-30 border-2 border-green-500 pointer-events-none"
        />
      )}
    </>
  );
};

export default ExtractBuildings;
