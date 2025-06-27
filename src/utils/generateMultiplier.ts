export function getMultiplierIncrease(minesCount: number): number {
  const minInc = 0.05; 
  const maxInc = 1;  
  const norm = minesCount / 24; 
  return minInc + (maxInc - minInc) * norm;
}

export function getInitialMultiplier(minesCount: number): number {
  const minMultiplier = 1.02;
  const maxMultiplier = 5.0;

  const norm = Math.min(minesCount, 24) / 24;

  return parseFloat(
    (minMultiplier + (maxMultiplier - minMultiplier) * norm).toFixed(2)
  );
}
