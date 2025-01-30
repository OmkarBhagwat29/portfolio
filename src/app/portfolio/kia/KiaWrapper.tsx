/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import DisplayKiaModel from "./DisplayKiaModel";
import ImageGallerySidebar from "@/app/ui/ImageGallerySidebar";
import { useKiaContext } from "@/app/context/kia/KiaContext";
import KiaInfoSlide from "./KiaInfoSlide";

const KiaWrapper = ({ imageNames }: { imageNames: string[] }) => {
  const { model, sm } = useKiaContext();

  const [, setModelAdd] = useState(false);

  useEffect(() => {
    if (model) {
      const animateModel = () => {
        const levelId = sm!.lod.getCurrentLevel();
        if (levelId === 1) {
          sm!.lod.rotation.y += 0.001;
        }

        requestAnimationFrame(animateModel);
      };

      setTimeout(() => {
        console.log("adding model now");
        sm?.scene.add(sm.lod);

        setModelAdd(true);
      }, 0);

      animateModel();
    }
  }, [model]);
  return (
    <>
      <DisplayKiaModel />
      {
        <>
          <ImageGallerySidebar
            images={imageNames}
            imageFolderPath="images/kia"
          />

          <KiaInfoSlide />
        </>
      }
    </>
  );
};

export default KiaWrapper;
