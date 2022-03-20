import { NftId, TokenId } from "@hashgraph/sdk";

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
