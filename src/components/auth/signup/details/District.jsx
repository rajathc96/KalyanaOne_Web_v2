import { City } from "country-state-city";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API_URL from "../../../../../config";
import { clientAuth } from "../../../../../firebase";
import UpdateLoader from "../../../../models/UpdateLoader/UpdateLoader";
import FloatingInput from "../../../settings/FloatingInput";
import FloatingInputSelect from "../../../settings/FloatingInputSelect";
import "./Details.css";
import YesNoModal from "../../../../models/YesNoModal/YesNoModal";

const District = ({ onNext, selectedState, viewportHeight }) => {

  const [cities, setCities] = useState([]);
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!selectedState) {
      setCities([]);
      return;
    }

    const allCities = City.getCitiesOfState(selectedState?.countryCode || "IN", selectedState?.isoCode || "");
    let mapped = (allCities || []).map(city => city.name);

    // If selected state is Karnataka, prioritize a few common districts/cities
    const isKarnataka = (selectedState?.isoCode && selectedState.isoCode.toUpperCase() === 'KA') ||
      (selectedState?.name && selectedState.name.toLowerCase().includes('karnataka'));

    if (isKarnataka && mapped.length > 0) {
      const preferredGroups = [
        ['Bengaluru', 'Bangalore'],
        ['Mysuru', 'Mysore'],
        ['Shivamogga', 'Shimoga'],
        ['Davanagere']
      ];

      const placed = [];
      const used = new Set();
      for (const names of preferredGroups) {
        const idx = mapped.findIndex(m => names.some(n => m.toLowerCase() === n.toLowerCase()));
        if (idx > -1) {
          placed.push(mapped[idx]);
          used.add(mapped[idx]);
        }
      }

      const remaining = mapped.filter(m => !used.has(m));
      mapped = [...placed, ...remaining];
    }

    setCities(mapped);
  }, [selectedState]);

  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [nativePlace, setNativePlace] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleDistrictSelection = async () => {
    if (!selectedDistrict) {
      setErrorMessage("Please select a district");
      setIsErrorPopupVisible(true);
      return;
    }

    if (!nativePlace) {
      setErrorMessage("Please enter your native place");
      setIsErrorPopupVisible(true);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/district`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await clientAuth?.currentUser?.getIdToken()}`,
        },
        body: JSON.stringify({ district: selectedDistrict, nativePlace: nativePlace }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data?.error || "Something went wrong. Please try again.");
        setIsErrorPopupVisible(true);
        return;
      }

      onNext();
    }
    catch (error) {
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
      style={{ height: viewportHeight - 170 }}>
      <div className="inside-detail-subcontainer">

        <div className="inside-detail-input">

          <FloatingInputSelect
            label="Select your City"
            width="300px"
            value={selectedDistrict || ""}
            onChange={(val) => setSelectedDistrict(val)}
            options={cities || []}
          />

          {/* Native input */}
          {selectedDistrict && (
            <FloatingInput
              placeholder={`Enter your native place in ${selectedDistrict || "district"}`}
              value={nativePlace}
              onChange={(e) => setNativePlace(e.target.value)}
            />
          )}
        </div>
      </div>

      <button
        className="get-started-btn"
        disabled={isLoading}
        onClick={handleDistrictSelection}
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
        data={errorMessage}
        buttonText="Ok"
        
      />
    </div>
  );
};

export default District;
