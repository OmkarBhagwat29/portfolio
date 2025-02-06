"use client";
import ColorPicker from "@/app/ui/components/ColorPicker";
import React, { useState } from "react";
import { AiOutlineBgColors } from "react-icons/ai";
import { useCanvasContext } from "../../context/CanvasContext";

const CanvasColorModal = () => {
  const [show, setShow] = useState(false);

  const { setBackgroundColor } = useCanvasContext();
  return (
    <div className=" absolute z-10 bottom-1 right-1 select-none">
      <AiOutlineBgColors
        onClick={() => setShow(!show)}
        className="w-10 h-10 cursor-pointer"
      />

      {show && <ColorPicker setColor={setBackgroundColor} />}
    </div>
  );
};

export default CanvasColorModal;
