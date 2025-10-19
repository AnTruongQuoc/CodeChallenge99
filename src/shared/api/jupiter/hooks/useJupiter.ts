import { useMutation, useQuery } from '@tanstack/react-query';

import { getOrderResponse, getQuote, getSearchResponse } from '../handlers';

export const useJupiterSearch = (q: string) => {
  return useQuery({
    queryKey: ['jupiter-search', q],
    queryFn: () => getSearchResponse(q),
    enabled: q.length > 0,
    staleTime: 30000, // 30 seconds
  });
};

export const useJupiterQuote = (
  inputMint: string,
  outputMint: string,
  amount: string,
  slippageBps: number = 50,
  taker?: string,
) => {
  return useQuery({
    queryKey: ['jupiter-quote', inputMint, outputMint, amount, slippageBps, taker],
    queryFn: () => getQuote(inputMint, outputMint, amount, slippageBps, taker),
    enabled: !!inputMint && !!outputMint && !!amount && parseFloat(amount) > 0,
    staleTime: 15000, // 15 seconds to avoid rate limiting
    refetchInterval: 15000, // Refetch every 15 seconds for live quotes
  });
};

export const useJupiterOrder = () => {
  return useMutation({
    mutationFn: ({
      inputMint,
      outputMint,
      amount,
      taker,
    }: {
      inputMint: string;
      outputMint: string;
      amount: string;
      taker: string;
    }) => getOrderResponse(inputMint, outputMint, amount, taker),
  });
};
