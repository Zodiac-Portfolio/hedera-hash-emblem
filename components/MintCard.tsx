import React from "react";
import { MintItem } from "../pages";

type PropsType = {
  item: MintItem;
  handleShowModal: (arg0: MintItem) => void;
};

export default function MintCard(props: PropsType): JSX.Element {
  const { item } = props;
  return (
    <div
      key={`${item.name}-${item.supply}`}
      className="border border-gray-600 rounded-lg flex flex-col w-[300px] p-5 border items-center gap-3 border-black bg-black bg-opacity-60 text-white"
    >
      <img width={500} height={500} src={item.imageURL} alt={`gsgs`} />

      <div className="flex flex-col gap-2 items-start w-full">
        <div className="flex w-full justify-between items-center">
          <p className="text-3xl mb-2">{item.name}</p>
          <p className="uppercase text-lg mb-2 text-darkgray-300">
            {item.supply} left
          </p>
        </div>

        <div className="mt-2 border-top border-white w-full flex justify-between items-center">
          <div className="flex flex-col items-start">
            <div className="text-sm text-gray-400">Minting Price</div>
            <div className="text-lg">1 HBAR</div>
          </div>
          <button
            className="rounded-xl w-fit py-3 px-3 bg-orange-800 text-white"
            onClick={() => props.handleShowModal(item)}
          >
            Mint NFT
          </button>
        </div>
      </div>
    </div>
  );
}