import React, { FC, ReactNode, use, useEffect, useRef, useState } from "react";

interface ToolbarProps {
  children: ReactNode;
  className: string;
  toolbarHandle: ReactNode;
  isVertical: boolean;
}

const Toolbar: FC<ToolbarProps> = ({
  children,
  className,
  toolbarHandle,
  isVertical,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const [mouseDown, setMouseDown] = useState(false);

  const toolbarRef = useRef<HTMLDivElement | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();

    setMouseDown(true);
  };

  const handleDrag = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!mouseDown || !toolbarRef.current) return;

    //  console.log("moving");

    toolbarRef.current.style.left = e.clientX - 5 + "px";
    toolbarRef.current.style.top = e.clientY - 5 + "px";
  };

  const handleMouseUp = (e: MouseEvent) => {
    e.stopPropagation();

    // console.log("mouse is up");
    setMouseDown(false);
  };

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div id="toolbar" ref={toolbarRef} className={`${className}`}>
      <div
        id="handle"
        className="cursor-grab"
        onDoubleClick={(e) => {
          e.stopPropagation();
          setCollapsed(!collapsed);
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleDrag}
      >
        {toolbarHandle}
      </div>

      {!collapsed && (
        <div
          id="elements"
          className={`flex ${isVertical ? " flex-col" : "flex-row"} `}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default Toolbar;
