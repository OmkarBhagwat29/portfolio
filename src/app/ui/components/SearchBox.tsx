import React, { FC } from "react";

interface SearchBoxProps {
  label: string;
  setValue: (val: string) => void;
}

const SearchBox: FC<SearchBoxProps> = ({ label, setValue }) => {
  return (
    <>
      <label htmlFor="search">{label}</label>
      <input
        id="search"
        type="text"
        className="border-2"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          e.stopPropagation();

          setValue(e.target.value);
        }}
      />
    </>
  );
};

export default SearchBox;
