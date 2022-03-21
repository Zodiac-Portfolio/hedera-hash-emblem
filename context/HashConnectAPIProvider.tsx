import { HashConnect, HashConnectTypes, MessageTypes } from "hashconnect";
import {
  AccountBalanceQuery,
  AccountId,
  Client,
  Hbar,
  PrivateKey,
  TokenAssociateTransaction,
  TokenMintTransaction,
  TokenNftInfoQuery,
  Transaction,
  TransactionId,
  TransferTransaction,
} from "@hashgraph/sdk";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { client } from "../lib/sanity";
import { getNFTCollection, getNFTId, Utf8ArrayToStr } from "./utils/nftUtils";
import { IPFSMetadata, MintItem, NFTInfoObject, SaveData } from "./utils/types";

const HASPACK_METADATA = {
  name: "HashPack",
  description: "An example wallet",
  icon: "https://www.hashpack.app/img/logo.svg",
  publicKey: "6aea08ac-346f-4a4b-940e-1994ff6a4e1a",
  url: "chrome&#38;&#35;38&#59;&#38;&#35;35&#59;38&#38;&#35;59&#59;&#38;&#35;38&#59;&#38;&#35;35&#59;35&#38;&#35;59&#59;45&#38;&#35;38&#59;&#38;&#35;35&#59;59&#38;&#35;59&#59;extension&#38;&#35;38&#59;&#38;&#35;35&#59;38&#38;&#35;59&#59;&#38;&#35;38&#59;&#38;&#35;35&#59;35&#38;&#35;59&#59;58&#38;&#35;38&#59;&#38;&#35;35&#59;59&#38;&#35;59&#59;&#38;&#35;38&#59;&#38;&#35;35&#59;38&#38;&#35;59&#59;&#38;&#35;38&#59;&#38;&#35;35&#59;35&#38;&#35;59&#59;47&#38;&#35;38&#59;&#38;&#35;35&#59;59&#38;&#35;59&#59;&#38;&#35;38&#59;&#38;&#35;35&#59;38&#38;&#35;59&#59;&#38;&#35;38&#59;&#38;&#35;35&#59;35&#38;&#35;59&#59;47&#38;&#35;38&#59;&#38;&#35;35&#59;59&#38;&#35;59&#59;gjagmgiddbbciopjhllkdnddhcglnemk",
};
//const NFT_COLLECTION = "0.0.33980313";
//const SUPPLY_KEY =
//  "e533d35c16ffa16e97c57f03c3bd97b43b4beeed4d71d3277e2ce3a426ad980a";

//const OPERATOR_ID = "0.0.30909227";
//const OPERATOR_KEY =
//("302e020100300506032b657004220420e3826f57fd5714ecd546722badd9704c9d245834952ffdfe0edaced31fe6df61");

const hashClient = Client.forTestnet().setOperator(
  process.env.NEXT_PUBLIC_OPERATOR_ID
    ? process.env.NEXT_PUBLIC_OPERATOR_ID
    : "",
  process.env.NEXT_PUBLIC_OPERATOR_KEY
    ? process.env.NEXT_PUBLIC_OPERATOR_KEY
    : ""
);

// Configure accounts and hashClient, and generate needed keys

export const getNFTInfo = async (): Promise<NFTInfoObject[]> => {
  const operatorId = AccountId.fromString("0.0.30909227");
  const operatorKey = PrivateKey.fromString(
    "302e020100300506032b657004220420e3826f57fd5714ecd546722badd9704c9d245834952ffdfe0edaced31fe6df61"
  );

  const hashClient = Client.forTestnet().setOperator(operatorId, operatorKey);

  //IPFS content identifiers for which we will create a NFT

  let all = true;
  const allNFTS = new Array<NFTInfoObject>();
  let i = 1;
  while (all) {
    try {
      const queryTx = await new TokenNftInfoQuery()
        .setNftId(getNFTId(i))
        .execute(hashClient);

      const owner = queryTx[0].accountId.toString();

      const metadata = Utf8ArrayToStr(queryTx[0].metadata);

      const metadataFormatted = await axios.get(
        `https://ipfs.io/ipfs/${metadata}`
      );

      allNFTS.push({
        serial: i,
        nftId: queryTx[0].nftId.toString(),
        owner: owner,
        metadataString: queryTx[0].metadata?.toLocaleString(),
        metadata: metadataFormatted.data,
      });

      i++;
    } catch (e) {
      all = false;
    }
  }

  return allNFTS;
};

type Networks = "testnet" | "mainnet" | "previewnet";

interface PropsType {
  children: React.ReactNode;
  hashConnect: HashConnect;
  netWork: Networks;
  metaData?: HashConnectTypes.AppMetadata;
  debug?: boolean;
}

export interface HashConnectProviderAPI {
  connect: () => void;
  walletData: SaveData;
  hashConnect: HashConnect;
  netWork: Networks;
  metaData?: HashConnectTypes.AppMetadata;
  installedExtensions: HashConnectTypes.WalletMetadata | null;
  buildMintNftTransaction: () => Promise<void>;
  associateCollection: () => Promise<void>;
  nftInfo: Array<NFTInfoObject> | null;
  loadingHederaAction: boolean;
  setLoadingHederaAction: (newValue: boolean) => void;
  completedAction: boolean;
  setCompletedAction: (newState: boolean) => void;
  updateAccountBalance: () => Promise<void>;
}

const INITIAL_SAVE_DATA: SaveData = {
  topic: "",
  pairingString: "",
  privateKey: "",
  pairedAccounts: [],
  pairedWalletData: null,
  accountId: "",
  hbarBalance: 10,
  usdBalance: 10 * 0.2,
};

const APP_CONFIG: HashConnectTypes.AppMetadata = {
  name: "Hash Emblem",
  description: "Minting site for Hash Emblem NFT Ecosystem",
  icon: "https://ipfs/io/QmejTXvhAcRbEsXcS6jXG8ckFLFvoXzz18iGLyVE8ZvZ27",
};

const loadLocalData = async (): Promise<null | SaveData> => {
  const firebaseId = window.localStorage.getItem("firebaseId");

  let sanityAccountData: any = null;

  if (firebaseId) {
    let query = `
    *[_type=="account" && firebaseId=="${firebaseId}"]{
      hederaAccount
    }
    `;

    const sanityAccountDataReq = await client.fetch(query);

    query = `
    *[_type=="hederaAccount" && accountId=="${sanityAccountDataReq[0].hederaAccount._ref}"]{
      accountId,
      topic,
      connectionId,
      network,
      privateKey,
      appMetadata
    }
    `;

    const sanityHederaDataReq = await client.fetch(query);

    sanityAccountData = {
      accountId: sanityHederaDataReq[0].accountId,
      accountIds: [sanityHederaDataReq[0].accountId],
      id: sanityHederaDataReq[0].connectionId,
      network: sanityHederaDataReq[0].network,
      privateKey: sanityHederaDataReq[0].privateKey,
      topic: sanityHederaDataReq[0].topic,
      pairedWalletData: null,
      hbarBalance: 0,
      usdBalance: 0,
    };
  }
  return sanityAccountData;
};

const loadDetailItem = (): null | MintItem => {
  const foundData = localStorage.getItem("detailItemSelected");

  if (foundData) {
    const detailTokenData: MintItem = JSON.parse(foundData);

    // setSaveData(saveData);
    return detailTokenData;
  } else return null;
};

export const HashConnectAPIContext =
  React.createContext<HashConnectProviderAPI>({
    connect: () => null,
    hashConnect: new HashConnect(true),
    walletData: INITIAL_SAVE_DATA,
    netWork: "testnet",
    installedExtensions: HASPACK_METADATA,
    buildMintNftTransaction: () => new Promise<void>(() => {}),
    associateCollection: () => new Promise<void>(() => {}),
    nftInfo: null,
    loadingHederaAction: false,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setLoadingHederaAction: (newState: boolean) => "Done",
    completedAction: false,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setCompletedAction: (newState: boolean) => "Done",
    updateAccountBalance: () => new Promise<void>(() => {}),
  });

export const getHbarBalance = async (account: AccountId): Promise<string> => {
  const getNewBalance = await new AccountBalanceQuery()
    .setAccountId(account)
    .execute(hashClient);

  return getNewBalance.hbars.toString();
};

export default function HashConnectProvider({
  children,
  hashConnect,
  metaData,
  netWork,
  debug,
}: PropsType) {
  //Saving Wallet Details in Ustate
  const [loadingHederaAction, setLoadingHederaAction] = useState(false);
  const [completedAction, setCompletedAction] = useState(false);
  const [saveData, SetSaveData] = useState<SaveData>(INITIAL_SAVE_DATA);
  const [nftInfo] = useState<Array<NFTInfoObject> | null>(null);
  const [installedExtensions, setInstalledExtensions] =
    useState<HashConnectTypes.WalletMetadata | null>(null);

  const sendTransaction = async (
    trans: Uint8Array,
    acctToSign: string,
    return_trans = false
  ) => {
    const transaction: MessageTypes.Transaction = {
      topic: saveData.topic,
      byteArray: trans,
      metadata: {
        accountToSign: acctToSign,
        returnTransaction: return_trans,
      },
    };

    return await hashConnect.sendTransaction(saveData.topic, transaction);
  };

  const sendNft = async (_saveData: SaveData | null) => {
    const nftInfoQuery = await getNFTInfo();
    const account = _saveData?.accountId;
    console.log(_saveData);
    if (!account) {
      // eslint-disable-next-line no-throw-literal
      throw "ERROR";
    }
    const serial: number | undefined = nftInfoQuery?.length;

    if (!serial) {
      // eslint-disable-next-line no-throw-literal
      throw "ERROR";
    }

    const nftTransfer = await new TransferTransaction()
      .addNftTransfer(
        getNFTId(serial),
        AccountId.fromString("0.0.30909227"),
        AccountId.fromString(account.toString())
      )
      .execute(hashClient);

    const transactionReceipt = await nftTransfer.getReceipt(hashClient);
    if (debug)
      console.log(
        "The transfer transaction from my account to the new account was: " +
          transactionReceipt.status.toString()
      );

    setLoadingHederaAction(false);
    setCompletedAction(true);
  };

  const mintNft = async (
    _saveData: SaveData | null,
    _detailItem: MintItem | null
  ) => {
    const account = _saveData?.accountId;

    if (!account) {
      // eslint-disable-next-line no-throw-literal
      throw "ERROR";
    }

    const itemCID = _detailItem?.metadata;

    if (!itemCID) {
      throw "ERROR";
    }

    const mintTx = await new TokenMintTransaction()
      .setTokenId(getNFTCollection())
      .setMetadata([Buffer.from(itemCID)])
      .freezeWith(hashClient);

    const mintTxSign = await mintTx.sign(
      PrivateKey.fromString(
        process.env.NEXT_PUBLIC_SUPPLY_KEY
          ? process.env.NEXT_PUBLIC_SUPPLY_KEY
          : ""
      )
    );

    const mintTxSubmit = await mintTxSign.execute(hashClient);

    //Get the transaction receipt
    const mintRx = await mintTxSubmit.getReceipt(hashClient);

    //Log the serial number
    if (debug)
      console.log(`- Created NFT with serial: ${mintRx.serials[0].low} \n`);

    //Save it to sanity
    const metadataValueReq = await axios.get(`https://ipfs.io/ipfs/${itemCID}`);

    const metadataValue: IPFSMetadata = metadataValueReq.data;

    const doc = {
      _type: "mintedNfts",
      nftId: `${mintRx.serials[0].low}@${getNFTCollection().toString()}`,
      mintedBy: account,

      serial: mintRx.serials[0].low,
      metadata: {
        name: _detailItem.name,
        image: metadataValue.image,
        class: metadataValue.class,
        description: metadataValue.description,
        weapons: metadataValue.weapons,
        keyvalues: [],
      },
    };

    await client.create(doc);
  };

  const signAndMakeBytes = async (
    trans: Transaction,
    signingAcctId: string,
    privateKey?: string
  ) => {
    const privKey = PrivateKey.fromString(
      privateKey
        ? privateKey
        : "943fae2dba39a799f853ddd54f8dea80899efe6858cc4a7c67b676f58f8694fa"
    );
    const pubKey = privKey.publicKey;

    const nodeId = [new AccountId(3)];
    const transId = TransactionId.generate(signingAcctId);

    trans.setNodeAccountIds(nodeId);
    trans.setTransactionId(transId);

    trans = await trans.freeze();

    const transBytes = trans.toBytes();

    const sig = await privKey.signTransaction(
      Transaction.fromBytes(transBytes) as any
    );

    const out = trans.addSignature(pubKey, sig);

    const outBytes = out.toBytes();

    return outBytes;
  };

  /* const getRandomMetadata = (): string => {
        const cids = [
            'QmYPizx4qL1QV1Q6FhroDzmXa7oaixmDq5haJVTaS8YLpn',
            'QmSk4QUtjfBjj9whG5ahLoPvSr21AeeTjCYF534NYXrKzL',
        ]

        const selected = Math.round(Math.random() * 100000000) % cids.length

        return cids[selected]
    } */

  const associateCollection = async () => {
    const signingAcct = saveData?.accountId;
    const assTrans = new TokenAssociateTransaction()
      .setAccountId(AccountId.fromString(signingAcct))
      .setTokenIds([getNFTCollection()]);
    const privateKey = saveData?.privateKey;
    const transactionBytes: Uint8Array = await signAndMakeBytes(
      assTrans,
      signingAcct,
      privateKey
    );

    await sendTransaction(transactionBytes, signingAcct, false);
  };

  const buildMintNftTransaction = async () => {
    const signingAcct = saveData.accountId;
    const trans = new TransferTransaction()
      .addHbarTransfer(signingAcct, new Hbar(-1))
      .addHbarTransfer("0.0.30909227", new Hbar(1));

    const transactionBytes: Uint8Array = await signAndMakeBytes(
      trans,
      signingAcct
    );
    await sendTransaction(transactionBytes, signingAcct, false);
  };

  //? Initialize the package in mount
  const initializeHashConnect = async () => {
    const _saveData = INITIAL_SAVE_DATA;

    const firebaseId = window.localStorage.getItem("firebaseId");

    let sanityAccountData: any = null;

    if (firebaseId) {
      let query = `
      *[_type=="account" && firebaseId=="${firebaseId}"]{
        hederaAccount
      }
      `;

      const sanityAccountDataReq = await client.fetch(query);

      query = `
      *[_type=="hederaAccount" && accountId=="${sanityAccountDataReq[0].hederaAccount._ref}"]{
        accountId,
        topic,
        connectionId,
        network,
        privateKey,
        appMetadata
      }
      `;

      const sanityHederaDataReq = await client.fetch(query);
      if (sanityAccountDataReq[0] && sanityHederaDataReq[0])
        sanityAccountData = {
          accountId: sanityHederaDataReq[0].accountId,
          accountIds: [sanityHederaDataReq[0].accountId],
          id: sanityHederaDataReq[0].connectionId,
          network: sanityHederaDataReq[0].network,
          privateKey: sanityHederaDataReq[0].privateKey,
          topic: sanityHederaDataReq[0].topic,
          pairedWalletData: null,
          hbarBalance: 0,
          usdBalance: 0,
        };
    }

    //Fetch account from sanity, if no account simple
    try {
      if (!sanityAccountData) {
        if (debug) console.log("===Local data not found.=====");

        //first init and store the private for later
        const initData = await hashConnect.init(metaData ?? APP_CONFIG);
        _saveData.privateKey = initData.privKey;

        //then connect, storing the new topic for later
        const state = await hashConnect.connect();
        _saveData.topic = state.topic;

        //generate a pairing string, which you can display and generate a QR code from
        _saveData.pairingString = hashConnect.generatePairingString(
          state,
          netWork,
          false
        );

        console.log(_saveData.pairingString);

        hashConnect.findLocalWallets();
      } else {
        if (debug) console.log("====Local data found====", sanityAccountData);
        //use loaded data for initialization + connection

        await hashConnect.init(
          metaData ?? APP_CONFIG,
          sanityAccountData?.privateKey
        );
        hashConnect.connect(
          sanityAccountData?.topic,
          sanityAccountData?.pairedWalletData ?? metaData
        );

        const hbarBalance = await getHbarBalance(
          AccountId.fromString(sanityAccountData.accountId)
        );

        sanityAccountData.hbarBalance = parseFloat(hbarBalance);
        sanityAccountData.usdBalance = parseFloat(hbarBalance) * 0.2;
      }
    } catch (error) {
      console.log(error);
    } finally {
      if (sanityAccountData) {
        SetSaveData((prevData) => ({ ...prevData, ...sanityAccountData }));
      } else {
        SetSaveData((prevData) => ({ ...prevData, ...saveData }));
      }
      if (debug) console.log("====Wallet details updated to state====");
    }
  };

  const saveDataInSanity = async (localData: {
    data: MessageTypes.ApprovePairing;
    privateKey: string;
  }) => {
    const { metadata, ...restData } = localData.data;
    SetSaveData((prevSaveData) => {
      prevSaveData.pairedWalletData = metadata;
      prevSaveData.privateKey = localData.privateKey;
      return {
        ...prevSaveData,
        ...restData,
        accountId: restData.accountIds[0],
      };
    });
    const hederaAccountDoc = {
      _id: restData.accountIds[0],
      _type: "hederaAccount",
      accountId: restData.accountIds[0],
      topic: restData.topic,
      network: restData.network,
      connectionId: restData.id,
      privateKey: saveData.privateKey,
      appMetadata: {
        name: metadata.name,
        icon: metadata.icon,
        description: metadata.description,
        publicKey: metadata.publicKey,
        url: metadata.url,
      },
    };

    const createdDoc = await client.createIfNotExists(hederaAccountDoc);

    const firebaseId = window.localStorage.getItem("firebaseId");

    client
      .patch(firebaseId ? firebaseId : "")
      .set({
        hederaAccount: {
          _type: "reference",
          _ref: createdDoc._id,
        },
      })
      .commit();
  };

  const additionalAccountResponseEventHandler = (
    data: MessageTypes.AdditionalAccountResponse
  ) => {
    if (debug) console.debug("=====additionalAccountResponseEvent======", data);
    // Do a thing
  };

  const foundExtensionEventHandler = (
    data: HashConnectTypes.WalletMetadata
  ) => {
    if (debug) console.debug("====foundExtensionEvent====", data);
    // Do a thing
    setInstalledExtensions(data);
  };

  const transactionResponseHandler = async (
    data: MessageTypes.TransactionResponse
  ) => {
    if (debug) console.debug("====Transaction data====", data);

    if (data.success) {
      const _saveData = await loadLocalData();
      const _detailItem = loadDetailItem();

      const tokenId = _detailItem?._id;

      if (!tokenId) {
        throw "ERROE";
      }
      await client
        .patch(_detailItem?._id.toString())
        .dec({ supply: 1 })
        .commit();

      await mintNft(_saveData, _detailItem);
      await sendNft(_saveData);

      console.log();

      //UPDATE BALANCE
    }
  };
  const pairingEventHandler = (data: MessageTypes.ApprovePairing) => {
    if (debug) console.log("====pairingEvent:::Wallet connected=====", data);

    saveDataInSanity({ data: data, privateKey: saveData.privateKey });
  };

  const updateAccountBalance = async () => {
    const hbarBalance = await getHbarBalance(
      AccountId.fromString(saveData.accountId)
    );

    SetSaveData((prevData) => ({
      ...prevData,
      hbarBalance: parseFloat(hbarBalance),
      usdBalance: parseFloat(hbarBalance) * 0.2,
    }));
  };

  useEffect(() => {
    //Intialize the setup

    initializeHashConnect();

    hashConnect.additionalAccountResponseEvent.on(
      additionalAccountResponseEventHandler
    );
    hashConnect.foundExtensionEvent.on(foundExtensionEventHandler);

    hashConnect.pairingEvent.on(pairingEventHandler);
    hashConnect.transactionResponseEvent.on(transactionResponseHandler);
    // Attach event handlers
  }, []);

  const connect = () => {
    if (debug) console.log("Pairing String::", saveData.pairingString);

    hashConnect.connectToLocalWallet(saveData.pairingString);
  };

  return (
    <HashConnectAPIContext.Provider
      value={{
        connect,
        hashConnect: hashConnect,
        walletData: saveData,
        netWork,
        installedExtensions,
        buildMintNftTransaction,
        associateCollection,
        nftInfo: nftInfo,
        loadingHederaAction,
        setLoadingHederaAction,
        completedAction,
        setCompletedAction,
        updateAccountBalance,
      }}
    >
      {children}
    </HashConnectAPIContext.Provider>
  );
}

const defaultProps: Partial<PropsType> = {
  metaData: {
    name: "Hash Emblem",
    description: "Minting site for Hash Emblem NFT Ecosystem",
    icon: "https://ipfs/io/QmejTXvhAcRbEsXcS6jXG8ckFLFvoXzz18iGLyVE8ZvZ27",
  },
  netWork: "testnet",
  debug: false,
};

HashConnectProvider.defaultProps = defaultProps;

export function useHashConnect() {
  const value = React.useContext(HashConnectAPIContext);
  return value;
}
