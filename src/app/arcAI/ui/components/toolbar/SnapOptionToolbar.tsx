import React, { useState } from "react";
import ShowToolbar from "./ShowToolbar";
import { getSnapOptions, SnapOption } from "@/app/arcAI/context/SnapOptions";

const SnapOptionToolbar = ({ isVertical }: { isVertical: boolean }) => {
  const [options, setOptions] = useState<SnapOption[]>(getSnapOptions);

  const onOptionValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const optionName = event.target.value;

    setOptions((prv) => {
      return prv.map((item) => {
        if (item.name === optionName) {
          item.isActive = event.target.checked;
        }

        return item;
      });
    });
  };

  return (
    <>
      <ShowToolbar isVertical={isVertical} positionClassNames="top-5 left-40">
        <>
          {options.map((s, index) => (
            <div
              key={s.name}
              className="px-2 py-1 w-full h-full flex gap-1 justify-center items-center hover:bg-slate-100 select-none"
            >
              <input
                id={`${s.name}`}
                type="checkbox"
                className="cursor-pointer"
                value={s.name}
                disabled={options[0].isActive || index === 0 ? false : true}
                onChange={onOptionValueChange}
                checked={s.isActive ? s.isActive : false}
              />
              <label htmlFor={`${s.name}`} className="cursor-pointer text-sm">
                {s.name}
              </label>
            </div>
          ))}
        </>
      </ShowToolbar>
    </>
  );
};

export default SnapOptionToolbar;
