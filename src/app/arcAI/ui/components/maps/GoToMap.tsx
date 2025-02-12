import { useMapContext } from "@/app/arcAI/context/MapContext";
import { redirect } from "next/navigation";
import React from "react";

const GoToMap = () => {
  // const [showMap, setShowMap] = useState(false);

  const { loadMap, setLoadMap } = useMapContext();
  return (
    <>
      <button
        className="z-50 absolute bg-slate-300 rounded-lg hover:bg-slate-200 active:bg-slate-50 cursor-pointer select-none duration-200 transition-colors shadow-md p-2 top-5 right-80 text-sm"
        onClick={(e) => {
          e.stopPropagation();
          setLoadMap(!loadMap);

          //redirect("/arcAI/map");
        }}
      >
        {!loadMap ? "Go to Map" : "Exit"}
      </button>

      {/* {showMap && <LoadMap />} */}
    </>
  );
};

export default GoToMap;
