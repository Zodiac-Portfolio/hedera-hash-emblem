import { getAuth } from "firebase/auth";
import Image from "next/image";
import React from "react";
import { RiCloseCircleFill } from "react-icons/ri";
import { useHashConnect } from "../context/HashConnectAPIProvider";
import { FirebaseUser, NFTInfoObject, SaveData } from "../context/utils/types";
import MyItemCard from "./MyItemCard";

export const hashPackLoader = () => {
  return "https://lh3.googleusercontent.com/11gZzwVrl8X2eoCbag1y5_hhyUqMKxG-zfDThmczUD7TwlX6HS0207EqyKGcz-FY1ZtDrWBwtNIG5VMlp-f6jkniYQ=w128-h128-e365-rj-sc0x00ffffff";
};

export const ipfsLoader = ({ src }: { src: string }) => {
  return src;
};

type PropsType = {
  open: boolean;
  closeModal: () => void;
  walletData: SaveData;
  user: FirebaseUser;
  myInventoy: NFTInfoObject[];
};

function ProfileModal(props: PropsType) {
  const { walletData, connect } = useHashConnect();
  const handleSignOut = async () => {
    //delete from localstorage
    localStorage.removeItem(
      "firebase:authUser:AIzaSyB5yY8odWKLfi53qzc77YxL7FLmQAZAJRc:[DEFAULT]"
    );
    getAuth().signOut();
    window.localStorage.clear();
    window.location.reload();
  };

  return (
    <>
      {props.open && (
        <div
          className="fixed z-10 inset-0 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="w-full sm:w-4/5 md:w-2/3 lg:w-1/2 h-[600px] relative p-10 bg-gray-900  inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle">
              <RiCloseCircleFill
                className="text-white text-3xl absolute right-2 top-2 cursor-pointer"
                onClick={() => props.closeModal()}
              />
              <div className="flex w-full flex-col gap-5 justify-between h-full ">
                <div className="flex w-full flex-col sm:flex-row gap-5 justify-between px-5 py-7 items-center text-white  bg-gray-800 rounded-xl p-2">
                  <div className="flex gap-10">
                    <div className="flex items-center  gap-3 first:hover:flex">
                      <div className="flex">
                        <img
                          className="rounded-full"
                          alt="hashIcon"
                          width={64}
                          height={64}
                          src={
                            props.user.profileImage
                              ? props.user.profileImage
                              : "https://ipfs.io/ipfs/QmZ1nzKzG3YEq2GW3Zmuv2osgbdAN8Jori7nE5fxMCBtLM"
                          }
                        />
                      </div>
                      {props.user.firebaseId !== "" && (
                        <div>
                          <div className="text-lg uppercase text-gray-300">
                            {props.user.alias}
                          </div>
                          <div className="text-lg uppercase text-gray-400">
                            {walletData.accountId !== "" &&
                              walletData.accountId}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {walletData.accountId === "" ? (
                    <button
                      onClick={() => connect()}
                      className="flex w-fit justify-between cursor-pointer hover:bg-orange-800 px-5 py-4 items-center text-white  bg-gray-700 rounded-xl p-2"
                    >
                      <div className="flex flex-col">
                        <button className="flex gap-4 ">
                          Link your Wallet!
                        </button>
                      </div>
                    </button>
                  ) : (
                    <div className="flex w-fit justify-between px-5 py-4 items-center text-white  bg-gray-700 rounded-xl p-2">
                      <div className="flex flex-col items-start gap-2">
                        <div className="flex items-center gap-3">
                          <div className="px-[8px] border rounded-full">$</div>
                          <div>{walletData.usdBalance}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Image
                            className="rounded-full"
                            alt="hashIcon"
                            width={30}
                            height={32}
                            src="https://ipfs.io/ipfs/QmQncmX3zai19fFLz2w3AEaomH7HczkqrR7SipXYxt6VHb"
                          />
                          {walletData.hbarBalance}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="h-2/3 bg-gray-800 rounded-xl p-2 w-full">
                  {props.myInventoy.length <= 0 ? (
                    <div className="text-white flex flex-col items-start gap-3">
                      <div className="flex flex-grid items-center">
                        <div>You have no items in your inventory</div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full text-white flex flex-wrap justify-center gap-3">
                      {props.myInventoy.map((item) => {
                        return (
                          <MyItemCard item={item} key={Math.random() * 1000} />
                        );
                      })}
                    </div>
                  )}
                </div>
                <button
                  className="text-white hover:text-gray-400"
                  onClick={() => handleSignOut()}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProfileModal;
