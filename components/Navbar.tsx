import React from "react";

import { useRouter } from "next/router";
import { useAuth } from "../context/AuthProvider";
import Image from "next/image";
import { RiAccountCircleFill } from "react-icons/ri";
import { SaveData } from "../context/HashConnectAPIProvider";
//import Link from "next/link";

export default function Navbar(props: {
  handleShowConnectModal:
    | React.MouseEventHandler<HTMLButtonElement>
    | undefined;
  handleShowProfileModal:
    | React.MouseEventHandler<HTMLButtonElement>
    | undefined;
  walletData: SaveData;
}) {
  const router = useRouter();
  /*   const { walletData } = useHashConnect(); */
  const { authUser } = useAuth();

  return (
    <div className="p-5 sticky h-[100px] w-full bg-[#111827] text-white justify-evenly flex items-center">
      <div
        onClick={() => router.push("/")}
        className="cursor-pointer flex items-center gap-5"
      >
        <Image
          className="rounded-full"
          alt="hashIcon"
          width={64}
          height={64}
          src="https://ipfs.io/ipfs/QmbMtEZAxHbobGGypwXtAfwvGtfcX9oQvYAL8GNhZEbjQ1"
        />{" "}
        <div className="text-xl uppercase text-gray-300">Hash Emblem</div>
      </div>

      <div className="flex flex-shrink- items-center jusify-center  gap-20">
        {/* {authUser.firebaseId != "" && (
          <>
            <Link href={"/mint"} passHref={true}>
              <div className="flex cursor-pointer items-center text-orange-700 gap-3">
                <RiLuggageCartLine className="text-xl uppercase" />
                <div>Mint</div>
              </div>
            </Link>

            <div className="flex items-center text-gray-800 gap-3">
              <RiMoneyDollarCircleFill className="text-xl" />
              <div>Donate</div>
            </div>
          </>
        )} */}
      </div>
      <div className="flex gap-10">
        <button
          onClick={
            authUser.firebaseId !== ""
              ? props.handleShowProfileModal
              : props.handleShowConnectModal
          }
          className="flex items-center gap-3 first:hover:flex"
        >
          <div className="">
            {authUser.profileImage ? (
              <img
                className="rounded-full"
                alt="hashIcon"
                width={64}
                height={64}
                src={authUser.profileImage}
              />
            ) : (
              <RiAccountCircleFill className="text-5xl" />
            )}
          </div>
          {authUser.firebaseId !== "" && (
            <div>
              <div className="text-md uppercase text-gray-30">
                {authUser.alias}
              </div>
              <div className="text-sm uppercase text-gray-400">
                {props.walletData.accountId !== "" &&
                  props.walletData.accountId}
              </div>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
