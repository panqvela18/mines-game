"use client";
import { minesAmount, numberOfRounds } from "@/utils/constants";
import React, { useEffect, useState } from "react";
import "@/styles/minesGamePage/autoPlayModal.css";
import { useGameStore } from "@/store/useGameStore";
import Grid from "./Grid";
import BalanceLimitInput from "./BalanceLimitInput";
import BetStrategySelector from "./BetStrategySelector";

export const AutoPlayModal = ({
  toggleAutoPlayOptions,
}: {
  toggleAutoPlayOptions: () => void;
}) => {
  const [rounds, setRounds] = useState<number>(3);
  const [randomCell, setRandomCell] = useState<number>(1);
  const [minBalance, setMinBalance] = useState<number | null>(null);
  const [maxBalance, setMaxBalance] = useState<number | null>(null);
  const [singleWinLimit, setSingleWinLimit] = useState<number | null>(null);

  const [isMinBalanceEnabled, setIsMinBalanceEnabled] = useState(false);
  const [isMaxBalanceEnabled, setIsMaxBalanceEnabled] = useState(false);
  const [isSingleWinLimitEnabled, setIsSingleWinLimitEnabled] = useState(false);

  const [betStrategy, setBetStrategy] = useState<
    "same" | "increase" | "decrease"
  >("same");
  const [loseChangePercent, setLoseChangePercent] = useState<number>(10);
  const [winChangePercent, setWinChangePercent] = useState<number>(10);
  const [winStrategy, setWinStrategy] = useState<
    "same" | "increase" | "decrease"
  >("same");

  const [showMoreOptions, setShowMoreOptions] = useState<boolean>(false);
  const toggleMoreOptions = () => setShowMoreOptions((prev) => !prev);

  const {
    setAutoPlayRounds,
    setBoxesToReveal,
    startAutoPlay,
    minesCount,
    setAutoPlaySingleWinLimit,
    setAutoPlayStopAmount,
    setInitialAutoPlayBalance,
    setAutoPlayLoseStrategy,
    setAutoPlayWinStrategy,
    user,
  } = useGameStore();

  useEffect(() => {
    setAutoPlayLoseStrategy({
      type: betStrategy,
      percentage: loseChangePercent,
    });
    setAutoPlayWinStrategy({ type: winStrategy, percentage: winChangePercent });
  }, [betStrategy, loseChangePercent, winStrategy, winChangePercent]);

  const handleAutoPlayStart = () => {
    setBoxesToReveal(randomCell);
    setAutoPlayRounds(rounds);

    setAutoPlaySingleWinLimit(isSingleWinLimitEnabled ? singleWinLimit : null);
    setInitialAutoPlayBalance(user.getBalance());
    setAutoPlayStopAmount(
      isMaxBalanceEnabled ? maxBalance : null,
      isMinBalanceEnabled ? minBalance : null
    );

    startAutoPlay();
  };

  return (
    <div className="how-to-play-modal-backdrop" onClick={toggleAutoPlayOptions}>
      <div className="autoplay-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal-btn" onClick={toggleAutoPlayOptions}>
          ×
        </button>
        <h2>AUTO PLAY</h2>
        <div className="divider" />

        <Grid
          title="Number of rounds"
          items={numberOfRounds}
          selectedItem={rounds}
          onItemClick={setRounds}
          className="rounds-grid-container"
        />
        <Grid
          title="Number of randoms"
          items={minesAmount}
          maxCount={25 - minesCount}
          selectedItem={randomCell}
          onItemClick={setRandomCell}
          className="random-grid-container"
        />

        <div className="balance-limits-container">
          <h4 className="round-title">Balance limitations</h4>
          <BalanceLimitInput
            id="min-balance-checkbox"
            label="Stop if cash decreases by"
            value={minBalance}
            enabled={isMinBalanceEnabled}
            onToggle={setIsMinBalanceEnabled}
            onChange={setMinBalance}
          />
          <BalanceLimitInput
            id="max-balance-checkbox"
            label="Stop if cash increases by"
            value={maxBalance}
            enabled={isMaxBalanceEnabled}
            onToggle={setIsMaxBalanceEnabled}
            onChange={setMaxBalance}
          />
          <BalanceLimitInput
            id="single-win-limit-checkbox"
            label="Stop if single win reaches"
            value={singleWinLimit}
            enabled={isSingleWinLimitEnabled}
            onToggle={setIsSingleWinLimitEnabled}
            onChange={setSingleWinLimit}
          />
        </div>

        <button onClick={toggleMoreOptions} className="more-option-btn">
          More options
        </button>

        {showMoreOptions && (
          <>
            <BetStrategySelector
              title="Bet strategy after loss"
              strategy={betStrategy}
              percentage={loseChangePercent}
              onStrategyChange={setBetStrategy}
              onPercentageChange={setLoseChangePercent}
            />
            <BetStrategySelector
              title="Bet strategy after win"
              strategy={winStrategy}
              percentage={winChangePercent}
              onStrategyChange={setWinStrategy}
              onPercentageChange={setWinChangePercent}
            />
          </>
        )}

        <button
          onClick={() => {
            handleAutoPlayStart();
            toggleAutoPlayOptions();
          }}
          className="autoplay-inner-btn"
        >
          START AUTO
        </button>
      </div>
    </div>
  );
};
