
export const parseBetValue = (betValue: string | number): number => {
  return typeof betValue === "string" ? parseFloat(betValue || "0") : betValue;
};

export const sanitizeBetInput = (value: string): string => {
  if (/^0[0-9]+/.test(value)) {
    value = value.replace(/^0+/, "");
  }

  if (/^\d*\.?\d*$/.test(value)) {
    return value;
  }

  return "";
};

export const getNextBet = (
  betAmounts: number[],
  currentValue: number
): number | undefined => {
  const sorted = [...betAmounts].sort((a, b) => a - b);
  return sorted.find((val) => val > currentValue);
};

export const getPreviousBet = (
  betAmounts: number[],
  currentValue: number
): number | undefined => {
  const sorted = [...betAmounts].sort((a, b) => a - b).reverse();
  return sorted.find((val) => val < currentValue);
};

export const incrementBetValue = (
  betAmounts: number[],
  currentValue: number,
  setBetValue: (val: string) => void
) => {
  const next = getNextBet(betAmounts, currentValue);
  if (next !== undefined) setBetValue(next.toString());
};

export const decrementBetValue = (
  betAmounts: number[],
  currentValue: number,
  setBetValue: (val: string) => void
) => {
  const prev = getPreviousBet(betAmounts, currentValue);
  if (prev !== undefined) setBetValue(prev.toString());
};
