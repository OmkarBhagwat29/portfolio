import Image from "next/image";
import React, { useRef, useState } from "react";
import { LuChevronDown } from "react-icons/lu";

const KiaInfoSlide = () => {
  const panelRef = useRef<HTMLDivElement | null>(null);

  const handleRef = useRef<HTMLElement | null>(null);

  const [isShowing, setIsShowing] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    //changes its bottom to bottom-5 and top-0
    setIsShowing(!isShowing);
  };

  return (
    <>
      {/* Sliding Panel with Smooth Transition */}
      <div
        className={`absolute w-full h-screen bg-white/75 flex justify-center items-center select-none transition-opacity duration-700 ${
          isShowing ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="relative w-[90%] h-[90%] p-5">
          <Image
            src={`/images/kia/kia_info.png`}
            alt="nothing to show"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Chevron Button with Smooth Position Transition */}
      <LuChevronDown
        className={`bg-white left-1/2 cursor-pointer rounded-full absolute w-8 h-8 z-20 transition-all duration-700  select-none
        ${isShowing ? "bottom-5 top-auto" : "top-5 bottom-auto"}`}
        onClick={handleClick}
      />
    </>
  );
};

export default KiaInfoSlide;
