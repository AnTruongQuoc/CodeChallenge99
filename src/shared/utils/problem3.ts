export interface CodeIssue {
  id: string;
  category: 'Performance' | 'Type Safety' | 'Logic Error' | 'Best Practice' | 'Maintainability';
  severity: 'High' | 'Medium' | 'Low';
  title: string;
  description: string;
  codeSnippet: string;
  explanation: string;
  fix: string;
}

export interface CodeAnalysis {
  issues: CodeIssue[];
  summary: {
    totalIssues: number;
    highSeverity: number;
    mediumSeverity: number;
    lowSeverity: number;
  };
  refactoredCode: string;
}

const messyReactCode = `
interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {

}
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

	const getPriority = (blockchain: any): number => {
	  switch (blockchain) {
	    case 'Osmosis':
	      return 100
	    case 'Ethereum':
	      return 50
	    case 'Arbitrum':
	      return 30
	    case 'Zilliqa':
	      return 20
	    case 'Neo':
	      return 20
	    default:
	      return -99
	  }
	}

  const sortedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
		  const balancePriority = getPriority(balance.blockchain);
		  if (lhsPriority > -99) {
		     if (balance.amount <= 0) {
		       return true;
		     }
		  }
		  return false
		}).sort((lhs: WalletBalance, rhs: WalletBalance) => {
			const leftPriority = getPriority(lhs.blockchain);
		  const rightPriority = getPriority(rhs.blockchain);
		  if (leftPriority > rightPriority) {
		    return -1;
		  } else if (rightPriority > leftPriority) {
		    return 1;
		  }
    });
  }, [balances, prices]);

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed()
    }
  })

  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow 
        className={classes.row}
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    )
  })

  return (
    <div {...rest}>
      {rows}
    </div>
  )
}`;

export const getOriginalCode = (): string => {
  return messyReactCode;
};

export const analyzeMessyCode = (): CodeAnalysis => {
  const issues: CodeIssue[] = [
    {
      id: 'logic-error-1',
      category: 'Logic Error',
      severity: 'High',
      title: 'Undefined Variable Reference',
      description: 'Variable `lhsPriority` is used but never defined',
      codeSnippet: 'if (lhsPriority > -99) {',
      explanation:
        'The code references `lhsPriority` which is not defined anywhere in the scope. This will cause a ReferenceError at runtime.',
      fix: 'Should be `balancePriority > -99` to match the variable that was actually declared.',
    },
    {
      id: 'logic-error-2',
      category: 'Logic Error',
      severity: 'High',
      title: 'Incorrect Filter Logic',
      description: 'Filter condition logic is inverted and confusing',
      codeSnippet: `if (lhsPriority > -99) {
    if (balance.amount <= 0) {
      return true;
    }
  }
  return false`,
      explanation:
        'The filter is supposed to show balances with positive amounts and valid priorities, but the logic is inverted. It returns true for negative amounts and false for positive amounts.',
      fix: 'Should filter for positive amounts: `return balancePriority > -99 && balance.amount > 0`',
    },
    {
      id: 'performance-1',
      category: 'Performance',
      severity: 'High',
      title: 'Unnecessary Re-computation in useMemo',
      description:
        'useMemo dependency array includes `prices` but `prices` is not used in the computation',
      codeSnippet: '}, [balances, prices]);',
      explanation:
        'The `prices` dependency causes the expensive sorting and filtering operation to re-run whenever prices change, even though prices are not used in the sorting logic.',
      fix: 'Remove `prices` from dependency array: `[balances]`',
    },
    {
      id: 'performance-2',
      category: 'Performance',
      severity: 'Medium',
      title: 'Redundant Function Calls',
      description: 'getPriority function is called multiple times for the same blockchain values',
      codeSnippet: `const balancePriority = getPriority(balance.blockchain);
  // ... later in sort
  const leftPriority = getPriority(lhs.blockchain);
  const rightPriority = getPriority(rhs.blockchain);`,
      explanation:
        'The same blockchain values are being processed multiple times, causing redundant function calls. This is inefficient for large datasets.',
      fix: 'Cache priority values or use a Map to store blockchain-to-priority mappings.',
    },
    {
      id: 'performance-3',
      category: 'Performance',
      severity: 'Medium',
      title: 'Missing Memoization for Formatted Balances',
      description: 'formattedBalances is computed on every render without memoization',
      codeSnippet: 'const formattedBalances = sortedBalances.map((balance: WalletBalance) => {',
      explanation:
        "The formattedBalances computation runs on every render, even when sortedBalances hasn't changed.",
      fix: 'Wrap in useMemo with proper dependencies.',
    },
    {
      id: 'type-safety-1',
      category: 'Type Safety',
      severity: 'High',
      title: 'Untyped Function Parameter',
      description: 'getPriority function parameter has `any` type',
      codeSnippet: 'const getPriority = (blockchain: any): number => {',
      explanation:
        'Using `any` defeats the purpose of TypeScript and can lead to runtime errors. The blockchain parameter should have a proper type.',
      fix: "Define a proper type: `type Blockchain = 'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo'`",
    },
    {
      id: 'type-safety-2',
      category: 'Type Safety',
      severity: 'Medium',
      title: 'Missing Blockchain Property in Interface',
      description: 'WalletBalance interface missing blockchain property',
      codeSnippet: 'interface WalletBalance {\n  currency: string;\n  amount: number;\n}',
      explanation:
        "The code uses `balance.blockchain` but the interface doesn't define this property, causing a TypeScript error.",
      fix: 'Add blockchain property to WalletBalance interface.',
    },
    {
      id: 'best-practice-1',
      category: 'Best Practice',
      severity: 'Medium',
      title: 'Array Index as React Key',
      description: 'Using array index as React key is an anti-pattern',
      codeSnippet: 'key={index}',
      explanation:
        'Using array index as key can cause rendering issues and performance problems when the list order changes.',
      fix: 'Use a unique identifier like `balance.currency` or a combination of properties or `nanoid` library to generate unique keys.',
    },
    {
      id: 'best-practice-2',
      category: 'Best Practice',
      severity: 'Low',
      title: 'Empty Props Interface',
      description: "Props interface extends BoxProps but doesn't add any properties",
      codeSnippet: 'interface Props extends BoxProps {\n\n}',
      explanation:
        "Empty interfaces are unnecessary and create confusion about the component's actual props.",
      fix: 'Either add properties or remove the interface and use BoxProps directly.',
    },
    {
      id: 'maintainability-1',
      category: 'Maintainability',
      severity: 'Medium',
      title: 'Hardcoded Priority Values',
      description: 'Blockchain priorities are hardcoded in the function',
      codeSnippet: `case 'Osmosis':\n  return 100\ncase 'Ethereum':\n  return 50`,
      explanation:
        'Hardcoded values make the code less maintainable and harder to modify. Adding new blockchains requires code changes.',
      fix: 'Move to a configuration object or constants file.',
    },
    {
      id: 'maintainability-2',
      category: 'Maintainability',
      severity: 'Low',
      title: 'Inconsistent Code Formatting',
      description: 'Inconsistent indentation and spacing throughout the code',
      codeSnippet: 'Mixed indentation patterns',
      explanation: 'Inconsistent formatting makes code harder to read and maintain.',
      fix: 'Use a consistent formatting tool like Prettier.',
    },
  ];

  return {
    issues,
    summary: {
      totalIssues: issues.length,
      highSeverity: issues.filter(issue => issue.severity === 'High').length,
      mediumSeverity: issues.filter(issue => issue.severity === 'Medium').length,
      lowSeverity: issues.filter(issue => issue.severity === 'Low').length,
    },
    refactoredCode: getRefactoredCode(),
  };
};

const getRefactoredCode = (): string => {
  return `
  // Define proper types
  type Blockchain = 'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo';
  
  interface WalletBalance {
    currency: string;
    amount: number;
    blockchain: Blockchain;
  }
  
  interface FormattedWalletBalance extends WalletBalance {
    formatted: string;
  }
  
  // Move constants to configuration
  const BLOCKCHAIN_PRIORITIES: Record<Blockchain, number> = {
    'Osmosis': 100,
    'Ethereum': 50,
    'Arbitrum': 30,
    'Zilliqa': 20,
    'Neo': 20,
  } as const;
  
  const DEFAULT_PRIORITY = -99;
  
  // Memoized priority function with proper typing
  const getPriority = useCallback((blockchain: Blockchain): number => {
    return BLOCKCHAIN_PRIORITIES[blockchain] ?? DEFAULT_PRIORITY;
  }, []);
  
  // Custom hook for wallet balances logic
  const useFormattedWalletBalances = () => {
    const balances = useWalletBalances();
    const prices = usePrices();
  
    const sortedBalances = useMemo(() => {
      return balances
        .filter((balance: WalletBalance) => {
          const balancePriority = getPriority(balance.blockchain);
          return balancePriority > DEFAULT_PRIORITY && balance.amount > 0;
        })
        .sort((lhs: WalletBalance, rhs: WalletBalance) => {
          const leftPriority = getPriority(lhs.blockchain);
          const rightPriority = getPriority(rhs.blockchain);
          return rightPriority - leftPriority; // Descending order
        });
    }, [balances, getPriority]);
  
    const formattedBalances = useMemo((): FormattedWalletBalance[] => {
      return sortedBalances.map((balance: WalletBalance) => ({
        ...balance,
        formatted: balance.amount.toFixed(2),
      }));
    }, [sortedBalances]);
  
    return { formattedBalances, prices };
  };
  
  // Main component
  const WalletPage: React.FC<BoxProps> = (props) => {
    const { children, ...rest } = props;
    const { formattedBalances, prices } = useFormattedWalletBalances();
  
    const rows = useMemo(() => {
      return formattedBalances.map((balance: FormattedWalletBalance) => {
        const usdValue = prices[balance.currency] * balance.amount;
        return (
          <WalletRow
            className={classes.row}
            key={\`\${balance.blockchain}-\${balance.currency}\`} // Unique key or we can use \`\nanoid\`\ like library to generate unique keys
            amount={balance.amount}
            usdValue={usdValue}
            formattedAmount={balance.formatted}
          />
        );
      });
    }, [formattedBalances, prices]);
  
    return (
      <div {...rest}>
        {rows}
      </div>
    );
  };`;
};
