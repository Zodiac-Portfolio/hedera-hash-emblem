import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import BasicModal from "../components/BasicModal";
import ConnectionModal from "../components/ConnectionModal";
import MintCard from "../components/MintCard";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthProvider";
import { useHashConnect } from "../context/HashConnectAPIProvider";
import { client } from "../lib/sanity";

export type MintItem = {
  _id: string;
  name: string;
  imageURL: string;
  metadata: string;
  supply: number;
};

function Mint() {
  const { walletData, buildMintNftTransaction } = useHashConnect();
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

  const { authUser, loading } = useAuth();
  const router = useRouter();

  // Listen for changes on loading and authUser, redirect if needed
  useEffect(() => {
    if (router.pathname !== "/") {
      if (!authUser) router.push("/auth");
      if (!loading && authUser.firebaseId === "") router.push("/auth");
    }
  }, [authUser, loading]);

  return (
    <div className="flex flex-col w-screen h-screen  gap-10">
      <Navbar handleShowConnectModal={() => handleShowConnectModal()} />
      <div className="w-full flex flex-col h-full items-center text-center justify-evenly">
        <div className="text-white flex justify-center items-center w-full">
          <p className="webtitle">
            Hashgrapgh RPG NFT Ecosystem
            <span>Hash Emblem</span>
            &mdash; Fight against War &mdash;
          </p>
        </div>

        <div className="flex flex-wrap w-full gap-10 items-center justify-center">
          {availibleForMint?.map((item) => {
            return (
              <MintCard
                key={Math.random() * 1000}
                item={item}
                handleShowModal={() => handleShowModal(item)}
              />
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

export default Mint;
