import { useState } from "react";
import arrowDown from "../../../assets/icons/arrowdown.svg";
import FloatingInput from "../FloatingInput";
import FloatingSelect from "../FloatingSelect";
import FloatingTimeSelect from "../FloatingTimeSelect";
import { manglikstatus, nakshatras, rashis } from "../../../data/data";

function HoroscopeDetails({
  horoscopeDetails,
  setHoroscopeDetails,
  globalData,
  arrowUp,
  setIsChanged
}) {
  const [show, setShow] = useState(true);
  return (
    <div className="partner-preference-section">
      <p>
        Horoscope details{" "}
        <img
          onClick={() => setShow(!show)}
          src={show ? arrowUp : arrowDown}
          alt="dropdown arrow"
        />
      </p>
      {show && (
        <div className="input-group">
          <FloatingInput
            placeholder="Date of Birth (Cannot be changed)"
            value={
              globalData?.horoscopeDetails?.dateOfBirth
                .split("-")
                .reverse()
                .join("-") || ""
            }
            disabled={true}
          />
          <FloatingTimeSelect
            label="Birth Time"
            value={horoscopeDetails.timeOfBirth}
            onChange={(value) => {
              setHoroscopeDetails({ ...horoscopeDetails, timeOfBirth: value })
              setIsChanged(true);
            }}
          />
          <FloatingInput
            placeholder="Country of Birth"
            value={horoscopeDetails.countryOfBirth}
            onChange={(e) => {
              setHoroscopeDetails({
                ...horoscopeDetails,
                countryOfBirth: e.target.value,
              });
              setIsChanged(true);
            }}
          />
          <FloatingInput
            placeholder="State of Birth"
            value={horoscopeDetails.stateOfBirth}
            onChange={(e) => {
              setHoroscopeDetails({
                ...horoscopeDetails,
                stateOfBirth: e.target.value,
              });
              setIsChanged(true);
            }}
          />
          <FloatingInput
            placeholder="Place of Birth"
            value={horoscopeDetails.placeOfBirth}
            onChange={(e) => {
              setHoroscopeDetails({
                ...horoscopeDetails,
                placeOfBirth: e.target.value,
              });
              setIsChanged(true);
            }}
          />
          <FloatingSelect
            label="Nakshatra (Star)"
            value={horoscopeDetails.nakshatra}
            onChange={(value) => {
              setHoroscopeDetails({ ...horoscopeDetails, nakshatra: value });
              setIsChanged(true);
            }}
            options={nakshatras}
          />
          <FloatingSelect
            label="Rashi (Zodiac Sign)"
            value={horoscopeDetails.rashi}
            onChange={(value) => {
              setHoroscopeDetails({ ...horoscopeDetails, rashi: value });
              setIsChanged(true);
            }}
            options={rashis}
          />
          <FloatingInput
            placeholder="Bedagu"
            value={horoscopeDetails.bedagu}
            onChange={(e) => {
              setHoroscopeDetails({
                ...horoscopeDetails,
                bedagu: e.target.value,
              });
              setIsChanged(true);
            }}
          />
          <FloatingSelect
            label="Kuja Dosha (Manglik Status)"
            value={horoscopeDetails.manglikStatus}
            onChange={(value) => {
              setHoroscopeDetails({ ...horoscopeDetails, manglikStatus: value });
              setIsChanged(true);
            }}
            options={manglikstatus}
          />
          <FloatingInput
            placeholder="Gothra"
            value={horoscopeDetails.gothra}
            onChange={(e) => {
              setHoroscopeDetails({
                ...horoscopeDetails,
                gothra: e.target.value,
              });
              setIsChanged(true);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default HoroscopeDetails;
