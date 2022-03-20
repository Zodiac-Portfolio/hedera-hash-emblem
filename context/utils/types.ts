import { HashConnectTypes } from "hashconnect";

export type IPFSMetadata = {
  name: string;
  description: string;
  image: string;
  class: string;
  weapons: Array<string>;
};

export type NFTInfoObject = {
  serial: number;
  nftId: string;
  owner: string;
  metadataString: string | undefined;
  metadata: IPFSMetadata;
};

//Type declarations
export interface SaveData {
  topic: string;
  pairingString: string;
  privateKey: string;
  pairedWalletData: HashConnectTypes.WalletMetadata | null;
  pairedAccounts: string[];
  netWork?: string;
  id?: string;
  accountId: string;
  hbarBalance: number;
  usdBalance: number;
}

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
