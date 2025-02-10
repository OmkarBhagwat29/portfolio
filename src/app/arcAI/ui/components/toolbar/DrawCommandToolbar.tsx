import React from "react";
import { getDrawData } from "../../../context/DrawCommands";

import ShowToolbar from "./ShowToolbar";
import { useDrawContext } from "@/app/arcAI/context/DrawContext";

const DrawCommandToolbar = ({ isVertical }: { isVertical: boolean }) => {
  const { setDrawCommand } = useDrawContext();

  return (
    <ShowToolbar isVertical={isVertical} positionClassNames="top-10 left-5">
      {getDrawData.map((c) => {
        if (!c.icon) return null;

        const Icon = c.icon;

        return (
          <div
            key={crypto.randomUUID()}
            className="p-2 hover:bg-slate-100 cursor-pointer flex justify-center items-center"
            onClick={(e) => {
              e.stopPropagation();
              setDrawCommand(c.command);
            }}
          >
            <Icon />
          </div>
        );
      })}
    </ShowToolbar>
  );
};

export default DrawCommandToolbar;
