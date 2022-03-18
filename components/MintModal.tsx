import Image from "next/image";

import React from "react";
import { MintItem } from "../pages";

type PropsType = {
  open: boolean;
  closeModal: () => void;
  detailItem: MintItem;
  mintAction: () => Promise<void>;
};

export const ipfsLoader = ({ src }: { src: string }) => {
  return src;
};

function MintModal(props: PropsType) {
  const handleClick = () => {
    props.mintAction();
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
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="relative text-white inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-fit">
              <div className="bg-gray-900 text-white flex-col items-center px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start p-2">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"></div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left ">
                    <h3
                      className="text-lg leading-6 font-medium"
                      id="modal-title"
                    >
                      Mint a {props.detailItem.name}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        The minting price for each Warrior is <b>1 HBAR</b>.
                        <br></br> <b>50%</b> of the recollected with these fee
                        will be destinated to support the Ukranian Victims of
                        the War.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-5 sm:px-6 sm:flex sm:flex-row w-full justify-evenly">
                  <Image
                    width={300}
                    height={300}
                    layout={"fixed"}
                    loader={() =>
                      ipfsLoader({
                        src: props.detailItem.imageURL,
                      })
                    }
                    src={props.detailItem.imageURL}
                    alt=""
                  />
                  <div className="flex flex-col gap-4 ml-20">
                    <p>Action: Mint a new {props.detailItem.name}</p>
                    <p>
                      Minting Price: <b>1 Hbar</b>{" "}
                    </p>
                    <ul>
                      <li>
                        {" "}
                        - <b>50%</b> goes to Ukranian victims
                      </li>
                      <li>
                        {" "}
                        - <b>25%</b> goes to Devs
                      </li>
                      <li>
                        {" "}
                        - <b>25%</b> goes to Holders
                      </li>
                    </ul>
                    <p className="mt-10 text-2xl text-orange-400">
                      Hurry UP! Just {props.detailItem.supply} items left!
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleClick}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Mint {props.detailItem.name}
                </button>
                <button
                  type="button"
                  onClick={props.closeModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MintModal;
