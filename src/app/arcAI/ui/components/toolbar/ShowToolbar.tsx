import Toolbar from "@/app/ui/components/Toolbar";
import React, { FC, ReactNode } from "react";
import { RxHamburgerMenu } from "react-icons/rx";

interface ShowToolbarpProps {
  isVertical: boolean;
  children: ReactNode;
  positionClassNames: string;
}

const ShowToolbar: FC<ShowToolbarpProps> = ({
  isVertical,
  children,
  positionClassNames,
}) => {
  return (
    <Toolbar
      className={`z-50 bg-slate-300 absolute ${positionClassNames}  flex ${
        isVertical ? "flex-col" : "flex-row"
      } bg-slate-300justify-center items-center shadow-md rounded-md overflow-hidden`}
      toolbarHandle={
        <div className={`p-2 relative flex justify-center rounded-md`}>
          <RxHamburgerMenu />
        </div>
      }
      isVertical={isVertical}
    >
      {children}
    </Toolbar>
  );
};

export default ShowToolbar;
