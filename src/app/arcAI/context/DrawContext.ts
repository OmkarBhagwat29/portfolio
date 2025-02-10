import { createContext, useContext } from "react";
import { DrawCommand } from "./DrawCommands";

export interface DrawContextProps {
  drawCommand: DrawCommand;
  setDrawCommand: (command: DrawCommand) => void;
}

export const DrawContext = createContext<DrawContextProps>({
  drawCommand: "none",
  setDrawCommand: () => {},
});

export const useDrawContext = () => {
  return useContext(DrawContext);
};
