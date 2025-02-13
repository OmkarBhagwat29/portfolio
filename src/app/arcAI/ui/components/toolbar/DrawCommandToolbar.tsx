import React from "react";
import { getDrawData } from "../../../context/DrawCommands";

import ShowToolbar from "./ShowToolbar";
import { useAppDispatch } from "@/app/lib/hooks";
import { setDrawStatus, setDrawType } from "@/app/lib/features/draw/drawSlice";
//import { useDrawContext } from "@/app/arcAI/context/DrawContext";

const DrawCommandToolbar = ({ isVertical }: { isVertical: boolean }) => {
  //const { setDrawCommand } = useDrawContext();
  const dispatch = useAppDispatch();

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
              //setDrawCommand(c.command);
              console.log(`you clicked -> ${c.command}`);
              //dispatch action here
              dispatch(setDrawType(c.command));
              dispatch(setDrawStatus("started"));
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
