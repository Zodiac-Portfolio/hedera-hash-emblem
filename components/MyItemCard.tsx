import React from "react";
import { MintItem } from "../pages";

type PropsType = {
  item: MintItem;
};

export default function MyItemCard(props: PropsType): JSX.Element {
  const { item } = props;
  return (
    <div
      key={`${item.name}-${item.supply}`}
      className="border border-gray-600 rounded-lg flex flex-col w-[200px] p-5 border items-center gap-3 border-black bg-black bg-opacity-60 text-white"
    >
      <img width={200} height={200} src={item.imageURL} alt={`gsgs`} />

      <div className="text-center gap-2 text-2xl w-full">{item.name}</div>
    </div>
  );
}
