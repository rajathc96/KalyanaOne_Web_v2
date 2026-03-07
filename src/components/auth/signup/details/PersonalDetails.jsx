import { useState } from "react";
import { toast } from "react-toastify";
import API_URL from "../../../../../config";
import { clientAuth } from "../../../../../firebase";
import generateHeightsArray from "../../../../clientFunctions/heightOptions";
import FloatingDateSelect from "../../../settings/FloatingDateSelect";
import FloatingInput from "../../../settings/FloatingInput";
import FloatingSelect from "../../../settings/FloatingSelect";
import "./Details.css";
import YesNoModal from "../../../../models/YesNoModal/YesNoModal";

const PersonalDetails = ({ onNext, viewportHeight }) => {
  const [name, setName] = useState("");
  const [height, setHeight] = useState("");
  const [dob, setDob] = useState('');
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const heightRange = generateHeightsArray();

  const [isLoading, setIsLoading] = useState(false);

  const handlePersonalDetails = async () => {
    if (!name || !dob || !height) {
      setErrorMessage("Please fill in all fields.");
      setIsErrorPopupVisible(true);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/personal-details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await clientAuth?.currentUser?.getIdToken()}`,
        },
        body: JSON.stringify({ name, dob, height }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Something went wrong. Please try again.");
        setIsErrorPopupVisible(true);
        return;
      }

      onNext({ name, dob, height });
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
      style={{ height: viewportHeight - 160 }}
    >
      <div className="inside-detail-subcontainer">
        <FloatingInput
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Replace old DOB section with new component */}
        <div className="dob-selector">
          <FloatingDateSelect
            value={dob}
            onChange={(value) => setDob(value)}
          />
        </div>

        <FloatingSelect
          width={300}
          label="Height"
          value={height}
          onChange={(value) => setHeight(value)}
          options={heightRange}
        />
        <div className="info-text">
          Enter Full name & Date of birth as per Aadhaar card.<br />
          It cannot be changed later.
        </div>
      </div>


      <button
        className="get-started-btn"
        onClick={handlePersonalDetails}
        disabled={isLoading}
      >
        {isLoading ? "Please wait..." : "Continue"}
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

export default PersonalDetails;