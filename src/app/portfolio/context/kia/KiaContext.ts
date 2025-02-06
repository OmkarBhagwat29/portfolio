import SceneManager from "@/app/three/SceneManager";
import { createContext, useContext } from "react";
import { Object3D } from "three";

interface KiaContextProps {
  sm: SceneManager | undefined;
  setSceneManager: (sm: SceneManager) => void;
  model: Object3D | undefined;
  setModel: (object: Object3D) => void;
}

export const KiaContext = createContext<KiaContextProps>({
  sm: undefined,
  setSceneManager: () => {},
  model: undefined,
  setModel: () => {},
});

export const useKiaContext = () => {
  return useContext(KiaContext);
};
