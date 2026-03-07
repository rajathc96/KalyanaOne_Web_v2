import { useEffect, useRef, useState } from "react";
import arrowDown from "../../assets/icons/arrowdown.svg";
import arrowUp from "../../assets/icons/arrowup.svg";
import checkcircle1 from "../../assets/icons/check_circle1.svg";

export default function FloatingMultipleQuerySelect({
  label,
  width,
  value = [],
  onChange,
  options = [],
  disabled = false,
  optionsLoading = false,
}) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const searchInputRef = useRef(null);
  const dropdownRef = useRef();

  const selectedValues = Array.isArray(value)
    ? value
    : value
      ? [value]
      : [];
  const hasValue = selectedValues.length > 0;

  const toggleOption = (opt) => {
    if (disabled) return;
    const updated = selectedValues.includes(opt)
      ? selectedValues.filter((item) => item !== opt)
      : [...selectedValues, opt];
    onChange?.(updated);
    setInputValue("");
    // Keep the search input focused after selecting an option for faster multi-select.
    requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });
  };

  const removeOption = (opt) => {
    if (disabled) return;
    onChange?.(selectedValues.filter((item) => item !== opt));
  };

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
  const filteredOptions = options.filter((opt) =>
    String(opt).toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div
      className={`floating-label-wrapper ${open || hasValue ? "focused" : ""} input-select`}
      style={{ width: width ? width : "auto", pointerEvents: disabled ? "none" : "auto" }}
      ref={dropdownRef}
    >
      <div
        className="floating-select"
        onClick={() => !disabled && setOpen((prev) => !prev)}
      >
        <div className="selected-tags">
          {hasValue ? (
            selectedValues.map((opt) => (
              <span className="tag" key={opt}>
                {opt}
                {!disabled && (
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeOption(opt);
                    }}
                  >
                    ×
                  </button>
                )}
              </span>
            ))
          ) : (
            <span className={`selected-value ${hasValue ? "selected" : ""}`}></span>
          )}
        </div>
        {!disabled && <img
          src={open ? arrowUp : arrowDown}
          alt="dropdown arrow"
        />}
      </div>

      <label className="floating-label">{label}</label>

      {open && (
        <div className="custom-options" onClick={(e) => e.stopPropagation()}>
          <div className="custom-option" style={{ cursor: "default" }}>
            <input
              type="text"
              placeholder="Search..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              ref={searchInputRef}
              autoFocus
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: "16px",
              }}
            />
          </div>
          {optionsLoading ? (
            <div className="custom-option disabled">Loading...</div>
          ) : filteredOptions.length === 0 ? (
            <div className="custom-option disabled">No options</div>
          ) : (
            filteredOptions.map((opt) => (
              <div
                key={opt}
                className={`custom-option ${selectedValues.includes(opt) ? "active" : ""}`}
                onClick={() => toggleOption(opt)}
              >
                {opt}
                {selectedValues.includes(opt) && (
                  <img
                    src={checkcircle1}
                    alt="selected"
                    width={18}
                    height={18}
                  />
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
