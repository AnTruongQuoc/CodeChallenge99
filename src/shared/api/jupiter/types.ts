// {
//     "id": "So11111111111111111111111111111111111111112",
//     "name": "Wrapped SOL",
//     "symbol": "SOL",
//     "icon": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
//     "decimals": 9,
//     "circSupply": 546952946.3340228,
//     "totalSupply": 612147133.0310086,
//     "tokenProgram": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
//     "firstPool": {
//         "id": "58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2",
//         "createdAt": "2021-03-29T10:05:48Z"
//     },
//     "holderCount": 3820662,
//     "audit": {
//         "mintAuthorityDisabled": true,
//         "freezeAuthorityDisabled": true,
//         "topHoldersPercentage": 0.5873589582365657
//     },
//     "apy": {
//         "jupEarn": 4.16
//     },
//     "organicScore": 98.72429292817931,
//     "organicScoreLabel": "high",
//     "isVerified": true,
//     "tags": [
//         "community",
//         "moonshot-verified",
//         "strict",
//         "verified"
//     ],
//     "fdv": 115668680500.27411,
//     "mcap": 103349868331.3917,
//     "usdPrice": 188.95568444067982,
//     "priceBlockId": 374393996,
//     "liquidity": 218545022.35934895,
//     "stats5m": {
//         "priceChange": -0.07551753459632715,
//         "liquidityChange": -0.049363499060462,
//         "volumeChange": -3.677346029311418,
//         "buyVolume": 17283480.088794768,
//         "sellVolume": 17804016.233347394,
//         "buyOrganicVolume": 200093.7165096009,
//         "sellOrganicVolume": 144164.93564387326,
//         "numBuys": 32828,
//         "numSells": 45018,
//         "numTraders": 18561,
//         "numOrganicBuyers": 751,
//         "numNetBuyers": 3175
//     },
//     "stats1h": {
//         "priceChange": -0.04272035143914425,
//         "liquidityChange": -0.05808940637149853,
//         "volumeChange": -8.671787049162806,
//         "buyVolume": 236516176.87825465,
//         "sellVolume": 237603701.02260017,
//         "buyOrganicVolume": 3454879.373371822,
//         "sellOrganicVolume": 3583724.9250463666,
//         "numBuys": 489430,
//         "numSells": 675893,
//         "numTraders": 130199,
//         "numOrganicBuyers": 2145,
//         "numNetBuyers": 15466
//     },
//     "stats6h": {
//         "priceChange": 1.142374666198783,
//         "liquidityChange": 0.2658137805415419,
//         "volumeChange": 20.187441907530985,
//         "buyVolume": 1362377043.923163,
//         "sellVolume": 1394875834.6269023,
//         "buyOrganicVolume": 15868289.32133801,
//         "sellOrganicVolume": 18831074.951410726,
//         "numBuys": 2795646,
//         "numSells": 3768608,
//         "numTraders": 326114,
//         "numOrganicBuyers": 6497,
//         "numNetBuyers": 24986
//     },
//     "stats24h": {
//         "priceChange": 1.5959376686816846,
//         "liquidityChange": 1.0088155249966317,
//         "volumeChange": -11.19989925191919,
//         "buyVolume": 4972890478.479534,
//         "sellVolume": 5041974443.814973,
//         "buyOrganicVolume": 85462234.66044146,
//         "sellOrganicVolume": 93619732.5966965,
//         "numBuys": 11471976,
//         "numSells": 15524054,
//         "numTraders": 727073,
//         "numOrganicBuyers": 19364,
//         "numNetBuyers": 66770
//     },
//     "ctLikes": 5015,
//     "smartCtLikes": 590,
//     "updatedAt": "2025-10-19T11:44:51.002163531Z"
// }

export type SearchStats = {
  priceChange: number;
  liquidityChange: number;
  volumeChange: number;
  buyVolume: number;
  sellVolume: number;
  buyOrganicVolume: number;
  sellOrganicVolume: number;
  numBuys: number;
  numSells: number;
  numTraders: number;
  numOrganicBuyers: number;
  numNetBuyers: number;
};
export type SearchItem = {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  decimals: number;
  circSupply: number;
  totalSupply: number;
  tokenProgram: string;
  firstPool: {
    id: string;
    createdAt: string;
  };
  holderCount: number;
  audit: {
    mintAuthorityDisabled: boolean;
    freezeAuthorityDisabled: boolean;
    topHoldersPercentage: number;
  };
  apy: {
    jupEarn: number;
  };
  organicScore: number;
  organicScoreLabel: string;
  isVerified: boolean;
  tags: string[];
  fdv: number;
  mcap: number;
  usdPrice: number;
  priceBlockId: number;
  liquidity: number;
  stats5m: SearchStats;
  stats1h: SearchStats;
  stats6h: SearchStats;
  stats24h: SearchStats;
  ctLikes: number;
  smartCtLikes: number;
  updatedAt: string;
};

export type SearchResponse = {
  data: SearchItem[];
};

export type RoutePlan = {
  swapInfo: {
    ammKey: string;
    label: string;
    inputMint: string;
    outputMint: string;
    inAmount: string;
    outAmount: string;
    feeAmount: string;
    feeMint: string;
  };
  percent: number;
  bps: number;
};

export type OrderResponse = {
  data: {
    mode: string;
    inputMint: string;
    outputMint: string;
    inAmount: string;
    outAmount: string;
    otherAmountThreshold: string;
    swapMode: string;
    slippageBps: number;
    priceImpactPct: string;
    routePlan: RoutePlan[];
    feeBps: number;
    transaction: string | null;
    gasless: boolean;
    signatureFeeLamports: number;
    signatureFeePayer: string | null;
    prioritizationFeeLamports: number;
    prioritizationFeePayer: string | null;
    rentFeeLamports: number;
    rentFeePayer: string | null;
    requestId: string;
    swapType: string;
    router: string;
    quoteId: string;
    maker: string | null;
    taker: string | null;
    expireAt: string | null;
    platformFee: {
      amount: string;
      feeBps: number;
    };
    inUsdValue: number;
    outUsdValue: number;
    priceImpact: number;
    swapUsdValue: number;
    totalTime: number;
  };
};
