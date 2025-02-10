import React, { FC, ReactNode, useEffect, useRef, useState } from "react";

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

  const [boundingRect, setBoundingRec] = useState<DOMRect | undefined>();

  const toolbarRef = useRef<HTMLDivElement | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();

    setMouseDown(true);
  };

  const handleDrag = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!mouseDown || !toolbarRef.current) return;

    if (boundingRect) {
      const newLeft = Math.min(
        e.clientX,
        window.innerWidth - boundingRect.width - 5 //5px oofset from screen
      );
      const newTop = Math.min(
        e.clientY,
        window.innerHeight - boundingRect.height - 5
      );
      //some adjustments
      toolbarRef.current.style.left = `${newLeft - 10}px`;
      toolbarRef.current.style.top = `${newTop - 10}px`;
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    e.stopPropagation();
    const rec = toolbarRef.current?.getBoundingClientRect();

    if (rec) {
      setBoundingRec(rec);
    }
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
