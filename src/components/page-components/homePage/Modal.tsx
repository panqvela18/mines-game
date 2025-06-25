import React from "react";

export const Modal = ({
  handleAgeRespones,
}: {
  handleAgeRespones: (is18: boolean) => void;
}) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <p>Are you 18 years or older?</p>
        <div className="modal-buttons">
          <button onClick={() => handleAgeRespones(true)}>Yes</button>
          <button onClick={() => handleAgeRespones(false)}>No</button>
        </div>
      </div>
    </div>
  );
};
