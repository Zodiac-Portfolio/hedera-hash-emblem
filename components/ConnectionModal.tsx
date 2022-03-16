import Image from 'next/image'
import React, { useEffect } from 'react'
import { SaveData } from '../context/HashConnectAPIProvider'

export const hashPackLoader = () => {
    return 'https://lh3.googleusercontent.com/11gZzwVrl8X2eoCbag1y5_hhyUqMKxG-zfDThmczUD7TwlX6HS0207EqyKGcz-FY1ZtDrWBwtNIG5VMlp-f6jkniYQ=w128-h128-e365-rj-sc0x00ffffff'
}

export const ipfsLoader = ({ src }: { src: string }) => {
    return src
}

type PropsType = {
    open: boolean
    closeModal: () => void
    walletData: SaveData
}

function ConnectionModal(props: PropsType) {
    const handleCopy = () => {
        navigator.clipboard.writeText(props.walletData.pairingString)
    }

    useEffect(() => {
        if (props.walletData.accountIds.length > 0) {
            props.closeModal()
        }

        return () => {}
    }, [props, props.walletData])

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
                        <div className="relative  inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-fit">
                            <div className="bg-gray-900 text-white flex-col items-center px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <Image
                                            className="rounded-full"
                                            alt="hashIcon"
                                            width={32}
                                            layout={'fixed'}
                                            loader={hashPackLoader}
                                            height={32}
                                            src="https://lh3.googleusercontent.com/11gZzwVrl8X2eoCbag1y5_hhyUqMKxG-zfDThmczUD7TwlX6HS0207EqyKGcz-FY1ZtDrWBwtNIG5VMlp-f6jkniYQ=w128-h128-e365-rj-sc0x00ffffff"
                                        />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3
                                            className="text-lg leading-6 font-medium "
                                            id="modal-title"
                                        >
                                            Connect to HashPack
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-300">
                                                Connect to HashPack extension
                                                and manage all your transactions
                                                inside the Hash-Emblem ecosystem
                                                <br></br>
                                                <button
                                                    className="underline text-indigo-400"
                                                    onClick={() =>
                                                        window.open(
                                                            'https://chrome.google.com/webstore/detail/hashpack/gjagmgiddbbciopjhllkdnddhcglnemk'
                                                        )
                                                    }
                                                >
                                                    Install Extension
                                                </button>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-wrap w-full sm:gap-3 justify-evenly">
                                    <div className="flex sm:flex-row md:flex-col items-center gap-4 my-5">
                                        <Image
                                            width={128}
                                            height={128}
                                            layout={'fixed'}
                                            src="https://play-lh.googleusercontent.com/X3vvVu9eWCg2JOTUm_ZcPEMo2mt4pmv5dq1fvrOUzSoeDEF3h1iYFFUwdFbn_y02-JU"
                                            alt="qr"
                                        />
                                        <div className="flec flex-col">
                                            <p> Scan Qr with App </p>
                                        </div>
                                    </div>
                                    <div className="flex sm:flex-row md:flex-col items-center gap-4 my-5">
                                        <Image
                                            width={128}
                                            height={128}
                                            layout={'fixed'}
                                            src="https://lh3.googleusercontent.com/11gZzwVrl8X2eoCbag1y5_hhyUqMKxG-zfDThmczUD7TwlX6HS0207EqyKGcz-FY1ZtDrWBwtNIG5VMlp-f6jkniYQ=w128-h128-e365-rj-sc0x00ffffff"
                                            alt="qr"
                                        />
                                        <div className="flex flex-col ">
                                            <button
                                                type="button"
                                                className="justify-center rounded-md border border-transparent shadow-sm px-2 py-1 bg-indigo-600 bg-opacity-20 text-gray-600 cursor-not-allowed text-base font-medium   sm:w-auto sm:text-sm"
                                            >
                                                Connect to Extension
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex sm:flex-row md:flex-col items-center gap-4 my-5">
                                        <div className="w-[128px] h-[128px] bg-gray-800"></div>
                                        <button
                                            type="button"
                                            onClick={handleCopy}
                                            className="justify-center rounded-md border border-transparent shadow-sm px-2 py-1 bg-indigo-400 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:w-auto sm:text-sm"
                                        >
                                            Copy Pairing String
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={props.closeModal}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ConnectionModal
