"use client";
import React from "react";
import "@/styles/ui/checkBox.css";

export default function Checkbox({
  id,
  checked,
  onChange,
  onClick,
  disabled = false,
  className = "",
}: CheckboxProps) {
  return (
    <div
      className={`checkbox-apple ${className}`}
      onClick={(e) => {
        if (disabled) {
          e.stopPropagation();
          return;
        }
        onClick?.(e);
        e.stopPropagation();
      }}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="yep"
      />
      <label htmlFor={id}></label>
    </div>
  );
}
