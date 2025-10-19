'use client';

import { useEffect, useState } from 'react';

import { usePrivy } from '@privy-io/react-auth';
import BigNumber from 'bignumber.js';

import { useJupiterOrder, useJupiterQuote } from '@/shared/api/jupiter/hooks/useJupiter';
import { SearchItem } from '@/shared/api/jupiter/types';

import SwapButton, { SwapDirectionButton } from './SwapButton';
import SwapInfo from './SwapInfo';
import SwapInput from './SwapInput';

export default function SwapInterface() {
  const { user, authenticated } = usePrivy();

  // Token selection state
  const [inputToken, setInputToken] = useState<SearchItem | null>(null);
  const [outputToken, setOutputToken] = useState<SearchItem | null>(null);

  // Amount state
  const [inputAmount, setInputAmount] = useState('');
  const [outputAmount, setOutputAmount] = useState('');

  // Quote state
  const [slippageBps, setSlippageBps] = useState(50); // 0.5%
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);

  // Get quote when input changes
  const { data: quote, isLoading: quoteLoading } = useJupiterQuote(
    inputToken?.id || '',
    outputToken?.id || '',
    BigNumber(inputAmount)
      .multipliedBy(10 ** (inputToken?.decimals || 0))
      .toString(),
    slippageBps,
    user?.wallet?.address,
  );

  // Order mutation
  const orderMutation = useJupiterOrder();

  // Update output amount when quote changes
  useEffect(() => {
    if (quote && inputAmount) {
      const outputAmount = BigNumber(quote.outAmount)
        .dividedBy(10 ** (outputToken?.decimals || 0))
        .toString();
      setOutputAmount(outputAmount);
    } else {
      setOutputAmount('');
    }
  }, [quote, inputAmount, outputToken?.decimals]);

  // Handle input amount change
  const handleInputAmountChange = (value: string) => {
    setInputAmount(value);
    if (!value) {
      setOutputAmount('');
    }
  };

  // Handle output amount change
  const handleOutputAmountChange = (value: string) => {
    setOutputAmount(value);
    if (!value) {
      setInputAmount('');
    }
  };

  // Swap tokens
  const swapTokens = () => {
    const tempToken = inputToken;
    setInputToken(outputToken);
    setOutputToken(tempToken);

    const tempAmount = inputAmount;
    setInputAmount(outputAmount);
    setOutputAmount(tempAmount);
  };

  // Handle max click
  const handleMaxClick = () => {
    // In a real implementation, you would fetch the user's balance
    // For now, we'll use a placeholder
    if (inputToken) {
      setInputAmount('1000'); // Placeholder balance
    }
  };

  // Handle swap execution
  const handleSwap = async () => {
    if (!authenticated || !user || !inputToken || !outputToken || !inputAmount || !quote) {
      return;
    }

    try {
      setIsLoadingQuote(true);

      // Get user's Solana address from Privy
      const solanaAddress = user.wallet?.address;
      if (!solanaAddress) {
        throw new Error('Solana wallet not connected');
      }

      // Create order
      const orderResult = await orderMutation.mutateAsync({
        inputMint: inputToken.id,
        outputMint: outputToken.id,
        amount: inputAmount,
        taker: solanaAddress,
      });

      if (orderResult.transaction) {
        // In a real implementation, you would:
        // 1. Sign the transaction with the user's wallet
        // 2. Send the transaction to the Solana network
        // 3. Wait for confirmation

        console.log('Swap transaction created:', orderResult.transaction);
        alert('Swap executed successfully! (This is a demo)');

        // Reset form
        setInputAmount('');
        setOutputAmount('');
      }
    } catch (error) {
      console.error('Swap failed:', error);
      alert('Swap failed: ' + (error as Error).message);
    } finally {
      setIsLoadingQuote(false);
    }
  };

  // Validation
  const canSwap =
    authenticated &&
    user?.wallet?.address &&
    inputToken &&
    outputToken &&
    inputAmount &&
    parseFloat(inputAmount) > 0 &&
    outputAmount &&
    parseFloat(outputAmount) > 0 &&
    !quoteLoading &&
    !isLoadingQuote;

  const getSwapButtonText = () => {
    if (!authenticated) return 'Connect Wallet';
    if (!inputToken) return 'Select Input Token';
    if (!outputToken) return 'Select Output Token';
    if (!inputAmount) return 'Enter Amount';
    if (quoteLoading) return 'Getting Quote...';
    if (isLoadingQuote) return 'Executing Swap...';
    return 'Swap';
  };

  return (
    <div className='bg-card border-border mx-auto max-w-md rounded-2xl border p-6 shadow-lg'>
      <div className='space-y-4'>
        {/* Header */}
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-blue-500'>Swap</h2>
          <p className='text-muted-foreground text-sm'>Trade tokens instantly with Jupiter</p>
        </div>

        {/* Input Token */}
        <div className='relative'>
          <SwapInput
            label='Selling'
            value={inputAmount}
            onChange={handleInputAmountChange}
            selectedToken={inputToken}
            onTokenSelect={setInputToken}
            onMaxClick={handleMaxClick}
            placeholder='0.0'
            disabled={!inputToken}
          />
        </div>

        {/* Swap Direction Button */}
        <div className='relative'>
          <SwapDirectionButton onClick={swapTokens} disabled={!inputToken || !outputToken} />
        </div>

        {/* Output Token */}
        <div className='relative'>
          <SwapInput
            label='Buying'
            value={outputAmount}
            onChange={handleOutputAmountChange}
            selectedToken={outputToken}
            onTokenSelect={setOutputToken}
            placeholder='0.0'
            disabled={!outputToken}
          />
        </div>

        {/* Swap Info */}
        {quote && <SwapInfo quote={quote} isLoading={quoteLoading} />}

        {/* Slippage Settings */}
        <div className='space-y-2'>
          <label className='text-muted-foreground text-sm font-medium'>Slippage Tolerance</label>
          <div className='flex gap-2'>
            {[0.1, 0.5, 1.0].map(slippage => (
              <button
                key={slippage}
                onClick={() => setSlippageBps(slippage * 100)}
                className={`rounded-md px-3 py-1 text-sm transition-colors ${
                  slippageBps === slippage * 100
                    ? 'bg-indigo-600 text-white'
                    : 'bg-accent text-muted-foreground hover:bg-accent/80'
                }`}
              >
                {slippage}%
              </button>
            ))}
            <input
              type='number'
              value={slippageBps / 100}
              onChange={e => setSlippageBps(parseFloat(e.target.value) * 100)}
              className='bg-background border-border text-foreground placeholder-muted-foreground flex-1 rounded-md border px-3 py-1 text-sm focus:border-transparent focus:ring-2 focus:ring-indigo-500'
              placeholder='Custom'
              step='0.1'
              min='0.1'
              max='50'
            />
          </div>
        </div>

        {/* Swap Button */}
        <SwapButton onClick={handleSwap} disabled={!canSwap} loading={isLoadingQuote}>
          {getSwapButtonText()}
        </SwapButton>

        {/* Connection Status */}
        {authenticated && user?.wallet?.address && (
          <div className='text-muted-foreground text-center text-xs'>
            Connected: {user.wallet.address.slice(0, 8)}...{user.wallet.address.slice(-8)}
          </div>
        )}
      </div>
    </div>
  );
}
