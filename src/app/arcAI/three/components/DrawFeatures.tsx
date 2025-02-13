import { useAppSelector } from "@/app/lib/hooks";
import React, { useEffect } from "react";
import { getDrawData } from "../../context/DrawCommands";

const DrawFeatures = () => {
  const drawCommand = useAppSelector((state) => state.draw.command);
  let componentToRender: React.ElementType | null = null;
  if (drawCommand !== undefined) {
    const data = getDrawData.filter((d) => d.command === drawCommand);

    if (data.length === 1 && data[0].component) {
      componentToRender = data[0].component;
    }
  }

  useEffect(() => {
    return () => {
      console.log("unmounting draw features");
    };
  }, []);

  return <> {componentToRender && React.createElement(componentToRender)}</>;
};

export default DrawFeatures;
