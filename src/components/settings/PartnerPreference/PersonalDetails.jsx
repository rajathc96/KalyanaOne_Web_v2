import { useState } from "react";
import arrowDown from "../../../assets/icons/arrowdown.svg";
import FloatingSelect from "../FloatingSelect";
import { drinkinghabits, foodhabits, physicalstatus, smokinghabits, weights } from "../../../data/searchFilters";

function PersonalDetails({ personalDetails, setPersonalDetails, arrowUp, setIsChanged }) {
  
  const [show, setShow] = useState(true);
  return (
    <div className="partner-preference-section">
      <p>
        Personal details{" "}
        <img
          onClick={() => setShow(!show)}
          src={show ? arrowUp : arrowDown}
          alt="dropdown arrow"
        />
      </p>
      {show && (
        <div className="input-group">
          <div className="filter-section" style={{ margin: 0 }}>
            <div className="filter-row">
              <FloatingSelect
                label="Weight From"
                value={personalDetails.weightFrom}
                onChange={(value) => {
                  setPersonalDetails({ ...personalDetails, weightFrom: value });
                  setIsChanged(true);
                }}
                options={weights}
                width="190px"
              />
              <FloatingSelect
                label="Weight To"
                value={personalDetails.weightTo}
                onChange={(value) => {
                  setPersonalDetails({ ...personalDetails, weightTo: value });
                  setIsChanged(true);
                }}
                options={weights}
                width="190px"
              />
            </div>
          </div>
          <FloatingSelect
            label="Physical Status"
            value={personalDetails.physicalStatus}
            onChange={(value) => {
              setPersonalDetails({ ...personalDetails, physicalStatus: value });
              setIsChanged(true);
            }}
            options={physicalstatus}
          />
          <FloatingSelect
            label="Food habit"
            value={personalDetails.foodHabit}
            onChange={(value) => {
              setPersonalDetails({ ...personalDetails, foodHabit: value });
              setIsChanged(true);
            }}
            options={foodhabits}
          />
          <FloatingSelect
            label="Smoking"
            value={personalDetails.smoking}
            onChange={(value) => {
              setPersonalDetails({ ...personalDetails, smoking: value });
              setIsChanged(true);
            }}
            options={smokinghabits}
          />
          <FloatingSelect
            label="Drinking"
            value={personalDetails.drinking}
            onChange={(value) => {
              setPersonalDetails({ ...personalDetails, drinking: value });
              setIsChanged(true);
            }}
            options={drinkinghabits}
          />
        </div>
      )}
    </div>
  );
}

export default PersonalDetails;
