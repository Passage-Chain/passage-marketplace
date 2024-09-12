import MHPreview from "../assets/images/metahuahua-promo.webm";
import SCT2Preview from "../assets/images/sc-t2-promo.webm";
import AlchemistPromo from "../assets/collections/alchemist/promo.mp4";
import SamuraiPromo from "../assets/collections/samurai/promo.mp4";
import HackerPromo from "../assets/collections/hacker/promo.mp4";
import PrincessPromo from "../assets/collections/princess/promo.mp4";
import FantasyPromo from "../assets/collections/fantasy/promo.mp4";
import SciFiPromo from "../assets/collections/scifi/promo.mp4";

const collections = [
  {
    id: "astronaut",
    label: "Astronaut",
    contracts: {
      base: "pasg107rr2axw6afww63pjjfr7pzsalllss76xacu6kep695dyfcx6j7shpf0u5",
      mint: "pasg1j8hg4t8j0kj5w8ux0czj902l5g5tnzsjufqqx00cage2a72cqc9ss8zqua",
      market: "pasg1l6h3ax43a5jdmwwza983fvg6lf9yw8jltm4a3wz6294j3pwkzfhqnq9zna",
    },
    mintable: false,
    avatar: true,
    mint: {},
  },
  {
    id: "Alchemist",
    label: "Gateway Alchemist",
    contracts: {
      base: "pasg1l6ut7ymdzhf38wldp0eu6ccjawgvzku69kmjl6ddjqpcm9f62gkq5ffdkp",
      mint: "pasg1jy9dagaycutdcjf99tp9uhl5ev9lykegp2tph6r9vu6xg3td6krsmr5v7y",
      market: "pasg1m7hwpq9xg28w7xn4h022u27qa2zwtklldfhheshxayyy2u6l7shs9fxa87",
    },
    mintable: true,
    avatar: true,
    mint: {
      creator: "Passage",
      description: "Alchemist Avatar Assets",
      sale: Date.now(),
      price: "625000000",
      totalCount: 750,
      mintcount: 750,
      percentMinted: 0,
      royalties: 0.06,
      previewUrl: AlchemistPromo,
    },
  },
  {
    id: "samuari",
    label: "Frontier Samurai",
    contracts: {
      base: "pasg1387uc3z2zs3663d06f59vsn5ams2x6e33gqpghjkmhafjqsc9a3q9w4e2q",
      mint: "pasg1eny8yuw9sxvfvmgydlrgs94gzuuuctfta9r7eshymw44aey4sl7qhzpkjn",
      market: "pasg1af28jewxt5mguph929krmtd4mvze7j568j3rq3vtuesx6wql2k6qvj94y6",
    },
    mintable: true,
    avatar: true,
    mint: {
      creator: "Passage",
      description: "Samurai Avatar Assets",
      sale: Date.now(),
      price: "1000000000",
      totalCount: 500,
      mintcount: 500,
      percentMinted: 0,
      royalties: 0.03,
      previewUrl: SamuraiPromo,
    },
  },
  {
    id: "princess",
    label: "Passageway Pixie",
    contracts: {
      base: "pasg1pnzsahkfp9h3gtwkuhsps6xjm5wz5885hpl27atvaqdn7e23vrdqlctc7y",
      mint: "pasg1lndsj2gufd292c35crv97ug2ncdcn9ys4s8e94wlxyeft6mt3k2sfgj3u9",
      market: "pasg16f4w972g2w5p7sng86ysqfq5txxxq7zhl7z5plq8mux85yfcdlsss7ns0n",
    },
    mintable: true,
    avatar: true,
    mint: {
      creator: "Passage",
      description: "Fairy Princess Avatar Assets",
      sale: Date.now(),
      price: "625000000",
      totalCount: 750,
      mintcount: 750,
      percentMinted: 0,
      royalties: 0.03,
      previewUrl: PrincessPromo,
    },
  },
  {
    id: "hacker",
    label: "CyberPuck Hacker",
    contracts: {
      base: "pasg1pv56ghmgnt9sv0ry6fg3rqf6wgfnckksppltamwsdnd0e0e0kfmsd296ms",
      mint: "pasg1ywpctek72gsccmr8gjgaamzs8vhh7ju3sjtvwk82daafavw5u0es0mdmrm",
      market: "pasg1wm7wpzslutgzum36tn2lzdsgcdrw4ntdd7gft655zlmnvzvfmaqql52yq0",
    },
    mintable: true,
    avatar: true,
    mint: {
      creator: "Passage",
      description: "Cyberpunk Hacker Avatar Assets",
      sale: Date.now(),
      price: "625000000",
      totalCount: 750,
      mintcount: 750,
      percentMinted: 0,
      royalties: 0.03,
      previewUrl: HackerPromo,
    },
  },
  {
    id: "fantasy",
    label: "Pinnacle: Fantasy Kit",
    contracts: {
      base: "pasg1vm7slaygzkr3qllr8d4s6n4xq5wmvdauu3395lvkf53rhh6tgkhqtj7muv",
      mint: "pasg1hkwcuq27j6lfkj7zflyen7ttvnhv5pgwtre4nsf9aj62c5e8zjyq2265d3",
      market: "pasg12vdwd2yzl3hk4l3tsk650w4vdns29n3kl0v5gqgxnapepq9czcmst7u4u9",
    },
    mintable: true,
    worldBuilding: true,
    mint: {
      creator: "Passage",
      description: "Fantasy Worldbuilding Assets",
      sale: Date.now(),
      price: "1250000000",
      totalCount: 500,
      mintcount: 500,
      percentMinted: 0,
      royalties: 0.03,
      previewUrl: FantasyPromo,
    },
  },
  {
    id: "scifi",
    label: "Portal: Sci-fi Kit",
    contracts: {
      base: "pasg17s7emulfygjuk0xn906athk5e5efsdtumsat5n2nad7mtrg4xres56veap",
      mint: "pasg1zs0uj3lm2jfeeekkula2rs2axs2txpyll3tnupu6flyd6mjjgv7sjqhkq6",
      market: "pasg1c5zxgp3mxqmgnudeu3ufztuqdkxq702h2dandvcfk3thz2wn4mzsycwhvf",
    },
    mintable: true,
    worldBuilding: true,
    mint: {
      creator: "Passage",
      description: "Sci-fi Worldbuilding Assets",
      sale: Date.now(),
      price: "1250000000",
      totalCount: 500,
      mintcount: 500,
      percentMinted: 0,
      royalties: 0.03,
      previewUrl: SciFiPromo,
    },
  },
  {
    id: "sc-t1",
    label: "Strange Clan: Deran Fang",
    offchainAssets: true,
    contracts: {
      base: "pasg1a2366fuydkz20h9q9kaxg5vqwpu8prgs6mhwn5qha3wsups0trcq5gl8d2",
      market: "pasg1qrwaatac4xvf4qnnagvsc93gcnv2x2t7mm575v3drzh2wcap9hasvjr3hr",
    },
    mintable: false,
  },
  {
    id: "sc-t2",
    label: "Strange Clan: Kira",
    contracts: {
      base: "pasg1kwdranvwf6vl2grh99layugwdnph6um2x0c0l8qyvrcgsjcykuhs6vaz9p",
      mint: "pasg1zjd5lwhch4ndnmayqxurja4x5y5mavy9ktrk6fzsyzan4wcgawnqqqamhp",
      market: "pasg1fjvnr96n8kcl6d8qzr74klqjl9wakmqv5c9hzvqwr904kp34ye8q74qs5l",
    },
    mintable: true,
    mint: {
      creator: "Strange Clan",
      description: "Kira",
      sale: Date.now(),
      price: "5000000000",
      totalCount: 5000,
      mintcount: 4900,
      percentMinted: 38.85,
      royalties: 0.06,
      previewUrl: SCT2Preview,
    },
  },
  {
    id: "sc-eggs",
    label: "Strange Clan: Eggs",
    contracts: {
      base: "pasg1etxtq3v4chzn7xrah3w6ukkxy7vlc889n5ervgxz425msar6ajzs06nl8p",
      market: "pasg1d7m8y95ttmrdryt8s8y7v2ceqsvcjddq40l9zypjn7snk04avmhqa2dkkh",
    },
    mintable: false,
  },
  {
    id: "metahuahua",
    label: "MetaHuahua",
    contracts: {
      base: "pasg1y6hjq8yvqzk6al4yrjl7yjkt87ujvhaq32c0qvt7627sk0j63d2q4dhzyw",
      market: "pasg1ehyucudueas79h0zwufcnxtv7s2sfmwc6rt0v0hzczdgvyr3p56qx2murn",
      mint: "pasg1axw5he6ktvz8rgacec3ldxmegy0urn0xevsysl7e0hx6dx90er6qt6dpja",
    },
    mintable: true,
    mint: {
      description: "Metahuahua",
      sale: Date.now(),
      price: "1000000000",
      totalCount: 3333,
      mintCount: 3333,
      percentMinted: 0,
      royalties: 0.1,
      previewUrl: MHPreview,
    },
  },
];

const mintableCollections = () => {
  return collections.filter((c) => c.mintable);
};

const collectionForMintContract = (contract) => {
  return collections.find((c) => c.mintable && c.contracts.mint === contract);
};

const collectionForBaseContract = (contract) => {
  return collections.find((c) => c.contracts.base === contract);
};

const collectionForCollectionName = (name) => {
  return collections.find((c) =>
    name.toLowerCase().includes(c.label.toLowerCase())
  );
};

const contractsByCollectionName = (name) => {
  return Object.fromEntries(collections.map((c) => [c.label, c.contracts]));
};

const contractsByBaseContract = () => {
  return Object.fromEntries(collections.map((c) => [c.contracts.base, c]));
};

const marketContractForBase = (baseContract) => {
  return collections.find((c) => c.contracts.base === baseContract).contracts
    .market;
};

export {
  collections,
  mintableCollections,
  collectionForMintContract,
  collectionForCollectionName,
  collectionForBaseContract,
  contractsByCollectionName,
  contractsByBaseContract,
  marketContractForBase,
};
