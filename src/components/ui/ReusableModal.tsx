import React from "react";
import "@/styles/ui/reusableModal.css";

type ReusableModalProps = {
  title: string;
  toggle: () => void;
  children: React.ReactNode;
};

export const ReusableModal = ({
  title,
  toggle,
  children,
}: ReusableModalProps) => {
  return (
    <div className="how-to-play-modal-backdrop" onClick={toggle}>
      <div className="how-to-play-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal-btn" onClick={toggle}>
          ×
        </button>
        <h2>{title}</h2>
        <div className="line" />
        <div className="instuction-container">{children}</div>
      </div>
    </div>
  );
};
