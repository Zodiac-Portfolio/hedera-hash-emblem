import { useEffect, useState } from "react";
import BasicModal from "../components/BasicModal";
import ConnectionModal from "../components/ConnectionModal";
import { useHashConnect } from "../context/HashConnectAPIProvider";
import { client } from "../lib/sanity";

export type MintItem = {
  _id: string;
  name: string;
  imageURL: string;
  metadata: string;
  supply: number;
};

function App() {
  const { walletData, buildMintNftTransaction } = useHashConnect();
  const { accountIds } = walletData;
  const [availibleForMint, setAvailibleForMint] = useState<MintItem[]>([]);
  const [showMintModal, setShowMintModal] = useState(false);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [detailMintItem, setDetailMintItem] = useState<MintItem>({
    _id: "1",
    name: "SOLDIER",
    imageURL:
      "https://ipfs.io/ipfs/QmYGjzHv3aTRX7jrEnwk2UXdrsXLeoMBLhRfMLutaRbVX6",
    metadata: "QmQUdcdfkuFbtvmd71TJLqPjruoRJ5jRErVZfYL58wamdS",
    supply: 5,
  });
  const handleShowModal = (item: MintItem) => {
    const dataToSave = JSON.stringify(item);
    localStorage.setItem("detailItemSelected", dataToSave);
    setDetailMintItem(item);
    setShowMintModal(true);
  };

  const handleCloseConnectionModal = () => {
    setShowConnectionModal(false);
  };

  const handleCloseMintModal = () => {
    setShowMintModal(false);
  };

  const conCatAccounts = (lastAccs: string, Acc: string) => {
    return lastAccs + " " + Acc;
  };

  const handleShowConnectModal = () => {
    setShowConnectionModal(true);
  };

  const getAllItems = async () => {
    const query = `
        *[_type=="availibleForMint"]{
          _id,
          name,
          imageURL,
          metadata,
          supply
        }
        `;
    const sanityResponse = await client.fetch(query);

    return sanityResponse;
  };

  useEffect(() => {
    getAllItems().then((res) => {
      setAvailibleForMint(res);
    });
  }, []);
  return (
    <div className="flex flex-col w-screen h-sreen bg-gray-900 gap-10">
      <div className="p-5 fixed w-full bg-black text-white justify-between flex items-center">
        <p className="text-2xl text-blue-400">æ</p>
        {accountIds && accountIds?.length > 0 ? (
          <div className="mr-5 text-2xl">
            <p>Account: [{accountIds.reduce(conCatAccounts)}]</p>
          </div>
        ) : (
          <p>
            <button
              onClick={handleShowConnectModal}
              className="flex items-center gap-3"
            >
              <img
                className="rounded-full"
                alt="hashIcon"
                width={32}
                height={32}
                src="https://lh3.googleusercontent.com/11gZzwVrl8X2eoCbag1y5_hhyUqMKxG-zfDThmczUD7TwlX6HS0207EqyKGcz-FY1ZtDrWBwtNIG5VMlp-f6jkniYQ=w128-h128-e365-rj-sc0x00ffffff"
              />
              Connect to HashPack
            </button>
          </p>
        )}
      </div>
      <div className="w-full flex flex-col h-screen items-center text-center justify-evenly">
        <div className="text-white">
          <button className="text-9xl font-['Monaco']">Hash-æ-Emblem</button>
          <p className="text-4xl text-blue-400 font-['Monaco']">
            Fight to end with War and bring Peace back up
          </p>
        </div>
        <div className="flex flex-wrap w-full gap-10 items-center justify-center">
          {availibleForMint?.map((item) => {
            return (
              <div
                key={`${item.name}-${item.supply}`}
                className="flex flex-col w-[300px] p-5 border items-center gap-3 border-black bg-black bg-opacity-60 text-white"
              >
                <p className="uppercase text-3xl mb-2">{item.name}</p>
                <img
                  width={500}
                  height={500}
                  src={item.imageURL}
                  alt={`gsgs`}
                />
                <div>
                  <p className="uppercase text-lg mb-2">{item.supply} left</p>
                  <button
                    className="border rounded-xl w-fit py-2 px-2 bg-indigo-600 text-white"
                    onClick={() => handleShowModal(item)}
                  >
                    Mint NFT
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <BasicModal
        mintAction={() => buildMintNftTransaction()}
        open={showMintModal}
        closeModal={() => handleCloseMintModal()}
        detailItem={detailMintItem}
      />
      <ConnectionModal
        open={showConnectionModal}
        closeModal={() => handleCloseConnectionModal()}
        walletData={walletData}
      />
    </div>
  );
}

export default App;
