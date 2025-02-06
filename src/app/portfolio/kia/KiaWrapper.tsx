/* eslint-disable react-hooks/exhaustive-deps */
import React, { Suspense, useEffect, useState } from "react";
import DisplayKiaModel from "./DisplayKiaModel";
import ImageGallerySidebar from "@/app/ui/ImageGallerySidebar";
import { useKiaContext } from "@/app/portfolio/context/kia/KiaContext";
import KiaInfoSlide from "./KiaInfoSlide";

const KiaWrapper = ({ imageNames }: { imageNames: string[] }) => {
  const { model, sm } = useKiaContext();

  const [, setModelAdd] = useState(false);

  useEffect(() => {
    if (model) {
      const animateModel = () => {
        sm!.lod.rotation.y += 0.003;
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
      <Suspense>
        <DisplayKiaModel />
      </Suspense>

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
