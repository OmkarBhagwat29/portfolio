import { createContext, useContext } from "react";

export interface CanvasContextProps {
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
}

export const CanvasContext = createContext<CanvasContextProps>({
  backgroundColor: "0xFFFF00",
  setBackgroundColor: () => {},
});

export const useCanvasContext = () => {
  return useContext(CanvasContext);
};
