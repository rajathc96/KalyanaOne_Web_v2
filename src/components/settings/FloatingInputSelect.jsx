import { useEffect, useRef, useState } from "react";
import arrowDown from "../../assets/icons/arrowdown.svg";
import arrowUp from "../../assets/icons/arrowup.svg";

export default function FloatingInputSelect({
  label,
  width,
  value,
  onChange,
  options,
  disabled = false,
  optionsLoading = false,
  allowCustomInput = false,
}) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
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

  useEffect(() => {
    if (!open) setInputValue("");
  }, [open]);

  // Filter options based on inputValue
  const filteredOptions = options.filter(opt =>
    opt.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Check if inputValue is custom (doesn't match any option exactly)
  const isCustomInput = inputValue && !options.some(opt => opt.toLowerCase() === inputValue.toLowerCase());

  const handleCustomInput = () => {
    onChange(inputValue);
    setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue) {
      if (isCustomInput && allowCustomInput) {
        handleCustomInput();
      } else if (filteredOptions.length === 1) {
        onChange(filteredOptions[0]);
        setOpen(false);
      }
    }
  };

  return (
    <div
      className={`floating-label-wrapper ${open || value ? "focused" : ""} input-select`}
      style={{ width: width ? width : "auto", pointerEvents: disabled ? "none" : "auto" }}
      ref={dropdownRef}
    >
      <div className="floating-select" onClick={() => setOpen(!open)}>
        {open ? (
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            style={{ width: "100%", border: "none", outline: "none", background: "transparent", fontSize: "16px" }}
            onClick={e => e.stopPropagation()}
          />
        ) : (
          <span className={`selected-value ${value ? "selected" : ""}`}>
            {value || ""}
          </span>
        )}
        {!disabled && <img
          src={open ? arrowUp : arrowDown}
          alt="dropdown arrow"
        />}
      </div>

      <label className="floating-label">{label}</label>

      {open && (
        <div className="custom-options">
          {optionsLoading ? (
            <div className="custom-option disabled">Loading...</div>
          ) : allowCustomInput && isCustomInput ? (
            <>
              <div
                className="custom-option active"
                onClick={handleCustomInput}
              >
                Use "{inputValue}"
              </div>
              {filteredOptions.length > 0 && (
                <>
                  <div className="custom-option disabled" style={{ fontSize: "12px", paddingTop: "8px", paddingBottom: "0" }}>
                    or select below
                  </div>
                  {filteredOptions.map((opt) => (
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
                  ))}
                </>
              )}
            </>
          ) : filteredOptions.length === 0 ? (
            <div className="custom-option disabled">No options</div>
          ) : (
            filteredOptions.map((opt) => (
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
          )}
        </div>
      )}
    </div>
  );
}
