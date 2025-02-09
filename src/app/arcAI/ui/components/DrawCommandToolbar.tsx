import Toolbar from "@/app/ui/components/Toolbar";
import React from "react";
import { getDrawCommands } from "../../context/DrawCommands";
import { RxHamburgerMenu } from "react-icons/rx";

const DrawCommandToolbar = () => {
  return (
    <Toolbar
      className="bg-slate-300 absolute top-5 left-5 flex flex-col bg-slate-300justify-center items-center shadow-md rounded-md"
      toolbarHandle={
        <div className="p-2 relative flex justify-center rounded-md ">
          <RxHamburgerMenu />
        </div>
      }
      isVertical={true}
    >
      {getDrawCommands.map((c) => {
        if (!c.icon) return null;

        const Icon = c.icon;

        return (
          <div
            key={crypto.randomUUID()}
            className="p-2 hover:bg-slate-100 cursor-pointer flex justify-center items-center"
            onClick={(e) => {
              e.stopPropagation();
              console.log("You clicked ", c.type);
            }}
          >
            <Icon />
          </div>
        );
      })}
    </Toolbar>
  );
};

export default DrawCommandToolbar;
