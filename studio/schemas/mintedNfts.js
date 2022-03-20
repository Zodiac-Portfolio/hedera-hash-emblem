export const mintedNfts = {
  name: "mintedNfts",
  title: "Minted NFTs",
  type: "document",
  fields: [
    {
      name: "nftId",
      title: "NFT ID",
      type: "string",
    },
    {
      name: "mintedBy",
      title: "Minted By",
      type: "string",
    },
    {
      name: "serial",
      title: "Serial Number",
      type: "number",
    },
    {
      name: "metadata",
      title: "Metadata",
      type: "document",
      fields: [
        {
          name: "name",
          title: "Name",
          type: "string",
        },
        {
          name: "class",
          title: "Class",
          type: "string",
        },
        {
          name: "desrtiption",
          title: "Description",
          type: "string",
        },
        {
          name: "weapons",
          title: "Weapons",
          type: "array",
          of: [{ type: "string" }],
        },
        {
          name: "keyvalues",
          title: "KeyValues",
          type: "array",
          of: [{ type: "number" }],
        },
      ],
    },
  ],
};
