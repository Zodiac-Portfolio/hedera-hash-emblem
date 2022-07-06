import { useEffect, useState } from "react";
import ConnectionModal from "../components/ConnectionModal";
import Navbar from "../components/Navbar";
import { useHashConnect } from "../context/HashConnectAPIProvider";
import { useAuth } from "../context/AuthProvider";
import { client } from "../lib/sanity";
import MintCard from "../components/MintCard";
import MintModal from "../components/MintModal";
import ProfileModal from "../components/ProfileModal";
import { MintItem, NFTInfoObject } from "../context/utils/types";
import { getMyNFTs } from "../context/utils/nftUtils";

function App() {
  const {
    walletData,
    buildMintNftTransaction,
    setLoadingHederaAction,
    loadingHederaAction,
    completedAction,
    setCompletedAction,
    updateAccountBalance,
    associateCollection,
    connect,
  } = useHashConnect();
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
      getMyNFTs(walletData.accountId).then((res: NFTInfoObject[]) => {
        setMyItems(res);
      });
      updateAccountBalance();
    }
  }, [walletData.accountId, authUser.firebaseId]);

  useEffect(() => {
    if (authUser.firebaseId !== "" && walletData.accountId !== "") {
      getMyNFTs(walletData.accountId).then((res: NFTInfoObject[]) => {
        setMyItems(res);
        updateAccountBalance();
      });
    }
  }, [completedAction]);
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
            <div>
              {!walletData?.accountId ? (
                <button
                  className="text-white border border-gray-600 rounded-lg p-4 hover:text-gray-400 hover:border-gray-800"
                  onClick={() => connect()}
                >
                  Link your account with HashPack
                </button>
              ) : (
                <>
                  {!authUser.associatedCollection &&
                  !walletData.associatedCollection ? (
                    <button
                      className="text-white border border-gray-600 rounded-lg p-4  hover:text-gray-400 hover:border-gray-800"
                      onClick={() => associateCollection()}
                    >
                      Asociate NFT Collection to your wallet
                    </button>
                  ) : (
                    <div className="flex flex-wrap w-full gap-10 items-center justify-center">
                      {availibleForMint?.map((item) => {
                        return (
                          <MintCard
                            userOwnedNfts={myItems}
                            walletData={walletData}
                            key={Math.random() * 1000}
                            item={item}
                            handleShowModal={() => handleShowMintModal(item)}
                          />
                        );
                      })}
                    </div>
                  )}
                </>
              )}
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
        loadingAction={loadingHederaAction}
        setLoadingAction={setLoadingHederaAction}
        open={showMintModal}
        closeModal={() => setShowMintModal(false)}
        detailItem={detailMintItem}
        mintAction={() => buildMintNftTransaction()}
        completedAction={completedAction}
        setCompletedAction={setCompletedAction}
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
