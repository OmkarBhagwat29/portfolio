import React from "react";

const SelectMapArea = () => {
  const handleOnClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      <button
        className="absolute z-50 top-20 right-1/2 bg-slate-300 rounded-md hover:bg-slate-100 cursor-pointer select-none p-2 active:bg-slate-50 transition-colors duration-200 text-sm"
        onClick={handleOnClick}
      >
        Select Map Area
      </button>
    </>
  );
};

export default SelectMapArea;
