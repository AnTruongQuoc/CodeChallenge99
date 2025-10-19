'use client';

import { useCallback, useEffect, useState } from 'react';

import { CodeIcon, Repeat2Icon, RepeatIcon, SigmaIcon } from 'lucide-react';

import {
  getCodeExample,
  sum_to_n_a,
  sum_to_n_b,
  sum_to_n_c,
  testSummationFunctions,
} from '@/shared/utils/problem1';

const implementations = [
  {
    name: 'Iterative Approach',
    label: 'a',
    description: 'Uses a simple for loop to iterate through all numbers from 1 to n',
    fn: sum_to_n_a,
    complexity: 'O(n) time, O(1) space',
    icon: <Repeat2Icon className='size-4' />,
  },
  {
    name: 'Mathematical Formula',
    label: 'b',
    description: "Uses Gauss's formula: n × (n + 1) ÷ 2.",
    fn: sum_to_n_b,
    complexity: 'O(1) time, O(1) space',
    icon: <SigmaIcon className='size-4' />,
  },
  {
    name: 'Recursive Approach',
    label: 'c',
    description: 'Uses recursion to calculate the sum.',
    fn: sum_to_n_c,
    complexity: 'O(n) time, O(n) space',
    icon: <RepeatIcon className='size-4' />,
  },
];

interface ImplementationResult {
  name: string;
  description: string;
  result: number;
  executionTime: number;
  complexity: string;
  icon: React.ReactNode;
}

export default function ThreeWaysToSumDemo() {
  const [input, setInput] = useState<number>(5);

  const [results, setResults] = useState<ImplementationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateResults = useCallback(async (n: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const newResults: ImplementationResult[] = [];

      for (const impl of implementations) {
        const startTime = performance.now();
        const result = impl.fn(n);
        const endTime = performance.now();
        const executionTime = endTime - startTime;

        newResults.push({
          name: impl.name,
          description: impl.description,
          result,
          executionTime,
          complexity: impl.complexity,
          icon: impl.icon,
        });
      }

      setResults(newResults);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (input >= 0 && Number.isInteger(input)) {
      calculateResults(input);
    }
  }, [input, calculateResults]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setInput(value);
    }
  };

  const verifyResults = () => {
    const testResult = testSummationFunctions(input);
    return testResult.allEqual;
  };

  return (
    <div className='mx-auto max-w-6xl space-y-8 p-6'>
      <div className='space-y-4 text-center'>
        <h1 className='text-foreground text-4xl font-bold'>Three Ways to Sum Challenge</h1>
        <p className='text-muted-foreground mx-auto max-w-2xl text-lg'>
          Three unique implementations to calculate the sum of all integers from 1 to n.
          <br />
          <span className='font-mono text-indigo-400'>sum_to_n(5) = 1 + 2 + 3 + 4 + 5 = 15</span>
        </p>
      </div>

      <div className='bg-card border-border rounded-lg border p-6'>
        <div className='flex flex-col items-center gap-4 sm:flex-row'>
          <label htmlFor='number-input' className='text-foreground text-lg font-medium'>
            Enter a number (n):
          </label>
          <input
            id='number-input'
            type='number'
            value={input}
            onChange={handleInputChange}
            min='0'
            max='10000'
            className='border-border bg-background text-foreground rounded-md border px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500'
            placeholder='Enter a number'
          />
          {isLoading && (
            <div className='flex items-center gap-2 text-indigo-400'>
              <div className='h-4 w-4 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent'></div>
              Calculating...
            </div>
          )}
        </div>

        {error && (
          <div className='bg-destructive/10 border-destructive/20 text-destructive mt-4 rounded-md border p-3'>
            {error}
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
          {results.map((result, index) => (
            <div
              key={index}
              className='bg-card border-border rounded-lg border p-6 transition-shadow duration-300 hover:shadow-lg'
            >
              <div className='mb-4 flex items-center gap-3'>
                <span className='text-2xl'>{result.icon}</span>
                <h3 className='text-foreground text-xl font-semibold'>{result.name}</h3>
              </div>

              <p className='text-muted-foreground mb-4 text-sm'>{result.description}</p>

              <div className='space-y-3'>
                <div className='bg-background rounded-md p-3'>
                  <div className='text-muted-foreground text-sm'>Result</div>
                  <div className='font-mono text-2xl font-bold text-indigo-400'>
                    {result.result.toLocaleString()}
                  </div>
                </div>

                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Complexity:</span>
                  <span className='text-foreground font-mono'>{result.complexity}</span>
                </div>

                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Execution Time:</span>
                  <span className='text-foreground font-mono'>
                    {result.executionTime.toFixed(3)}ms
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {results.length > 0 && (
        <div className='bg-card border-border rounded-lg border p-6'>
          <h3 className='text-foreground mb-4 flex items-center gap-2 text-xl font-semibold'>
            <span>✅</span>
            Verification
          </h3>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div>
              <div className='text-muted-foreground mb-2 text-sm'>All implementations match:</div>
              <div
                className={`font-semibold ${verifyResults() ? 'text-green-400' : 'text-red-400'}`}
              >
                {verifyResults() ? '✅ Yes' : '❌ No'}
              </div>
            </div>

            <div>
              <div className='text-muted-foreground mb-2 text-sm'>Expected result:</div>
              <div className='font-mono text-indigo-400'>
                {((input * (input + 1)) / 2).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className='bg-card border-border rounded-lg border p-6'>
        <h3 className='text-foreground mb-6 flex items-center gap-2 text-xl font-semibold'>
          <span>
            <CodeIcon className='size-3' />
          </span>
          <span>Code Implementations</span>
        </h3>

        <div className='space-y-6'>
          {implementations.map((impl, index) => (
            <div key={index} className='space-y-3'>
              <h4 className='text-foreground flex items-center gap-2 font-medium'>
                <span>{impl.icon}</span>
                Implementation {impl.label.toUpperCase()} - {impl.name}
              </h4>
              <div className='bg-background overflow-x-auto rounded-md p-4'>
                <pre className='text-foreground font-mono text-sm'>
                  <code>{getCodeExample(index)}</code>
                </pre>
              </div>
              <p className='text-muted-foreground text-sm'>
                <strong>Complexity:</strong> {impl.complexity}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
