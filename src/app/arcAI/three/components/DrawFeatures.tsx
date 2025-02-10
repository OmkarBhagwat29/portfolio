import React, { useEffect } from "react";
import { useDrawContext } from "../../context/DrawContext";

const DrawFeatures = () => {
  const { drawCommand } = useDrawContext();

  useEffect(() => {
    console.log(`you selected ${drawCommand}`);
  }, [drawCommand]);

  return <></>;
};

export default DrawFeatures;
