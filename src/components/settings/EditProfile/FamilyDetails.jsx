import { useState } from "react";
import arrowDown from "../../../assets/icons/arrowdown.svg";
import FloatingInput from "../FloatingInput";
import FloatingSelect from "../FloatingSelect";
import { familystatus, familytype, familyValue } from "../../../data/data";

function FamilyDetails({ familyDetails, setFamilyDetails, arrowUp, setIsChanged }) {
  const [show, setShow] = useState(true);

  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="partner-preference-section">
      <p>
        Family details{" "}
        <img
          onClick={() => setShow(!show)}
          src={show ? arrowUp : arrowDown}
          alt="dropdown arrow"
        />
      </p>
      {show && (
        <div className="input-group">
          <FloatingInput
            placeholder="Father name"
            value={familyDetails.fatherName}
            onChange={(e) => {
              setFamilyDetails({ ...familyDetails, fatherName: e.target.value });
              setIsChanged(true);
            }}
          />
          <FloatingInput
            placeholder="Father occupation / profession"
            value={familyDetails.fatherOccupation}
            onChange={(e) => {
              setFamilyDetails({
                ...familyDetails,
                fatherOccupation: e.target.value,
              });
              setIsChanged(true);
            }}
          />
          <FloatingInput
            placeholder="Mother name"
            value={familyDetails.motherName}
            onChange={(e) => {
              setFamilyDetails({ ...familyDetails, motherName: e.target.value })
              setIsChanged(true);
            }}
          />
          <FloatingInput
            placeholder="Mother occupation / profession"
            value={familyDetails.motherOccupation}
            onChange={(e) => {
              setFamilyDetails({
                ...familyDetails,
                motherOccupation: e.target.value,
              });
              setIsChanged(true);
            }}
          />
          <FloatingSelect
            label="Family Value"
            value={familyDetails.familyValue}
            onChange={(value) => {
              setFamilyDetails({ ...familyDetails, familyValue: value })
              setIsChanged(true);
            }}
            options={familyValue}
          />
          <FloatingSelect
            label="Family Type"
            value={familyDetails.familyType}
            onChange={(value) => {
              setFamilyDetails({ ...familyDetails, familyType: value })
              setIsChanged(true);
            }}
            options={familytype}
          />
          <FloatingSelect
            label="Family Status"
            value={familyDetails.familyStatus}
            onChange={(value) => {
              setFamilyDetails({
                ...familyDetails,
                familyStatus: value,
              });
              setIsChanged(true);
            }}
            options={familystatus}
          />
          <FloatingInput
            placeholder="Native Place"
            value={familyDetails.nativePlace}
            onChange={(e) => {
              setFamilyDetails({
                ...familyDetails,
                nativePlace: e.target.value,
              })
              setIsChanged(true);
            }}
          />
          <FloatingSelect
            label="No. of Brothers"
            value={familyDetails.noOfBrothers.toString()}
            onChange={(value) => {
              setFamilyDetails({ ...familyDetails, noOfBrothers: value });
              setIsChanged(true);
            }}
            options={numbers}
          />
          {familyDetails.noOfBrothers > 0 && 
          <FloatingSelect
            label="No. of Married Brothers"
            value={familyDetails.noOfMarriedBrothers.toString()}
            onChange={(value) => {
              setFamilyDetails({
                ...familyDetails,
                noOfMarriedBrothers: value,
              });
              setIsChanged(true);
            }}
            options={numbers}
          />}
          <FloatingSelect
            label="No. of Sisters"
            value={familyDetails.noOfSisters.toString()}
            onChange={(value) => {
              setFamilyDetails({ ...familyDetails, noOfSisters: value });
              setIsChanged(true);
            }}
            options={numbers}
          />
          {familyDetails.noOfSisters > 0 && 
          <FloatingSelect
            label="No. of Married Sisters"
            value={familyDetails.noOfMarriedSisters.toString()}
            onChange={(value) => {
              setFamilyDetails({
                ...familyDetails,
                noOfMarriedSisters: value,
              });
              setIsChanged(true);
            }}
            options={numbers}
          />}
        </div>
      )}
    </div>
  );
}

export default FamilyDetails;
