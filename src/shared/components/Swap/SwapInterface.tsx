'use client';

import { useEffect, useMemo, useState } from 'react';

import { usePrivy } from '@privy-io/react-auth';
import { useSignTransaction, useWallets } from '@privy-io/react-auth/solana';
import BigNumber from 'bignumber.js';
import { toast } from 'sonner';

import {
  useJupiterExecuteSwap,
  useJupiterOrder,
  useJupiterQuote,
} from '@/shared/api/jupiter/hooks/useJupiter';
import { SearchItem } from '@/shared/api/jupiter/types';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/libs/utils';

import SwapButton, { SwapDirectionButton } from './SwapButton';
import SwapInfo from './SwapInfo';
import SwapInput from './SwapInput';

interface SwapInterfaceProps {
  defaultInputSearchToken?: string;
  defaultOutputSearchToken?: string;
}

export default function SwapInterface({
  defaultInputSearchToken = '',
  defaultOutputSearchToken = '',
}: SwapInterfaceProps) {
  const { ready, user, authenticated, login } = usePrivy();
  const { signTransaction } = useSignTransaction();
  const { wallets } = useWallets();

  // Token selection state
  const [inputToken, setInputToken] = useState<SearchItem | null>(null);
  const [outputToken, setOutputToken] = useState<SearchItem | null>(null);

  // Amount state
  const [inputAmount, setInputAmount] = useState('');
  const [outputAmount, setOutputAmount] = useState('');

  // Quote state
  const [slippageBps, setSlippageBps] = useState(50); // 0.5%
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);

  const rawInputAmount = useMemo(() => {
    return BigNumber(inputAmount)
      .multipliedBy(10 ** (inputToken?.decimals || 0))
      .toString();
  }, [inputAmount, inputToken]);

  // Get quote when input changes
  const { data: quote, isLoading: quoteLoading } = useJupiterQuote(
    inputToken?.id || '',
    outputToken?.id || '',
    rawInputAmount,
    slippageBps,
    user?.wallet?.address,
  );

  // Order mutation
  const orderMutation = useJupiterOrder();
  const executeSwapMutation = useJupiterExecuteSwap();

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

  const handleSelectInputToken = (token: SearchItem | null) => {
    if (token?.id === outputToken?.id) {
      if (inputToken) {
        swapTokens();
      } else {
        toast.error('Input and output tokens cannot be the same');
      }
      return;
    }
    setInputToken(token);
  };

  const handleSelectOutputToken = (token: SearchItem | null) => {
    if (token?.id === inputToken?.id) {
      if (outputToken) {
        swapTokens();
      } else {
        toast.error('Input and output tokens cannot be the same');
      }
      return;
    }
    setOutputToken(token);
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
        amount: rawInputAmount,
        taker: solanaAddress,
      });

      if (orderResult.transaction) {
        const transactionBase64 = orderResult.transaction;
        const transaction = Buffer.from(transactionBase64, 'base64');

        const signature = await signTransaction({
          transaction: transaction,
          wallet: wallets[0],
        });

        const signedTxBase64 = Buffer.from(signature.signedTransaction).toString('base64');

        toast.success('Signed swap transaction created', {
          description: `Request ID: ${orderResult.requestId}`,
        });

        const executeSwapResult = await executeSwapMutation.mutateAsync({
          signedTransaction: signedTxBase64,
          requestId: orderResult.requestId,
        });

        if (executeSwapResult?.status === 'Success') {
          toast.success('Swap executed successfully', {
            action: {
              label: 'View on Solana Explorer',
              onClick: () => {
                window.open(`https://solscan.io/tx/${executeSwapResult?.signature}`, '_blank');
              },
            },
          });
        } else {
          toast.error('Swap failed', {
            action: {
              label: 'View on Solana Explorer',
              onClick: () => {
                window.open(`https://solscan.io/tx/${executeSwapResult?.signature}`, '_blank');
              },
            },
          });
        }

        // Reset form
        setInputAmount('');
        setOutputAmount('');
      }
    } catch (error) {
      console.error('Swap failed:', error);
      toast.error('Swap failed', {
        description: (error as Error).message,
      });
    } finally {
      setIsLoadingQuote(false);
    }
  };

  const handleConnect = async () => {
    if (!ready || authenticated) return;
    login();
  };

  const getConnectButtonText = () => {
    if (!ready) return 'Connecting...';
    if (authenticated) return 'Connected';
    return 'Connect Wallet';
  };

  const isConnected = ready && authenticated && user?.wallet?.address;

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
    !quote?.error &&
    !isLoadingQuote;

  const getSwapButtonText = () => {
    if (!inputToken) return 'Select Input Token';
    if (!outputToken) return 'Select Output Token';
    if (!inputAmount) return 'Enter Amount';
    if (quoteLoading) return 'Getting Quote...';
    if (quote && quote?.error) return quote?.errorMessage;
    if (isLoadingQuote) return 'Executing Swap...';
    return 'Swap';
  };

  return (
    <div className='bg-card border-border mx-auto max-w-md rounded-2xl border p-6 shadow-lg'>
      <div className='space-y-4'>
        {/* Header */}
        <div className='text-center'>
          <h2 className='text-2xl font-bold tracking-wider text-blue-500'>Swap</h2>
          <p className='text-muted-foreground pt-1 text-sm font-semibold'>
            Trade tokens instantly with Jupiter
          </p>
        </div>

        <div className='relative space-y-4'>
          {/* Input Token */}
          <div className='relative'>
            <SwapInput
              label='Selling'
              value={inputAmount}
              onChange={handleInputAmountChange}
              selectedToken={inputToken}
              onTokenSelect={handleSelectInputToken}
              onMaxClick={handleMaxClick}
              placeholder='0.0'
              disabled={!inputToken}
              defaultSearchToken={defaultInputSearchToken}
            />
          </div>

          {/* Swap Direction Button */}
          <SwapDirectionButton onClick={swapTokens} disabled={!inputToken || !outputToken} />

          {/* Output Token */}
          <div className='relative'>
            <SwapInput
              label='Buying'
              value={outputAmount}
              onChange={handleOutputAmountChange}
              selectedToken={outputToken}
              onTokenSelect={handleSelectOutputToken}
              placeholder='0.0'
              disabled={!outputToken}
              defaultSearchToken={defaultOutputSearchToken}
            />
          </div>
        </div>

        {/* Swap Info */}
        {quote && <SwapInfo quote={quote} isLoading={quoteLoading} outputToken={outputToken} />}

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

        {/** Connect & Swap Button */}
        {!isConnected ? (
          <Button
            onClick={handleConnect}
            className={cn(
              'flex w-full flex-row items-center justify-center gap-4 rounded-md bg-indigo-600 px-4 py-2 text-center font-semibold text-white transition-colors hover:bg-indigo-700',
              !ready && 'cursor-not-allowed opacity-50',
              authenticated && 'bg-green-500 hover:bg-green-600',
            )}
          >
            {!ready && (
              <span className='bg-foreground inline-flex size-3 animate-ping rounded-full opacity-75'></span>
            )}
            {getConnectButtonText()}
          </Button>
        ) : (
          <SwapButton onClick={handleSwap} disabled={!canSwap} loading={isLoadingQuote}>
            {getSwapButtonText()}
          </SwapButton>
        )}

        {/* Connection Status */}
        {ready && authenticated && user?.wallet?.address && (
          <div className='text-muted-foreground text-center text-xs font-semibold'>
            Connected: {user.wallet.address.slice(0, 8)}...{user.wallet.address.slice(-8)}
          </div>
        )}
      </div>
    </div>
  );
}
