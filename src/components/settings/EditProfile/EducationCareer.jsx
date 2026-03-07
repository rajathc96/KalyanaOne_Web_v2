import { useState } from "react";
import arrowDown from "../../../assets/icons/arrowdown.svg";
import LargeSelection from "../../../models/LargeSelection/LargeSelection";
import Occupation from "../../../models/Occupation/Occupation";
import FloatingCitySelect from "../FloatingCitySelect";
import FloatingInput from "../FloatingInput";
import FloatingInputSelect from "../FloatingInputSelect";
import { company } from "../../../data/data";

function EducationCareer({ educationCareer, setEducationCareer, arrowUp, setIsChanged }) {
  const [show, setShow] = useState(true);
  const [showLargeSelection, setShowLargeSelection] = useState(false);
  const [showOccupation, setShowOccupation] = useState(false);
  return (
    <div className="partner-preference-section">
      <p>
        Education & Career details{" "}
        <img
          onClick={() => setShow(!show)}
          src={show ? arrowUp : arrowDown}
          alt="dropdown arrow"
        />
      </p>
      {show && (
        <div className="input-group">
          <FloatingInput
            placeholder="Highest qualification"
            value={educationCareer.highestQualification}
            onChange={(e) => {
              setEducationCareer({
                ...educationCareer,
                highestQualification: e.target.value,
              })
              setIsChanged(true);
            }}
            onClick={() => setShowLargeSelection(true)}
          />
          <FloatingInput
            placeholder="University / College"
            value={educationCareer.college}
            onChange={(e) => {
              setEducationCareer({
                ...educationCareer,
                college: e.target.value,
              })
              setIsChanged(true);
            }}
          />
          <FloatingInput
            placeholder="Occupation"
            value={educationCareer.occupation}
            onChange={(e) => {
              setEducationCareer({
                ...educationCareer,
                occupation: e.target.value,
              })
              setIsChanged(true);
            }}
            onClick={() => setShowOccupation(true)}
          />
          <FloatingInputSelect
            label="Company"
            value={educationCareer.company}
            onChange={(value) => {
              setEducationCareer({
                ...educationCareer,
                company: value,
              })
              setIsChanged(true);
            }}
            options={company}
            allowCustomInput={true}
          />
          <FloatingInput
            placeholder="Annual income"
            value={educationCareer.annualIncome}
            onChange={(e) => {
              setEducationCareer({
                ...educationCareer,
                annualIncome: e.target.value,
              })
              setIsChanged(true);
            }}
          />
          <FloatingCitySelect
            label="Working location"
            value={educationCareer.workLocation}
            onChange={(value) => {
              setEducationCareer({
                ...educationCareer,
                workLocation: value,
              })
              setIsChanged(true);
            }}
          />
        </div>
      )}
      <LargeSelection
        show={showLargeSelection}
        onClose={() => setShowLargeSelection(false)}
        setEducationCareer={setEducationCareer}
        educationCareer={educationCareer}
      />
      <Occupation
        show={showOccupation}
        onClose={() => setShowOccupation(false)}
        setEducationCareer={setEducationCareer}
        educationCareer={educationCareer}
      />
    </div>
  );
}

export default EducationCareer;
