import { useState } from "react";
import { Eye, EyeOff } from "react-feather";
import { useLocation, useNavigate } from "react-router-dom";
import API_URL from "../../../../config";
import globeIcon from "../../../assets/icons/globe.svg";
import UpdateLoader from "../../../models/UpdateLoader/UpdateLoader";
import YesNoModal from "../../../models/YesNoModal/YesNoModal";

function ForgotPasswordPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { emailOrPhone } = location.state || {};

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);

  const handlePasswordDetails = async () => {
    const emailOrNum = localStorage.getItem("kalyanaOne_forgotPasswordEmailOrPhone");
    if (!emailOrNum || emailOrNum !== emailOrPhone) {
      setErrorMessage("Unauthorized attempt. Please restart the password reset process.");
      setIsErrorPopupVisible(true);
      return;
    }

    if (password.trim().length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      setIsErrorPopupVisible(true);
      return;
    }

    if (password.trim() !== confirmPassword.trim()) {
      setErrorMessage("Passwords do not match. Please try again.");
      setIsErrorPopupVisible(true);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password/update-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailOrPhone, password: password.trim(), confirmPassword: confirmPassword.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data?.error || "Something went wrong. Please try again.");
        setIsErrorPopupVisible(true);
        return;
      }
      setSuccessMessage("Password updated successfully. Please log in with your new password.");
      setIsSuccessPopupVisible(true);
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

    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Create New Password</h2>
        <div className="password-wrapper">
          <input
            type={isPasswordVisible ? "text" : "password"}
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="eye-icon" onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
            {!isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        <div className="password-wrapper">
          <input
            type={isConfirmPasswordVisible ? "text" : "password"}
            placeholder="Confirm Password"
            className="login-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <span className="eye-icon" onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
            {!isConfirmPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>

        </div>
        <button
          onClick={handlePasswordDetails}
          className="login-btn primary"
          disabled={isLoading}
        >
          {isLoading ? <UpdateLoader size={20} /> : "Update Password"}
        </button>

      </div>
      <div className="login-footer">
        <span className="footer-text">
          India’s most secured match making platform
        </span>
        <div className="lang">
          <img src={globeIcon} alt="Language" className="lang-icon" />
          <span>English</span>
        </div>
      </div>

      <YesNoModal
        show={isErrorPopupVisible}
        heading="Error"
        data={errorMessage}
        onClose={() => setIsErrorPopupVisible(false)}
        buttonText="Ok"
      />

      <YesNoModal
        show={isSuccessPopupVisible}
        heading="Success"
        data={successMessage}
        onClose={() => setIsSuccessPopupVisible(false)}
        buttonText="Ok"
        onYes={() => {
          setIsSuccessPopupVisible(false);
          navigate("/login");
        }}
      />

    </div>

  );
}

export default ForgotPasswordPassword;
