import React from "react";
import { useHashConnect } from "../context/HashConnectAPIProvider";
import {
  RiLuggageCartLine,
  RiFlaskFill,
  RiOutletFill,
  RiMoneyDollarCircleFill,
  RiAccountCircleFill,
} from "react-icons/ri";

export default function Navbar(props: {
  handleShowConnectModal:
    | React.MouseEventHandler<HTMLButtonElement>
    | undefined;
}) {
  const { walletData } = useHashConnect();

  return (
    <div className="p-5 sticky h-[100px] w-full bg-[#111827] text-white justify-between flex items-center">
      <div className="flex items-center gap-5">
        <RiOutletFill className="text-3xl" />
        <div className="upercase">Hash Emblem</div>
      </div>

      <div className="flex flex-shrink-0 items-center jusify-center w-fit gap-20">
        <div className="flex items-center text-orange-800 gap-3">
          <RiLuggageCartLine className="text-xl" />
          <div>Market</div>
        </div>
        <div className="flex items-center text-gray-800 gap-3">
          <RiFlaskFill className="text-xl" />
          <div>Labs</div>
        </div>
        <div className="flex items-center text-gray-800 gap-3">
          <RiMoneyDollarCircleFill className="text-xl" />
          <div>Donate</div>
        </div>
      </div>

      {walletData.accountId ? (
        <div className="text-2xl">
          <p>Account: {walletData.accountId} </p>
        </div>
      ) : (
        <div className="flex gap-10">
          <button
            onClick={props.handleShowConnectModal}
            className="flex items-center gap-3 first:hover:flex"
          >
            <div className="">
              <RiAccountCircleFill className="text-3xl" />
            </div>
          </button>
          <button
            onClick={props.handleShowConnectModal}
            className="flex items-center gap-3 first:hover:flex"
          >
            <img
              className="rounded-full"
              alt="hashIcon"
              width={32}
              height={32}
              src="https://lh3.googleusercontent.com/11gZzwVrl8X2eoCbag1y5_hhyUqMKxG-zfDThmczUD7TwlX6HS0207EqyKGcz-FY1ZtDrWBwtNIG5VMlp-f6jkniYQ=w128-h128-e365-rj-sc0x00ffffff"
            />
          </button>
        </div>
      )}
    </div>
  );
}
