import axios from 'axios';

import { OrderResponse, SearchResponse } from './types';

const JUPITER_API_BASE = 'https://lite-api.jup.ag/ultra/v1';

export const getSearchResponse = async (query: string) => {
  const response = await axios.get<unknown, SearchResponse>(
    `${JUPITER_API_BASE}/search?query=${query}`,
  );
  return response.data;
};

export const getOrderResponse = async (
  inputMint: string,
  outputMint: string,
  amount: string,
  taker: string,
) => {
  const response = await axios.get<unknown, OrderResponse>(
    `${JUPITER_API_BASE}/order?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&taker=${taker}`,
  );
  return response.data;
};

export const getQuote = async (
  inputMint: string,
  outputMint: string,
  amount: string,
  slippageBps: number = 50,
  taker?: string,
) => {
  const queryParams = new URLSearchParams({
    inputMint,
    outputMint,
    slippageBps: slippageBps.toString(),
    amount,
  });
  if (taker) {
    queryParams.set('taker', taker);
  }
  const response = await axios.get(`${JUPITER_API_BASE}/order?${queryParams.toString()}`);
  return response.data;
};

export const executeSwap = async (transaction: string, userPublicKey: string) => {
  // This would typically involve signing and sending the transaction
  // For now, we'll return the transaction data
  return {
    transaction,
    userPublicKey,
    status: 'pending',
  };
};
