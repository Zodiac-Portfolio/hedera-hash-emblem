import {
  AccountId,
  Client,
  NftId,
  PrivateKey,
  TokenId,
  TokenNftInfoQuery,
} from "@hashgraph/sdk";
import axios from "axios";
import { NFTInfoObject } from "./types";

export function Utf8ArrayToStr(array: Uint8Array | undefined | null) {
  let out, i, len, c;
  let char2, char3;
  if (array) {
    out = "";
    len = array.length;
    i = 0;
    while (i < len) {
      c = array[i++];
      switch (c >> 4) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
          // 0xxxxxxx
          out += String.fromCharCode(c);
          break;
        case 12:
        case 13:
          // 110x xxxx   10xx xxxx
          char2 = array[i++];
          out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f));
          break;
        case 14:
          // 1110 xxxx  10xx xxxx  10xx xxxx
          char2 = array[i++];
          char3 = array[i++];
          out += String.fromCharCode(
            ((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0)
          );
          break;
      }
    }

    return out;
  }
}

export const getNFTCollection = (): TokenId => {
  return TokenId.fromString(
    process.env.NEXT_PUBLIC_NFT_COLLECTION
      ? process.env.NEXT_PUBLIC_NFT_COLLECTION
      : ""
  );
};

export const getNFTId = (serialNumber: number): NftId => {
  return new NftId(
    TokenId.fromString(
      process.env.NEXT_PUBLIC_NFT_COLLECTION
        ? process.env.NEXT_PUBLIC_NFT_COLLECTION
        : ""
    ),
    serialNumber
  );
};

export const getMyNFTs = async (
  accountId: string
): Promise<NFTInfoObject[]> => {
  const operatorId = AccountId.fromString("0.0.30909227");
  const operatorKey = PrivateKey.fromString(
    "302e020100300506032b657004220420e3826f57fd5714ecd546722badd9704c9d245834952ffdfe0edaced31fe6df61"
  );

  const hashClient = Client.forTestnet().setOperator(operatorId, operatorKey);

  //IPFS content identifiers for which we will create a NFT

  let all = true;
  const myNFTS = new Array<NFTInfoObject>();
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

      if (owner === accountId) {
        myNFTS.push({
          serial: i,
          nftId: queryTx[0].nftId.toString(),
          owner: owner,
          metadataString: queryTx[0].metadata?.toLocaleString(),
          metadata: metadataFormatted.data,
        });
      }

      i++;
    } catch (e) {
      all = false;
    }
  }

  return myNFTS;
};
