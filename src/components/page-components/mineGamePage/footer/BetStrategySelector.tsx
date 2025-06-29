import React from "react";

const BetStrategySelector = ({
  title,
  strategy,
  percentage,
  onStrategyChange,
  onPercentageChange,
}: BetStrategySelectorProps) => (
  <div className="bet-strategy-container">
    <h4 className="round-title">{title}</h4>
    <div className="bet-strategy-buttons">
      <button
        className={strategy === "same" ? "active" : ""}
        onClick={() => onStrategyChange("same")}
      >
        Keep same
      </button>
      <div className="bet-btns">
        <button
          className={strategy === "increase" ? "active" : ""}
          onClick={() => onStrategyChange("increase")}
        >
          Increase by %
        </button>
        <button
          className={strategy === "decrease" ? "active" : ""}
          onClick={() => onStrategyChange("decrease")}
        >
          Decrease by %
        </button>
      </div>
    </div>
    {strategy !== "same" && (
      <input
        type="number"
        min={1}
        max={100}
        value={percentage}
        onChange={(e) => onPercentageChange(Number(e.target.value))}
        className="percentage-input"
        placeholder="0%"
      />
    )}
  </div>
);

export default BetStrategySelector;
