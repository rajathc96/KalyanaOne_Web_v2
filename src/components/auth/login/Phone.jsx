import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Eye, EyeOff } from "react-feather";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API_URL from "../../../../config";
import { clientAuth } from "../../../../firebase";
import mailIcon from "../../../assets/icons/mail.svg";
import UpdateLoader from "../../../models/UpdateLoader/UpdateLoader";
import YesNoModal from "../../../models/YesNoModal/YesNoModal";
import activateAccount from "./activate";

function Phone({ setLoginType }) {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [isActivatieAccountModalOpen, setIsActivateAccountModalOpen] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isActivateLoading, setIsActivateLoading] = useState(false);
  const phoneFormat = /^[6-9][0-9]{9}$/;

  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleActivateAccount = async () => {
    setIsActivateLoading(true);
    const result = await activateAccount(phoneNumber);
    setIsActivateLoading(false);
    if (result.status === true) {
      setIsActivateAccountModalOpen(false);
      setSuccessMessage("Account activated successfully. Please login.");
      setIsSuccessPopupVisible(true);
      return;
    }
    setErrorMessage(result.error || "Account activation failed. Please try again.");
    setIsErrorPopupVisible(true);
  };

  const handleContinue = async () => {
    if (phoneNumber && !phoneNumber.match(phoneFormat)) {
      setErrorMessage("Invalid Phone Number");
      setIsErrorPopupVisible(true);
      return;
    }

    setIsButtonDisabled(true);
    try {
      const res = await fetch(`${API_URL}/auth/login-phone-number`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 403) return setIsActivateAccountModalOpen(true);
        else if (res.status === 409)
          setErrorMessage(data?.error || "Phone number does not exist");
        else
          setErrorMessage(data?.error || "Login failed. Please try again");
        setIsErrorPopupVisible(true);
        return;
      }
      if (!data?.email) {
        setErrorMessage("User not found. Please try again.");
        setIsErrorPopupVisible(true);
        return;
      }

      await signInWithEmailAndPassword(clientAuth, data.email, password);

    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      setIsErrorPopupVisible(true);
    }
    finally {
      setIsButtonDisabled(false);
    }
  };

  return (
    <>
      <input
        type="text"
        placeholder="Enter phone number"
        className="login-input"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        autoComplete="phone"
      />

      <div className="password-wrapper">
        <input
          type={visible ? "text" : "password"}
          placeholder="Password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleContinue();
            }
          }}
        />
        <span className="eye-icon" onClick={() => setVisible(!visible)}>
          {!visible ? <EyeOff size={20} style={{ cursor: "pointer" }} /> : <Eye size={20} style={{ cursor: "pointer" }} />}
        </span>
      </div>

      <div
        className="new-user-btn forgot-password-text"
        onClick={() => navigate("/forgot-password")}
      >
        Forgot Password?
      </div>
      <button
        className="login-btn primary"
        onClick={handleContinue}
        disabled={isButtonDisabled}
      >
        {isButtonDisabled ? <UpdateLoader size={20} /> : "Login"}
      </button>

      <div className="divider">
        <span className="or-text">OR</span>
      </div>

      <button onClick={() => setLoginType("email")} className="login-btn">
        <img src={mailIcon} alt="Email" className="login-icon" />
        Continue with email
      </button>

      <YesNoModal
        show={isActivatieAccountModalOpen}
        onClose={() => setIsActivateAccountModalOpen(false)}
        heading="Activate your account"
        data="Your account is deactivated. Please activate your account to proceed"
        onYes={handleActivateAccount}
        onlyYes={true}
        buttonText={isActivateLoading ? <UpdateLoader /> : "Activate Account"}
      />

      <YesNoModal
        show={isErrorPopupVisible}
        onClose={() => setIsErrorPopupVisible(false)}
        heading="Error"
        data={errorMessage}
        buttonText="Ok"
      />

      <YesNoModal
        show={isSuccessPopupVisible}
        onClose={() => setIsSuccessPopupVisible(false)}
        heading="Success"
        data={successMessage}
        buttonText="Ok"
      />

    </>
  );
}

export default Phone;
