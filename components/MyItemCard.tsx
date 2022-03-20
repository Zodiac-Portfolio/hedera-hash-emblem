import React from "react";
import { NFTInfoObject } from "../context/utils/types";

type PropsType = {
  item: NFTInfoObject;
};

export default function MyItemCard(props: PropsType): JSX.Element {
  const { item } = props;
  return (
    <div
      key={`${item.metadata.name}-999`}
      className="border border-gray-600 h-fit rounded-lg flex flex-col  p-5 border items-center gap-3 border-black bg-black bg-opacity-60 text-white"
    >
      <img width={64} height={64} src={item.metadata.image} alt={`gsgs`} />

      <div className="text-center gap-2 text-xl w-full">
        {item.metadata.name}
      </div>
    </div>
  );
}
