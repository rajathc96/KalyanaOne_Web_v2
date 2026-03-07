import { useEffect, useRef, useState } from "react";
import arrowDown from "../../assets/icons/arrowdown.svg";
import arrowUp from "../../assets/icons/arrowup.svg";
import "./FloatingSelect.css";

export default function FloatingSelect({
  label,
  width,
  value,
  onChange,
  options,
  disabled = false,
  loading = false,
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`floating-label-wrapper ${open || value ? "focused" : ""}`}
      style={{ width: width ? width : "auto", pointerEvents: disabled ? "none" : "auto" }}
      ref={dropdownRef}
    >
      <div className="floating-select" onClick={() => setOpen(!open)}>
        <span className={`selected-value ${value ? "selected" : ""}`}>
          {value || ""}
        </span>
        {!disabled && <img
          src={open ? arrowUp : arrowDown}
          alt="dropdown arrow"
          style={{  }}
        />}
      </div>

      <label className="floating-label">{label}</label>

      {open && (
        <div className="custom-options">
          {loading ? (
            <div className="custom-option loading">Loading...</div>
          ) : options.length > 0 ? (
            options.map((opt) => (
              <div
                key={opt}
                className={`custom-option ${value === opt ? "active" : ""}`}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
              >
                {opt}
              </div>
            ))
          ) : (
            <div className="custom-option no-options">No options</div>
          )}
        </div>
      )}
    </div>
  );
}
