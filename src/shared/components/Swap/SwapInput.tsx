'use client';

import { useState } from 'react';

import { SearchItem } from '@/shared/api/jupiter/types';
import { cn } from '@/shared/libs/utils';
import { clampDecimal, formatDecimalInput } from '@/shared/utils/input';

import TokenSelector from './TokenSelector';

interface SwapInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  selectedToken: SearchItem | null;
  onTokenSelect: (token: SearchItem) => void;
  balance?: number;
  onMaxClick?: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  defaultSearchToken?: string;
}

export default function SwapInput({
  label,
  value,
  onChange,
  selectedToken,
  onTokenSelect,
  balance,
  onMaxClick,
  placeholder = '0.0',
  disabled = false,
  className = '',
  defaultSearchToken = '',
}: SwapInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const formatBalance = (balance: number) => {
    if (balance >= 1000000) {
      return `${(balance / 1000000).toFixed(1)}M`;
    } else if (balance >= 1000) {
      return `${(balance / 1000).toFixed(1)}K`;
    }
    return balance.toFixed(4);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDecimalInput(e.target.value, selectedToken?.decimals || 9);
    onChange(formatted);
  };

  return (
    <div
      className={cn(
        'bg-card space-y-2 rounded-lg border p-4 transition-colors',
        className,
        isFocused && 'border-indigo-500 ring-2 ring-indigo-500/20',
      )}
    >
      <div className='flex items-center justify-between'>
        <label className='text-foreground text-sm font-medium'>{label}</label>
        {balance !== undefined && (
          <div className='flex items-center gap-2'>
            <span className='text-muted-foreground text-xs'>Balance: {formatBalance(balance)}</span>
            {onMaxClick && (
              <button
                onClick={onMaxClick}
                className='text-xs text-indigo-400 transition-colors hover:text-indigo-300'
              >
                MAX
              </button>
            )}
          </div>
        )}
      </div>

      <div className={cn('relative transition-colors', disabled && 'opacity-50')}>
        <div className='flex items-center py-3'>
          <TokenSelector
            selectedToken={selectedToken}
            onTokenSelect={onTokenSelect}
            placeholder='Select token'
            defaultSearchToken={defaultSearchToken}
          />

          <input
            type='text'
            value={value}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              if (value) {
                const clamped = clampDecimal(value, 0.001, 999, selectedToken?.decimals || 9);
                onChange(clamped);
              }
              setIsFocused(false);
            }}
            placeholder={placeholder}
            disabled={disabled}
            className='text-foreground placeholder-muted-foreground flex-1 bg-transparent text-right text-lg font-medium focus:outline-none'
          />
        </div>

        {selectedToken && value && (
          <div className='absolute right-0 bottom-0'>
            <div className='text-muted-foreground text-xs'>
              ${((parseFloat(value) || 0) * selectedToken.usdPrice).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
