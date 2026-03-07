import { useEffect, useRef, useState } from "react";
import arrowDown from "../../assets/icons/arrowdown.svg";
import arrowUp from "../../assets/icons/arrowup.svg";
import checkcircle1 from "../../assets/icons/check_circle1.svg";
import "./FloatingSelect.css";

export default function FloatingMultipleSelect({
  placeholder,
  width,
  value = [],
  onChange,
  disabled = false,
  onDisabledClick,
  options = [],
  loading = false,
  allowCustomInput = false,
}) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [limitMessage, setLimitMessage] = useState("");
  const dropdownRef = useRef();

  const ANY_OPTION = "Any";

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
    if (!open) {
      setInputValue("");
      setLimitMessage("");
    }
  }, [open]);

  // Filter options based on inputValue
  const filteredOptions = options.filter(opt =>
    opt.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Check if inputValue is custom (doesn't match any option exactly)
  const isCustomInput = inputValue && !options.some(opt => opt.toLowerCase() === inputValue.toLowerCase()) && !value.includes(inputValue);

  const handleCustomInput = () => {
    if (disabled) return;
    if (inputValue === ANY_OPTION) {
      onChange([]);
      setInputValue("");
      setLimitMessage("");
      return;
    }
    if (value.length >= 10) {
      setLimitMessage("You can select up to 10 items.");
      return;
    }
    onChange([...value, inputValue]);
    setInputValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue) {
      if (isCustomInput && allowCustomInput) {
        handleCustomInput();
      } else if (filteredOptions.length === 1 && !value.includes(filteredOptions[0])) {
        toggleOption(filteredOptions[0]);
      }
    }
  };

  const toggleOption = (option) => {
    if (disabled) return;
    if (option === ANY_OPTION) {
      onChange([]);
      setOpen(false);
      setInputValue("");
      setLimitMessage("");
      return;
    }
    const withoutAny = value.filter((v) => v !== ANY_OPTION);
    if (!withoutAny.includes(option) && withoutAny.length >= 10) {
      setLimitMessage("You can select up to 10 items.");
      return;
    }
    const updated = withoutAny.includes(option)
      ? withoutAny.filter((v) => v !== option)
      : [...withoutAny, option];
    onChange(updated);
  };

  const removeOption = (option) => {
    onChange(value.filter((v) => v !== option));
  };

  useEffect(() => {
    if (value.length < 10 && limitMessage) {
      setLimitMessage("");
    }
  }, [value, limitMessage]);

  const isFloating = open || value.length > 0;

  return (
    <div
      className={`floating-label-wrapper ${isFloating ? "focused" : ""}`}
      style={{ ...(width ? { width } : {}) }}
      ref={dropdownRef}
    >
      <div
        className="floating-select"
        onClick={() => {
          if (disabled) {
            onDisabledClick?.();
            return;
          }
          setOpen(!open);
        }}
      >
        {
          !Array.isArray(value) ?
            <span className={`selected-value ${value ? "selected" : ""}`}>
              {value || ""}
            </span>
            :
            <div onClick={() => disabled ? {} : setOpen(!open)}>
              <div className="selected-tags">
                {value.map((tag) => (
                  <span className="tag" key={tag}>
                    {tag}
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeOption(tag);
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
                {open && (
                  <input
                    disabled={disabled}
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    style={{ border: "none", outline: "none", background: "transparent", fontSize: "16px", height: "24px" }}
                    onClick={e => e.stopPropagation()}
                  />
                )}
              </div>
            </div>
        }
        <img src={open ? arrowUp : arrowDown} alt="dropdown arrow" />
      </div>

      {limitMessage && (
        <div
          className="limit-message"
          style={{ color: "#d9534f", fontSize: "12px", marginTop: "6px" }}
        >
          {limitMessage}
        </div>
      )}

      <label className="floating-label">{placeholder}</label>

      {open && (
        <div className="dropdown-options">
          {loading ? (
            <div className="dropdown-option disabled" style={{ textAlign: "center" }}>
              Loading...
            </div>
          ) : allowCustomInput && isCustomInput ? (
            <>
              <div
                className="dropdown-option selected"
                onClick={handleCustomInput}
              >
                Add "{inputValue}"
              </div>
              {filteredOptions.length > 0 && (
                <>
                  <div className="dropdown-option disabled" style={{ fontSize: "12px", paddingTop: "8px", paddingBottom: "0" }}>
                    or select below
                  </div>
                  {filteredOptions.map((opt) => (
                    <div
                      key={opt}
                      className={`dropdown-option ${value.includes(opt) ? "selected" : ""}`}
                      onClick={() => toggleOption(opt)}
                    >
                      {opt}
                      {value.includes(opt) && (
                        <img
                          src={checkcircle1}
                          alt="selected"
                          width={18}
                          height={18}
                        />
                      )}
                    </div>
                  ))}
                </>
              )}
            </>
          ) : filteredOptions.length === 0 ? (
            <div className="dropdown-option disabled">No options</div>
          ) : (
            filteredOptions.map((opt) => (
              <div
                key={opt}
                className={`dropdown-option ${value.includes(opt) ? "selected" : ""}`}
                onClick={() => toggleOption(opt)}
              >
                {opt}
                {value.includes(opt) && (
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
