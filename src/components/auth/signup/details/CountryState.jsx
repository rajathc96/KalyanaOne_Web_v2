import { Country, State } from "country-state-city";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API_URL from "../../../../../config";
import { clientAuth } from "../../../../../firebase";
import UpdateLoader from "../../../../models/UpdateLoader/UpdateLoader";
import FloatingInputSelect from "../../../settings/FloatingInputSelect";
import "./Details.css";
import YesNoModal from "../../../../models/YesNoModal/YesNoModal";

const CountryState = ({
  onNext,
  selectedCountry,
  setSelectedCountry,
  selectedState,
  setSelectedState,
  viewportHeight
}) => {

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  // const [selectedCountry, setSelectedCountry] = useState("");
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const allCountries = Country.getAllCountries();
    const mapped = allCountries.map(country => ({
      name: country.name,
      isoCode: country.isoCode
    }));

    // Preferred ordering: India, United States, United Kingdom, Australia
    const preferredOrder = [
      { code: 'IN', names: ['India'] },
      { code: 'US', names: ['United States', 'United States of America', 'USA'] },
      { code: 'GB', names: ['United Kingdom', 'UK'] },
      { code: 'AU', names: ['Australia'] }
    ];

    const placed = [];
    const usedIso = new Set();
    for (const pref of preferredOrder) {
      const idx = mapped.findIndex(c => (c.isoCode && c.isoCode.toUpperCase() === pref.code) || pref.names.includes(c.name));
      if (idx > -1) {
        placed.push(mapped[idx]);
        if (mapped[idx].isoCode) usedIso.add(mapped[idx].isoCode);
      }
    }

    const remaining = mapped.filter(c => !usedIso.has(c.isoCode));
    const ordered = [...placed, ...remaining];

    setCountries(ordered);

    // If no country is selected yet, default to India when available
    if (!selectedCountry && placed.length > 0) {
      const india = placed[0];
      try { setSelectedCountry && setSelectedCountry(india); } catch (e) { }
    }
  }, []);

  useEffect(() => {
    const allStates = State.getStatesOfCountry(selectedCountry?.isoCode);
    if (!allStates) return;
    setStates(allStates.map(state => ({
      name: state.name,
      isoCode: state.isoCode,
      countryCode: state.countryCode
    })));
  }, [selectedCountry]);

  const [isLoading, setIsLoading] = useState(false);

  const handleCountryStateSelection = async () => {
    if (!selectedCountry) {
      setErrorMessage("Please select a country");
      setIsErrorPopupVisible(true);
      return;
    }

    if (!selectedState) {
      setErrorMessage("Please select a state");
      setIsErrorPopupVisible(true);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/country-state`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await clientAuth?.currentUser?.getIdToken()}`,
        },
        body: JSON.stringify({ country: selectedCountry.name, state: selectedState.name }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Something went wrong. Please try again.");
        setIsErrorPopupVisible(true);
        return;
      }

      onNext();
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      setIsErrorPopupVisible(true);
    }
    finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className="inside-detail-container"
      style={{ height: viewportHeight - 160 }}>
      <div className="inside-detail-subcontainer">

        <div className="inside-detail-input">
          <FloatingInputSelect
            label="Select your Country"
            width="300px"
            value={selectedCountry?.name || ""}
            onChange={(val) => {
              const country = countries.find(c => c.name === val);
              setSelectedCountry(country);
            }}
            options={countries.map(c => c.name)}
          />

          {selectedCountry && (
            <FloatingInputSelect
              label="Select your State"
              width="300px"
              value={selectedState?.name || ""}
              onChange={(val) => {
                const state = states.find(s => s.name === val);
                setSelectedState(state);
              }}
              options={states.map(s => s.name)}
            />
          )}
        </div>
      </div >

      <button
        className="get-started-btn"
        disabled={isLoading}
        onClick={handleCountryStateSelection}
      >
        {isLoading ?
          <UpdateLoader color="#fff" />
          :
          "Continue"
        }
      </button>
      <YesNoModal
        show={isErrorPopupVisible}
        onClose={() => setIsErrorPopupVisible(false)}
        heading="Error"
        data={errorMessage}
        buttonText="Ok"
        
      />
    </div>
  );
};

export default CountryState;
