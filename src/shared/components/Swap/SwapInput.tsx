'use client';

import { useState } from 'react';

import { SearchItem } from '@/shared/api/jupiter/types';
import { cn } from '@/shared/libs/utils';

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
    const inputValue = e.target.value;
    // Allow only numbers and decimal point
    if (inputValue === '' || /^\d*\.?\d*$/.test(inputValue)) {
      onChange(inputValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow backspace, delete, tab, escape, enter
    if (
      [8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
      // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true)
    ) {
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
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
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
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
