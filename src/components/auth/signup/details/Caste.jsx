import { useEffect, useState } from "react";
import API_URL from "../../../../../config";
import { clientAuth } from "../../../../../firebase";
import UpdateLoader from "../../../../models/UpdateLoader/UpdateLoader";
import FloatingInput from "../../../settings/FloatingInput";
import FloatingInputSelect from "../../../settings/FloatingInputSelect";
import casteNames from "../../../../data/casteNames";
import "./Details.css";
import YesNoModal from "../../../../models/YesNoModal/YesNoModal";

const Caste = ({ onNext, viewportHeight }) => {
  const [caste, setCaste] = useState("");
  const [subCaste, setSubcaste] = useState("");
  const [isGettingSubCasteLoading, setIsGettingSubCasteLoading] = useState(false);
  const [subCasteNames, setSubCasteNames] = useState([]);

  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const getSubCastes = async (caste) => {
    setIsGettingSubCasteLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/user/subcastes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await clientAuth?.currentUser?.getIdToken()}`,
        },
        body: JSON.stringify({ caste }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubCasteNames(data);
      } else {
        setErrorMessage(data.error || "Something went wrong. Please try again.");
        setIsErrorPopupVisible(true);
        return;
      }

    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      setIsErrorPopupVisible(true);
    }
    finally {
      setIsGettingSubCasteLoading(false);
    }
  }

  useEffect(() => {
    if (caste) {
      getSubCastes(caste);
    }
  }, [caste]);

  const [isLoading, setIsLoading] = useState(false);

  const handleCasteSelection = async () => {
    if (!caste) {
      setErrorMessage("Please select a caste");
      setIsErrorPopupVisible(true);
      return;
    }

    if (!subCaste) {
      setErrorMessage("Please select a subCaste");
      setIsErrorPopupVisible(true);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/caste`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await clientAuth?.currentUser?.getIdToken()}`,
        },
        body: JSON.stringify({ caste, subCaste }),
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
          <FloatingInput
            placeholder="Religion"
            width={window.innerWidth < 768 ? "100%" : "300px"}
            value={"Hindu"}
            disabled={true}
          />

          <FloatingInputSelect
            label="Select your Caste"
            width={window.innerWidth < 768 ? "100%" : "300px"}
            value={caste}
            onChange={(val) => {
              setCaste(val);
              setSubcaste(""); // reset subCaste on caste change
            }}
            options={casteNames}
          />

          {/* Select subCaste */}
          {caste && (
            <FloatingInputSelect
              label="Select your Subcaste"
              width="300px"
              value={subCaste}
              onChange={(val) => setSubcaste(val)}
              options={subCasteNames}
              optionsLoading={isGettingSubCasteLoading}
            />
          )}
        </div>
      </div>

      <button
        className="get-started-btn"
        onClick={handleCasteSelection}
        disabled={!caste || !subCaste}
      >
        {isLoading ?
          <UpdateLoader />
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

export default Caste;
