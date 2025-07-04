"use client";
import React from "react";
import Checkbox from "@/components/ui/Checkbox";
import "@/styles/minesGamePage/balanceLimits.css";

const BalanceLimitInput = ({
  id,
  label,
  value,
  enabled,
  onToggle,
  onChange,
}: {
  id: string;
  label: string;
  value: number | null;
  enabled: boolean;
  onToggle: (checked: boolean) => void;
  onChange: (value: number | null) => void;
}) => {
  return (
    <div
      className="balance-wrapper"
      style={{
        backgroundColor: enabled ? "#555961" : "#393b3f",
      }}
    >
      <Checkbox
        id={id}
        checked={enabled}
        onChange={(checked) => {
          onToggle(checked);
          if (!checked) onChange(null);
        }}
      />
      <label>{label}</label>
      <input
        type="number"
        disabled={!enabled}
        value={enabled && value !== null ? value : ""}
        onChange={(e) => {
          let val = e.target.value;
          if (val.length > 1 && val.startsWith("0") && !val.startsWith("0.")) {
            val = val.substring(1);
          }
          const numValue = parseFloat(val);
          onChange(isNaN(numValue) ? null : numValue);
        }}
        onKeyDown={(e) => {
          if (e.key === "0" && e.currentTarget.value === "") {
            e.preventDefault();
          }
        }}
        min={0}
        placeholder="0.00"
      />
    </div>
  );
};

export default BalanceLimitInput;
