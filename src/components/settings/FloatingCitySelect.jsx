import { City, Country } from 'country-state-city';
import { useEffect, useMemo, useRef, useState } from "react";
import arrowDown from "../../assets/icons/arrowdown.svg";
import arrowUp from "../../assets/icons/arrowup.svg";

export default function FloatingCitySelect({
  label,
  width,
  value,
  onChange,
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const countrySearchInputRef = useRef(null);
  const citySearchInputRef = useRef(null);
  const dropdownRef = useRef();
  const [visibleCountryOptions, setVisibleCountryOptions] = useState([]);
  const [visibleCityOptions, setVisibleCityOptions] = useState([]);
  const [allCountries, setAllCountries] = useState([]);
  const [allCities, setAllCities] = useState([]);

  const [isCountryOpen, setIsCountryOpen] = useState(true);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const filteredCountryOptions = useMemo(() => {
    return allCountries.filter((opt) =>
      String(opt.name).toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [allCountries, inputValue]);

  const filteredCityOptions = useMemo(() => {
    return allCities.filter((opt) =>
      String(opt).toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [allCities, inputValue]);

  useEffect(() => {
    const countries = Country.getAllCountries();
    const priorityCountries = ['India', 'United States', 'United Kingdom', 'Australia', 'Singapore'];
    
    const priority = countries.filter(c => priorityCountries.includes(c.name));
    const rest = countries.filter(c => !priorityCountries.includes(c.name));
    
    // Sort priority countries by their order in priorityCountries array
    priority.sort((a, b) => priorityCountries.indexOf(a.name) - priorityCountries.indexOf(b.name));
    
    setAllCountries([...priority, ...rest]);
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const cities = City.getCitiesOfCountry(selectedCountry.isoCode).map(city => (city.name || "").trim()).filter(Boolean);
      setAllCities(cities);
    } else {
      setAllCities([]);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (!open) {
      setVisibleCountryOptions([]);
      return;
    }

    let index = 0;
    const BATCH_SIZE = 30;
    let rafId;

    // reset ONCE
    setVisibleCountryOptions([]);

    const loadBatch = () => {
      setVisibleCountryOptions((prev) => {
        const next = filteredCountryOptions.slice(index, index + BATCH_SIZE);
        index += BATCH_SIZE;
        return [...prev, ...next];
      });

      if (index < filteredCountryOptions.length) {
        rafId = requestAnimationFrame(loadBatch);
      }
    };

    rafId = requestAnimationFrame(loadBatch);

    return () => cancelAnimationFrame(rafId);
  }, [open, filteredCountryOptions]);


  useEffect(() => {
    if (!open) {
      setVisibleCityOptions([]);
      return;
    }

    let index = 0;
    const BATCH_SIZE = 30;
    let rafId;

    // reset ONCE
    setVisibleCityOptions([]);

    const loadBatch = () => {
      setVisibleCityOptions((prev) => {
        const next = filteredCityOptions.slice(index, index + BATCH_SIZE);
        index += BATCH_SIZE;
        return [...prev, ...next];
      });

      if (index < filteredCityOptions.length) {
        rafId = requestAnimationFrame(loadBatch);
      }
    };

    rafId = requestAnimationFrame(loadBatch);

    return () => cancelAnimationFrame(rafId);
  }, [open, filteredCityOptions]);


  useEffect(() => {
    if (!open) setInputValue("");
    if (!open) setSelectedCountry(null);
    if (!open) {
      setIsCountryOpen(true);
      setIsCityOpen(false);
    }
  }, [open]);

  const selectedValues = Array.isArray(value)
    ? value
    : value
      ? [value]
      : [];
  const hasValue = selectedValues.length > 0;

  const toggleOption = (opt) => {
    if (disabled) return;

    onChange?.(opt);
    setInputValue("");
    setOpen(false);

    requestAnimationFrame(() => {
      citySearchInputRef.current?.focus();
    });
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

  return (
    <div
      className={`floating-label-wrapper ${open || hasValue ? "focused" : ""} input-select`}
      style={{ width: width ? width : "auto", pointerEvents: disabled ? "none" : "auto" }}
      ref={dropdownRef}
    >
      <div className="floating-select"
        onClick={() => !disabled && setOpen((prev) => !prev)}
      >
        {open ? (
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            // onKeyDown={handleKeyDown}
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

      {open &&
        isCountryOpen ? (
        <div className="custom-options" onClick={(e) => e.stopPropagation()}>
          <div className="custom-option" style={{ cursor: "default" }}>
            <input
              type="text"
              placeholder="Search country..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              ref={countrySearchInputRef}
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
          {filteredCountryOptions.length === 0 ? (
            <div className="custom-option disabled">No options</div>
          ) : (
            visibleCountryOptions.map((opt, idx) => (
              <div
                key={idx}
                className={`custom-option`}
                onClick={() => {
                  setSelectedCountry(opt);
                  setIsCountryOpen(false);
                  setIsCityOpen(true);
                  setInputValue("");
                }}
              >
                {opt.name}
              </div>
            ))
          )}
        </div>
      ) : isCityOpen && (
        <div className="custom-options" onClick={(e) => e.stopPropagation()}>
          <div className="custom-option" style={{ cursor: "default" }}>
            <input
              type="text"
              placeholder="Search city..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              ref={citySearchInputRef}
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
          {filteredCityOptions.length === 0 ? (
            <div className="custom-option disabled">No options</div>
          ) : (
            visibleCityOptions.map((opt, idx) => (
              <div
                key={idx}
                className={`custom-option ${value === opt ? "active" : ""}`}
                onClick={() => toggleOption(opt)}
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
