'use client';

import { useEffect, useRef, useState } from 'react';

import { Check, ChevronDown, Search } from 'lucide-react';
import Image from 'next/image';

import { useJupiterSearch } from '@/shared/api/jupiter/hooks/useJupiter';
import { SearchItem } from '@/shared/api/jupiter/types';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';

interface TokenSelectorProps {
  selectedToken: SearchItem | null;
  onTokenSelect: (token: SearchItem) => void;
  placeholder?: string;
  className?: string;
}

export default function TokenSelector({
  selectedToken,
  onTokenSelect,
  placeholder = 'Select token',
  className = '',
}: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch search results
  const { data: searchResults, isLoading } = useJupiterSearch(debouncedQuery);

  const handleTokenSelect = (token: SearchItem) => {
    onTokenSelect(token);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className='bg-accent border-border flex w-full items-center justify-between rounded-full border p-3 transition-colors hover:border-indigo-500 hover:bg-indigo-300/20'
      >
        <div className='flex items-center gap-3'>
          {selectedToken ? (
            <>
              <Image
                width={24}
                height={24}
                src={selectedToken.icon}
                alt={selectedToken.symbol}
                className='rounded-full object-cover'
                onError={e => {
                  (e.target as HTMLImageElement).src = '/default-token.svg';
                }}
              />
              <div className='text-left'>
                <div className='text-foreground font-medium'>{selectedToken.symbol}</div>
              </div>
            </>
          ) : (
            <span className='text-muted-foreground'>{placeholder}</span>
          )}
          <ChevronDown
            className={`text-muted-foreground h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <div className='bg-card border-border absolute top-full right-0 left-0 z-50 mt-2 max-h-80 overflow-hidden rounded-lg border shadow-lg'>
            <div className='border-border border-b p-3'>
              <div className='relative'>
                <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                <input
                  type='text'
                  placeholder='Search tokens...'
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className='bg-background border-border text-foreground placeholder-muted-foreground w-full rounded-md border py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-indigo-500'
                  autoFocus
                />
              </div>
            </div>

            <div className='max-h-64 overflow-y-auto'>
              {isLoading ? (
                <div className='text-muted-foreground p-4 text-center'>
                  <div className='mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent'></div>
                  Searching...
                </div>
              ) : searchResults?.length ? (
                searchResults.map(token => (
                  <button
                    key={token.id}
                    onClick={() => handleTokenSelect(token)}
                    className='hover:bg-accent border-border flex w-full items-center gap-3 border-b p-3 transition-colors last:border-b-0'
                  >
                    <Image
                      width={24}
                      height={24}
                      src={token.icon}
                      alt={token.symbol}
                      className='rounded-full object-cover'
                      onError={e => {
                        (e.target as HTMLImageElement).src = '/default-token.svg';
                      }}
                    />
                    <div className='flex-1 text-left'>
                      <div className='flex items-center gap-2'>
                        <span className='text-foreground font-medium'>{token.symbol}</span>
                        {token.isVerified && (
                          <span className='rounded bg-green-400/20 px-2 py-0.5 text-xs text-green-400'>
                            Verified
                          </span>
                        )}
                      </div>
                      <div className='text-muted-foreground text-sm'>{token.name}</div>
                      {token.usdPrice && (
                        <div className='text-muted-foreground text-xs'>
                          ${token.usdPrice.toLocaleString()}
                        </div>
                      )}
                    </div>
                    {selectedToken?.id === token.id && (
                      <Check className='h-4 w-4 text-indigo-400' />
                    )}
                  </button>
                ))
              ) : debouncedQuery ? (
                <div className='text-muted-foreground p-4 text-center'>
                  No tokens found for {debouncedQuery}
                </div>
              ) : (
                <div className='text-muted-foreground p-4 text-center'>
                  Start typing to search tokens
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
