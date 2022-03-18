import React from "react";

export type ActionItem = {
  imageURL: string;
  name: string;
};
type PropsType = {
  item: ActionItem;
};

export default function ActionCard(props: PropsType): JSX.Element {
  const { item } = props;
  return (
    <div
      key={`${item.name}098786`}
      className="border border-gray-600 rounded-lg flex flex-col w-[300px] p-5 border items-center gap-3 border-black bg-black bg-opacity-60 text-white"
    >
      <img width={500} height={500} src={item.imageURL} alt={`gsgs`} />

      <div className="flex flex-col gap-2 items-start w-full">
        <div className="flex w-full justify-between items-center">
          <p className="text-3xl mb-2">{item.name}</p>
        </div>
      </div>
    </div>
  );
}
