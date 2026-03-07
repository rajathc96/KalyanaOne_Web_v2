import { useState } from "react";
import { toast } from "react-toastify";
import API_URL from "../../../../../config";
import { clientAuth } from "../../../../../firebase";
import UpdateLoader from "../../../../models/UpdateLoader/UpdateLoader";
import FloatingInput from "../../../settings/FloatingInput";
import "./Details.css";
import YesNoModal from "../../../../models/YesNoModal/YesNoModal";

const formatToINR = (num) => {
  if (!num || num === "Don't wish to specify") return "";
  const number = num.replace(/[^0-9]/g, "");
  const x = number.length > 3 ? number.slice(0, -3) : "";
  const last3 = number.slice(-3);
  const formatted =
    x.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + (x ? "," : "") + last3;
  return "₹" + formatted;
};

const Income = ({ onNext, viewportHeight }) => {
  const [annualIncome, setAnnualIncome] = useState(0);
  const [skip, setSkip] = useState(false);
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const parseFromINR = (formatted) => {
    return formatted.replace(/[^0-9]/g, "").replace(/^0+/, "");
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleAnnualIncomeData = async () => {
    if (annualIncome === 0) {
      setErrorMessage("Please enter your annual income or click 'Don’t wish to specify'");
      setIsErrorPopupVisible(true);
      return;
    }

    if (annualIncome <= 2000 && annualIncome !== "Don't wish to specify") {
      setErrorMessage("Please enter a valid annual income");
      setIsErrorPopupVisible(true);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/income`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await clientAuth?.currentUser?.getIdToken()}`,
        },
        body: JSON.stringify({ annualIncome: (annualIncome === "Don't wish to specify" ? null : annualIncome) }),
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

        <div className="accountfor-options">
          <FloatingInput
            placeholder={"Annual Income"}
            value={formatToINR(annualIncome)}
            onChange={(e) => {
              setSkip(false);
              const numeric = parseFromINR(e.target.value);
              setAnnualIncome(numeric);
            }}
            onClick={() => setSkip(false)}
          />

          <button
            className={`accountfor-btn ${skip ? 'active' : ''}`}
            onClick={() => {
              setAnnualIncome("Don't wish to specify");
              setSkip(true);
            }}
          >
            Don’t wish to specify
          </button>
        </div>
      </div>

      <button
        className="get-started-btn"
        disabled={isLoading}
        onClick={handleAnnualIncomeData}
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

export default Income;
