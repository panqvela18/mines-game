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
  const [minBalance, setMinBalance] = useState<number>(0);
  const [maxBalance, setMaxBalance] = useState<number>(Infinity);
  const [isMinBalanceEnabled, setIsMinBalanceEnabled] = useState(false);
  const [isMaxBalanceEnabled, setIsMaxBalanceEnabled] = useState(false);
  const [betStrategy, setBetStrategy] = useState<
    "same" | "increase" | "decrease"
  >("same");
  const [loseChangePercent, setLoseChangePercent] = useState<number>(10);
  const [winChangePercent, setWinChangePercent] = useState<number>(10);
  const [showMoreOptions, setShowMoreOptions] = useState<boolean>(false);

  const [winStrategy, setWinStrategy] = useState<
    "same" | "increase" | "decrease"
  >("same");

  const toggleMoreOptions = () => {
    setShowMoreOptions((prev) => !prev);
  };
  useEffect(() => {
    setAutoPlayLoseStrategy({
      type: betStrategy,
      percentage: loseChangePercent,
    });
    setAutoPlayWinStrategy({
      type: winStrategy,
      percentage: winChangePercent,
    });
  }, [betStrategy, loseChangePercent, winStrategy, winChangePercent]);

  const {
    setAutoPlayRounds,
    setBoxesToReveal,
    startAutoPlay,
    minesCount,
    setAutoPlayBalanceLimits,
    setInitialAutoPlayBalance,
    setAutoPlayStopAmount,
    setAutoPlayLoseStrategy,
    setAutoPlayWinStrategy,
    user,
  } = useGameStore();

  const handleAutoPlayStart = () => {
    setBoxesToReveal(randomCell);
    setAutoPlayRounds(rounds);

    setInitialAutoPlayBalance(user.getBalance());
    setAutoPlayStopAmount(
      isMaxBalanceEnabled ? maxBalance : Infinity,
      isMinBalanceEnabled ? minBalance : 0
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
        <div
          style={{
            width: "100%",
            height: "1px",
            backgroundColor: "var(--text-gray)",
            opacity: "0.3",
          }}
        ></div>
        <div>
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
    </div>
  );
};
