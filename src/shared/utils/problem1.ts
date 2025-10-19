/**
 * Implementation A: Iterative Approach
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 *
 * We use a simple for loop to iterate through all numbers from 1 to n,
 * accumulating the sum.
 */
export const sum_to_n_a = (n: number): number => {
  if (n < 0) throw new Error('Input must be a non-negative integer');
  if (!Number.isInteger(n)) throw new Error('Input must be an integer');

  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};

/**
 * Implementation B: Mathematical Formula (Gauss's Formula)
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 *
 * We use the mathematical formula to sum:
 * sum = n * (n + 1) / 2
 */
export const sum_to_n_b = (n: number): number => {
  if (n < 0) throw new Error('Input must be a non-negative integer');
  if (!Number.isInteger(n)) throw new Error('Input must be an integer');

  return (n * (n + 1)) / 2;
};

/**
 * Implementation C: Recursive Approach
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 *
 * On this approac we use recursion to calculate the sum.
 * Note: This approach has higher space complexity due to the call stack.
 */
export const sum_to_n_c = function (n: number): number {
  if (n < 0) throw new Error('Input must be a non-negative integer');
  if (!Number.isInteger(n)) throw new Error('Input must be an integer');

  // Base case
  if (n === 0) return 0;

  // Recursive case
  return n + sum_to_n_c(n - 1);
};

/**
 * Test Function
 */
export const testSummationFunctions = (n: number) => {
  const results = {
    iterative: sum_to_n_a(n),
    mathematical: sum_to_n_b(n),
    recursive: sum_to_n_c(n),
  };

  const values = Object.values(results);
  const allEqual = values.every(val => val === values[0]);

  return {
    results,
    allEqual,
    expected: (n * (n + 1)) / 2,
  };
};

export const getCodeExample = (index: number): string => {
  const examples = [
    `// Iterative Approach
  var sum_to_n_a = function(n) {
      if (n < 0) throw new Error('Input must be non-negative');
      if (!Number.isInteger(n)) throw new Error('Input must be integer');
      
      let sum = 0;
      for (let i = 1; i <= n; i++) {
          sum += i;
      }
      return sum;
  };`,

    `// Mathematical Formula (Gauss's Formula)
  var sum_to_n_b = function(n) {
      if (n < 0) throw new Error('Input must be non-negative');
      if (!Number.isInteger(n)) throw new Error('Input must be integer');
      
      return (n * (n + 1)) / 2;
  };`,

    `// Recursive Approach
  var sum_to_n_c = function(n) {
      if (n < 0) throw new Error('Input must be non-negative');
      if (!Number.isInteger(n)) throw new Error('Input must be integer');
      
      // Base case
      if (n === 0) return 0;
      
      // Recursive case
      return n + sum_to_n_c(n - 1);
  };`,
  ];

  return examples[index];
};
