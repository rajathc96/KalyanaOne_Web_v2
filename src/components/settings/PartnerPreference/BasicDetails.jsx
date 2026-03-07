import { useState } from "react";
import arrowDown from "../../../assets/icons/arrowdown.svg";
import arrowUp from "../../../assets/icons/arrowup.svg";
import generateHeightsArray from "../../../clientFunctions/heightOptions";
import FloatingMultiplesCitySelect from "../FloatingMultiplesCitySelect";
import FloatingMultipleSelect from "../FloatingMultipleSelect";
import FloatingSelect from "../FloatingSelect";
import { ageOptions } from "../../../data/data";
import { languages, maritalstatus } from "../../../data/searchFilters";

function BasicDetails({ basicDetails, setBasicDetails, globalData, setIsChanged }) {
  const [show, setShow] = useState(true);

  const heightOptions = generateHeightsArray();

  return (
    <div className="partner-preference-section">
      <p style={{ marginTop: "8px" }}>
        Basic details{" "}
        <img onClick={() => setShow(!show)} src={show ? arrowUp : arrowDown} alt="dropdown arrow" />
      </p>
      {show && (
        <div className="input-group">
          <p style={{ marginTop: "4px", fontWeight: "400" }}>Age</p>
          <div className="filter-row">
            <FloatingSelect
              label="From"
              value={basicDetails.ageFrom}
              onChange={(value) => {
                setBasicDetails({ ...basicDetails, ageFrom: value })
                setIsChanged(true);
              }}
              options={ageOptions}
              width={"190px"}
            />
            <FloatingSelect
              label="To"
              value={basicDetails.ageTo}
              onChange={(value) => {
                setBasicDetails({ ...basicDetails, ageTo: value })
                setIsChanged(true);
              }}
              options={ageOptions}
              width={"190px"}
            />
          </div>
          {/* <hr></hr> */}

          <p style={{ marginTop: "4px", fontWeight: "400" }}>Height</p>
          <div className="filter-row">
            <FloatingSelect
              label="From"
              value={basicDetails.heightFrom}
              onChange={(value) => {
                setBasicDetails({ ...basicDetails, heightFrom: value })
                setIsChanged(true);
              }}
              options={heightOptions}
              width={"190px"}
            />
            <FloatingSelect
              label="To"
              value={basicDetails.heightTo}
              onChange={(value) => {
                setBasicDetails({ ...basicDetails, heightTo: value })
                setIsChanged(true);
              }}
              options={heightOptions}
              width={"190px"}
            />
          </div>
          <FloatingSelect
            label="Marital Status"
            value={basicDetails.maritalStatus}
            onChange={(value) => {
              setBasicDetails({ ...basicDetails, maritalStatus: value })
              setIsChanged(true);
            }}
            options={maritalstatus}
          />
          <FloatingMultiplesCitySelect
            label="Living In"
            value={basicDetails.location}
            onChange={(value) => {
              setBasicDetails({ ...basicDetails, location: value })
              setIsChanged(true);
            }}
          />
          <FloatingMultipleSelect
            placeholder="Language"
            value={basicDetails.language}
            onChange={(value) => {
              setBasicDetails({ ...basicDetails, language: value })
              setIsChanged(true);
            }}
            options={languages}
            allowCustomInput={true}
          />
        </div>
      )}
    </div>
  );
}

export default BasicDetails;
