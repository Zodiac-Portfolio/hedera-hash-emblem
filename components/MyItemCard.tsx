import React from "react";
import { NFTInfoObject } from "../context/HashConnectAPIProvider";

type PropsType = {
  item: NFTInfoObject;
};

export default function MyItemCard(props: PropsType): JSX.Element {
  const { item } = props;
  return (
    <div
      key={`${item.metadata.name}-999`}
      className="border border-gray-600 rounded-lg flex flex-col w-[200px] p-5 border items-center gap-3 border-black bg-black bg-opacity-60 text-white"
    >
      <img width={200} height={200} src={item.metadata.image} alt={`gsgs`} />

      <div className="text-center gap-2 text-2xl w-full">
        {item.metadata.name}
      </div>
    </div>
  );
}
