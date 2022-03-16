import createSchema from "part:@sanity/base/schema-creator";

import schemaTypes from "all:part:@sanity/base/schema-type";
import { availableForMintShcema } from "./availibleForMint";
import { hashWarriors } from "./hashWarriors";

export default createSchema({
  name: "default",

  types: schemaTypes.concat([availableForMintShcema, hashWarriors]),
});
