import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Eye, EyeOff } from "react-feather";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API_URL from "../../../../config";
import { clientAuth } from "../../../../firebase";
import phoneIcon from "../../../assets/icons/phone.svg";
import UpdateLoader from "../../../models/UpdateLoader/UpdateLoader";
import YesNoModal from "../../../models/YesNoModal/YesNoModal";
import activateAccount from "./activate";

function Email({ setLoginType }) {
  const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [loginButtonDisable, setLoginButtonDisable] = useState(false);
  const [isActivatieAccountModalOpen, setIsActivateAccountModalOpen] = useState(false);
  const [isActivateLoading, setIsActivateLoading] = useState(false);

  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleActivateAccount = async () => {
    setIsActivateLoading(true);
    const result = await activateAccount(email);
    setIsActivateLoading(false);
    if (result.status === true) {
      setIsActivateAccountModalOpen(false);
      setSuccessMessage("Account activated successfully. Please login.");
      setIsSuccessPopupVisible(true);
      return;
    }
    setErrorMessage(result.error || "Account activation failed. Please try again.");
    setIsErrorPopupVisible(true);
    return;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.match(mailformat)) {
      setErrorMessage("Please enter a valid email address.");
      setIsErrorPopupVisible(true);
      return;
    }

    setLoginButtonDisable(true);
    try {
      const res = await fetch(`${API_URL}/auth/login-email-address`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 403) return setIsActivateAccountModalOpen(true);
        else if (res.status === 409)
          setErrorMessage(data?.error || "Email does not exist");
        else
          setErrorMessage(data?.error || "Login failed. Please try again");
        setIsErrorPopupVisible(true);
        return;
      }

      await signInWithEmailAndPassword(clientAuth, email, password);
    }
    catch (e) {
      const errorCode = e.code;
      if (errorCode === 'auth/invalid-email' || errorCode === 'auth/missing-email')
        setErrorMessage("Please enter a valid email address.");
      else if (errorCode === 'auth/wrong-password')
        setErrorMessage("Invalid credentials");
      else if (errorCode === 'auth/invalid-credential')
        setErrorMessage("Invalid credentials");
      else if (errorCode === 'auth/user-not-found')
        setErrorMessage("Email not found");
      else if (errorCode === 'auth/missing-password')
        setErrorMessage("Please enter a password.");
      else
        setErrorMessage("An error occurred while logging in");
      setIsErrorPopupVisible(true);
    }
    finally {
      setLoginButtonDisable(false);
    }
  };

  return (
    <>
      <input
        type="email"
        placeholder="Enter your email"
        className="login-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
      />

      <div className="password-wrapper">
        <input
          type={visible ? "text" : "password"}
          placeholder="Password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleLogin(e);
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
        onClick={handleLogin}
        className="login-btn primary"
        disabled={loginButtonDisable}
      >
        {loginButtonDisable ? <UpdateLoader size={20} /> : "Login"}
      </button>

      <div className="divider">
        <span className="or-text">OR</span>
      </div>

      <button onClick={() => setLoginType("phone")} className="login-btn">
        <img src={phoneIcon} alt="Phone" className="login-icon" />
        Phone number
      </button>

      {/* <button className="login-btn">
        <img src={googleIcon} alt="Google" className="login-icon" />
        Continue with Google
      </button> */}
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

export default Email;
