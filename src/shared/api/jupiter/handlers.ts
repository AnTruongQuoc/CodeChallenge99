import axios from 'axios';

import { env } from '@/shared/libs/env';

import { OrderResponse, SearchResponse } from './types';

const JUPITER_API_BASE = env.NEXT_PUBLIC_JUPITER_URL;

const JupiterEndpoints = {
  ULTRA: `${JUPITER_API_BASE}/ultra/v1`,
};

export const getSearchResponse = async (query: string) => {
  const response = await axios.get<unknown, SearchResponse>(
    `${JupiterEndpoints.ULTRA}/search?query=${query}`,
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
    `${JupiterEndpoints.ULTRA}/order?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&taker=${taker}`,
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
  const response = await axios.get(`${JupiterEndpoints.ULTRA}/order?${queryParams.toString()}`);
  return response.data;
};

/**
 * Docs: https://dev.jup.ag/docs/ultra/execute-order
 * @param transaction
 * @param requestId
 * @returns
 */
export const executeSwap = async (transaction: string, requestId: string) => {
  const response = await axios.post(`${JupiterEndpoints.ULTRA}/execute`, {
    transaction,
    requestId,
  });
  return response.data;
};
