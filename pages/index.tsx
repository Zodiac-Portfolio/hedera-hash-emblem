import { useEffect, useState } from "react";
import ConnectionModal from "../components/ConnectionModal";
import Navbar from "../components/Navbar";
import {
  getMyNFTs,
  NFTInfoObject,
  useHashConnect,
} from "../context/HashConnectAPIProvider";
import { useAuth } from "../context/AuthProvider";
import { client } from "../lib/sanity";
import MintCard from "../components/MintCard";
import MintModal from "../components/MintModal";
import ProfileModal from "../components/ProfileModal";

export type NFTItem = {
  serial: number;
  nftId: string;
  owner: string;
  metadataString: string;
  metadata: {
    name: string;
    description: string;
    image: string;
    keyValues: object;
    class: string;
    weapons: string[];
  };
};
export type MintItem = {
  _id: string;
  name: string;
  imageURL: string;
  metadata: string;
  supply: number;
};

function App() {
  const { walletData, buildMintNftTransaction } = useHashConnect();
  const [availibleForMint, setAvailibleForMint] = useState<MintItem[]>([]);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showMintModal, setShowMintModal] = useState(false);
  const { authUser } = useAuth();
  const [detailMintItem, setDetailMintItem] = useState<MintItem>({
    _id: "1",
    name: "SOLDIER",
    imageURL:
      "https://ipfs.io/ipfs/QmYGjzHv3aTRX7jrEnwk2UXdrsXLeoMBLhRfMLutaRbVX6",
    metadata: "QmQUdcdfkuFbtvmd71TJLqPjruoRJ5jRErVZfYL58wamdS",
    supply: 5,
  });
  const [myItems, setMyItems] = useState<NFTInfoObject[]>([]);

  const handleShowMintModal = (item: MintItem) => {
    const dataToSave = JSON.stringify(item);
    localStorage.setItem("detailItemSelected", dataToSave);
    setDetailMintItem(item);
    setShowMintModal(true);
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

  useEffect(() => {
    if (authUser.firebaseId !== "" && walletData.accountId !== "") {
      getMyNFTs(walletData.accountId).then((res) => {
        console.log(res);
        setMyItems(res);
      });
    }
  }, [authUser, walletData]);
  return (
    <div className="flex flex-col w-screen h-screen  gap-10">
      <Navbar
        walletData={walletData}
        handleShowProfileModal={() => setShowProfileModal(true)}
        handleShowConnectModal={() => setShowConnectionModal(true)}
      />

      <div className="w-full h-full overflow-hidden  ">
        <div className="w-full h-full box-content overflow-y-scroll  pr-[17px] flex flex-col  items-center text-center  gap-10 overflow-x-hidden">
          <div className="text-white flex justify-center items-center w-full">
            <p className="webtitle">
              Hashgrapgh RPG NFT Ecosystem
              <span>Hash Emblem</span>
              &mdash; Fight against War &mdash;
            </p>
          </div>
          {authUser.firebaseId === "" ? (
            <div className=" text-white flex-col justify-center items-center w-2/3 lg:w-1/3">
              <p className="start_journey_text">
                Join the decentralized RPG War ecosystem, competing with users
                along the world to find the Hash Emblem
              </p>
              <p
                onClick={() => setShowConnectionModal(true)}
                className="start_journey cursor-pointer"
              >
                Start
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap w-full gap-10 items-center justify-center">
              {availibleForMint?.map((item) => {
                return (
                  <MintCard
                    walletData={walletData}
                    key={Math.random() * 1000}
                    item={item}
                    handleShowModal={() => handleShowMintModal(item)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      <ConnectionModal
        open={showConnectionModal}
        closeModal={() => setShowConnectionModal(false)}
        walletData={walletData}
      />
      <MintModal
        open={showMintModal}
        closeModal={() => setShowMintModal(false)}
        detailItem={detailMintItem}
        mintAction={() => buildMintNftTransaction()}
      />
      <ProfileModal
        open={showProfileModal}
        closeModal={() => setShowProfileModal(false)}
        user={authUser}
        myInventoy={myItems}
        walletData={walletData}
      />
    </div>
  );
}

export default App;
