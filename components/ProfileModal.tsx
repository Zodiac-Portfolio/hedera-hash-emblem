import { getAuth } from "firebase/auth";
import React from "react";
import { RiCloseCircleFill } from "react-icons/ri";
import { SaveData } from "../context/HashConnectAPIProvider";

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
};

function ProfileModal(props: PropsType) {
  const handleSignOut = async () => {
    //delete from localstorage
    localStorage.removeItem(
      "firebase:authUser:AIzaSyB5yY8odWKLfi53qzc77YxL7FLmQAZAJRc:[DEFAULT]"
    );
    getAuth().signOut();
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
            <div className="relative p-10 bg-gray-900  inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-fit">
              <RiCloseCircleFill
                className="text-white text-3xl absolute right-2 top-2 cursor-pointer"
                onClick={() => props.closeModal()}
              />

              <div className="flex flex-col w-full items-center">
                <button onClick={() => handleSignOut()}>Logout</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProfileModal;
