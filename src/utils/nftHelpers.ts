import { NFT } from "../../_types/types";

/**
 * Convert attributes with key: value pairs
 *
 */
const handleTown1 = (attributes: any) => {
  return Object
          .entries(attributes)
          .map(([k,v]) => ({
            trait_type: k,
            value: !Array.isArray(v) ? v : v.join(',')
          }));
}

const normalizeToken = (data: any, id: string, baseContract: string) => {
  let token = {} as NFT;
  token.base = baseContract;
  token.id = id.padStart(5, '0');
  token.owner = data?.access?.owner;
  token.name = data.info.extension.name;
  // TODO normalize image url
  token.image = data.info.extension.image;

  if (data?.info?.extension?.attributes?.name) {
    token.attributes = handleTown1(data.info.extension.attributes);
  } else {
    token.attributes = data.info.extension.attributes;
  }

  return token;
}

export {
  normalizeToken,
}
