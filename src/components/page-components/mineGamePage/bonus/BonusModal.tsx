import { useGameStore } from "@/store/useGameStore";
import "@/styles/minesGamePage/bonusModal.css";

export const BonusModal = () => {
  const {
    showBonusModal,
    bonusOptions,
    bonusRevealedOptions,
    bonusUserChoice,
    resolveBonusRound,
    skipBonusRound,
  } = useGameStore();

  if (!showBonusModal) return null;

  const isRevealed = bonusRevealedOptions.length > 0;

  return (
    <div className="bonus-modal">
      <div className="modal-content">
        <h2>🎁 Bonus Round</h2>
        <p>Pick one box!</p>
        <div className="bonus-boxes">
          {bonusOptions?.map((option, idx) => (
            <button
              key={idx}
              className={`bonus-box ${
                isRevealed && bonusUserChoice === option ? "chosen" : ""
              }`}
              onClick={() => !isRevealed && resolveBonusRound(option)}
              disabled={isRevealed}
            >
              {isRevealed ? option : "❓"}
            </button>
          ))}
          {!isRevealed && (
            <button className="skip-button" onClick={skipBonusRound}>
              Skip Bonus
            </button>
          )}
        </div>

        {isRevealed && bonusUserChoice && (
          <div className="bonus-result-message">
            {bonusUserChoice === "💥" ? (
              <p className="bomb-message">💥 Game Over! You hit a bomb.</p>
            ) : (
              <p className="win-message">
                🎉 Congrats! Your cashout multiplier is {bonusUserChoice}.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
