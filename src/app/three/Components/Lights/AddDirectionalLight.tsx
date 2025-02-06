/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect } from "react";
import { Color, DirectionalLight, Vector3 } from "three";

interface DirectionalLightProps {
  color?: string;
  intensity?: number;
  setLight: (light: DirectionalLight) => void;
  position: Vector3;
  lookAt?: Vector3;
}

const AddDirectionalLight: FC<DirectionalLightProps> = ({
  color,
  intensity,
  setLight,
  position,
  lookAt,
}) => {
  useEffect(() => {
    const clr = new Color(color);
    const dirLight = new DirectionalLight(clr, intensity);

    dirLight.position.set(position.x, position.y, position.z);

    if (lookAt) {
      dirLight.lookAt(lookAt);
    }

    setLight(dirLight);
  }, [color, intensity]);

  return <></>;
};

export default AddDirectionalLight;
