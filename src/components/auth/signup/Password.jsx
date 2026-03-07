import { signInWithCustomToken } from "firebase/auth";
import { useState } from "react";
import { Eye, EyeOff } from "react-feather";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import API_URL from "../../../../config";
import { clientAuth } from "../../../../firebase";
import globeIcon from "../../../assets/icons/globe.svg";
import UpdateLoader from "../../../models/UpdateLoader/UpdateLoader";
import YesNoModal from "../../../models/YesNoModal/YesNoModal";

function Password() {
  const location = useLocation();
  const { email, otp } = location.state || {};

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignup = async () => {
    if (!email) {
      setErrorMessage("Email is required.");
      setIsErrorPopupVisible(true);
      return;
    }
    
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      setIsErrorPopupVisible(true);
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please try again.");
      setIsErrorPopupVisible(true);
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/signup-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp, password, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Something went wrong. Please try again.");
        setIsErrorPopupVisible(true);
        return;
      }
      await signInWithCustomToken(clientAuth, data.token);
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
        <h2 className="login-title">Sign up</h2>
        {/* <h4 className="login-title">Create Password</h4> */}
        <div className="password-wrapper">
          <input
            type={visible ? "text" : "password"}
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="eye-icon" onClick={() => setVisible(!visible)}>
            {!visible ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        <div className="password-wrapper">
          <input
            type={confirmVisible ? "text" : "password"}
            placeholder="Confirm Password"
            className="login-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <span className="eye-icon" onClick={() => setConfirmVisible(!confirmVisible)}>
            {!confirmVisible ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>

        </div>
        <button
          onClick={handleSignup}
          className="login-btn primary"
          disabled={isLoading}
        >
          {isLoading ? <UpdateLoader size={20} /> : "Create Password"}
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
        onClose={() => setIsErrorPopupVisible(false)}
        heading="Error"
        data={errorMessage}
        buttonText="Ok"
      />

    </div>
  );
}

export default Password;
