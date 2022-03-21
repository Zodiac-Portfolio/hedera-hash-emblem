export const accountsSchema = {
  name: "account",
  title: "Accounts",
  type: "document",
  fields: [
    {
      name: "email",
      title: "Email",
      type: "string",
    },
    {
      name: "firebaseId",
      title: "Firebase ID",
      type: "string",
    },

    {
      name: "alias",
      title: "Alias",
      type: "string",
    },
    {
      name: "profileImage",
      title: "Profile Image",
      type: "string",
    },
    {
      name: "associatedCollection",
      title: "Has Asociated Collection",
      type: "boolean",
      initialValue: false,
    },
    {
      name: "hederaAccount",
      title: "Linked Hedera account",
      type: "reference",
      to: [{ type: "hederaAccount" }],
    },
  ],
};
