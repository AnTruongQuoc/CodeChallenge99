export const formatDecimalInput = (value: string, decimal: number = 2): string => {
  // Replace commas with dot, and remove all but digits and dots
  value = value.replace(/,/g, '.').replace(/[^\d.]/g, '');

  if (value === '.') return '0.';

  const firstDotIndex = value.indexOf('.');
  if (firstDotIndex === -1) {
    const intPart = value.replace(/^0+(?=\d)/, ''); // Remove leading zeros
    // Enforce 12 digits max
    return intPart.slice(0, 12);
  }

  const intPart = value.slice(0, firstDotIndex).replace(/^0+(?=\d)/, '') || '0';
  let decimalPart = value.slice(firstDotIndex + 1).replace(/\./g, '');

  // Enforce total digits limit (int + decimal ≤ 12)
  const totalAllowed = 12 - intPart.length;
  if (totalAllowed <= 0) {
    return intPart.slice(0, 12); // Drop decimal completely if int already uses up all slots
  }

  // Limit to specified decimal places (default 2, but can be up to 9)
  decimalPart = decimalPart.slice(0, Math.min(decimal, 9));

  // Preserve trailing dot when user is typing
  if (value.endsWith('.') && decimalPart.length === 0) {
    return `${intPart}.`;
  }

  // Don't remove trailing zeros during input to allow proper decimal typing
  return `${intPart}.${decimalPart}`;
};

export const clampDecimal = (
  value: string,
  min: number,
  max: number,
  decimal: number = 2,
): string => {
  const num = parseFloat(value);
  if (isNaN(num)) return '';

  const clamped = Math.min(Math.max(num, min), max);

  const factor = Math.pow(10, decimal);
  const truncated = Math.trunc(clamped * factor) / factor;

  return truncated.toString();
};
