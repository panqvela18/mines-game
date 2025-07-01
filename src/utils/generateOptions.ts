export function generateBonusOptions(): BonusOption[] {
  const weightedOptions: { value: BonusOption; weight: number }[] = [
    { value: "💥", weight: 30 },
    { value: "2x", weight: 25 },
    { value: "3x", weight: 15 },
    { value: "5x", weight: 10 },
    { value: "10x", weight: 7 },
    { value: "20x", weight: 5 },
    { value: "50x", weight: 2 },
    { value: "100x", weight: 1 },
  ];

  const options: BonusOption[] = [];
  const availableOptions = [...weightedOptions];

  while (options.length < 3 && availableOptions.length > 0) {
    const totalWeight = availableOptions.reduce((sum, o) => sum + o.weight, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < availableOptions.length; i++) {
      const option = availableOptions[i];
      if (random < option.weight) {
        options.push(option.value);
        availableOptions.splice(i, 1); 
        break;
      }
      random -= option.weight;
    }
  }

  return options;
}
