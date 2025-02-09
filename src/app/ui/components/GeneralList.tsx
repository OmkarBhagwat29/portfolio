import React, { FC } from "react";

export interface GeneralListProps {
  items: object[];
  resourceName: string;
  ItemComponent: React.ElementType;
}

const GeneralList: FC<GeneralListProps> = ({
  items,
  resourceName,
  ItemComponent,
}) => {
  return (
    <>
      {items.map((item, index) => (
        <ItemComponent
          key={crypto.randomUUID()}
          {...{ [resourceName]: item }}
        />
      ))}
    </>
  );
};

export default GeneralList;
