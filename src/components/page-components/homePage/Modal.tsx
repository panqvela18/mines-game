import React from "react";

export const Modal = ({
  handleAgeRespones,
}: {
  handleAgeRespones: (is18: boolean) => void;
}) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <p className="responsible-gaming">Responsible Gaming</p>
        <p className="age-verification-text">
          Please confirm that you are of legal age before playing our games in
          your country.
        </p>
        <div className="modal-buttons">
          <button
            className="modal-confirm-btn"
            onClick={() => handleAgeRespones(true)}
          >
            Yes i'm over 18
          </button>
          <button
            className="modal-cancel-btn"
            onClick={() => handleAgeRespones(false)}
          >
            No, i'm under 18
          </button>
        </div>
      </div>
    </div>
  );
};
