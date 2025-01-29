import React, { FC, useEffect } from "react";
import { AmbientLight, Color } from "three";

interface AmbientLightProps {
  color?: string;
  intensity?: number;
  setLight: (light: AmbientLight) => void;
}

const AddAmbientLight: FC<AmbientLightProps> = ({
  color,
  intensity,
  setLight,
}) => {
  useEffect(() => {
    const clr = new Color(color);
    const ambLight = new AmbientLight(clr, intensity);

    setLight(ambLight);
  }, [color, intensity]);
  return <></>;
};

export default AddAmbientLight;
