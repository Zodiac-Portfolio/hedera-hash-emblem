export const hederaAccount = {
  name: "hederaAccount",
  title: "Hedera Account",
  type: "document",
  fields: [
    {
      name: "accountId",
      title: "Account ID",
      type: "string",
    },
    {
      name: "topic",
      title: "Topic",
      type: "string",
    },
    {
      name: "connectionId",
      title: "Connection ID",
      type: "string",
    },
    {
      name: "network",
      title: "Network",
      type: "string",
    },
    {
      name: "privateKey",
      title: "Private Key",
      type: "string",
    },
    {
      name: "appMetadata",
      title: "App Metadata",
      type: "document",
      fields: [
        {
          name: "name",
          title: "App Name",
          type: "string",
        },
        {
          name: "icon",
          title: "App Icon",
          type: "string",
        },
        {
          name: "description",
          title: "Description",
          type: "string",
        },
        {
          name: "publicKey",
          title: "App Public Key",
          type: "string",
        },
        {
          name: "url",
          title: "Url",
          type: "string",
        },
      ],
    },
  ],
};
