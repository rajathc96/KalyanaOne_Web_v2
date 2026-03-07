import React from "react";
import "./Switch.css";

export function Switch({ checked, onChange, disabled, id, className }) {
  return (
    <label className={`switch ${className || ""}`} htmlFor={id}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <span className="slider" />
    </label>
  );
}
