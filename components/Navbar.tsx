import React from "react";
import { useHashConnect } from "../context/HashConnectAPIProvider";
import {
  //RiLuggageCartLine,
  RiOutletFill,
  //RiMoneyDollarCircleFill,
  RiAccountCircleFill,
} from "react-icons/ri";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthProvider";
//import Link from "next/link";

export default function Navbar(props: {
  handleShowConnectModal:
    | React.MouseEventHandler<HTMLButtonElement>
    | undefined;
  handleShowProfileModal:
    | React.MouseEventHandler<HTMLButtonElement>
    | undefined;
}) {
  const router = useRouter();
  const { walletData } = useHashConnect();
  const { authUser } = useAuth();

  return (
    <div className="p-5 sticky h-[100px] w-full bg-[#111827] text-white justify-evenly flex items-center">
      <div
        onClick={() => router.push("/")}
        className="cursor-pointer flex items-center gap-5"
      >
        <RiOutletFill className="text-3xl" />
        <div className="upercase">Hash Emblem</div>
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

      {walletData.accountId ? (
        <div className="text-2xl">
          <p>Account: {walletData.accountId} </p>
        </div>
      ) : (
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
              <RiAccountCircleFill className="text-3xl" />
            </div>
            {authUser.firebaseId !== "" && <div>{authUser.alias}</div>}
          </button>
        </div>
      )}
    </div>
  );
}
