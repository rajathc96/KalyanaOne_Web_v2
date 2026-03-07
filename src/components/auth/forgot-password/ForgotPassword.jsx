import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API_URL from "../../../../config";
import UpdateLoader from "../../../models/UpdateLoader/UpdateLoader";
import YesNoModal from "../../../models/YesNoModal/YesNoModal";
import SuccessPopup from "../../../models/SuccessPopup";

function ForgotPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const emailOrNum = location.state?.emailOrNum || "";
  const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const phoneFormat = /^[6-9][0-9]{9}$/;
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);

  const [emailOrPhone, setEmailOrPhone] = useState(emailOrNum);
  const [otp, setOtp] = useState(Array(4).fill(""));
  const [isOtpInputVisible, setIsOtpInputVisible] = useState(false);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    if (emailOrNum)
      setEmailOrPhone(emailOrNum);
  }, [emailOrNum]);

  const inputsRef = useRef([]);

  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return; // allow only single digit or empty
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < inputsRef.current.length - 1) {
      const nextInput = inputsRef.current[index + 1];
      nextInput && nextInput.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (otp[index]) {
        // clear current
        const next = [...otp];
        next[index] = '';
        setOtp(next);
      } else if (index > 0) {
        const prev = inputsRef.current[index - 1];
        prev && prev.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1] && inputsRef.current[index - 1].focus();
    } else if (e.key === 'ArrowRight' && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1] && inputsRef.current[index + 1].focus();
    }
    else if (e.key === 'Enter') {
      confirmCode();
    }
  };

  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const startTimer = (seconds = 60) => {
    // clear any existing interval and start a fresh one
    try { clearInterval(timerRef.current); } catch (e) { }
    timerRef.current = null;
    setTimer(seconds);
    setIsResendDisabled(true);
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          setIsResendDisabled(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);


  const handleSendOtp = async () => {
    localStorage.removeItem("kalyanaOne_forgotPasswordEmailOrPhone");
    if (isButtonDisabled) return;
    if (isOtpInputVisible && isResendDisabled) return;
    if (isOtpInputVisible && timer > 0) return;

    const email = emailOrPhone.includes("@") ? emailOrPhone.trim() : null;
    const phoneNumber = !email ? emailOrPhone.trim() : null;

    if (!email && !phoneNumber) {
      setErrorMessage("Please enter a valid email address or phone number.");
      setIsErrorPopupVisible(true);
      return;
    }

    if (email && !email.match(mailformat)) {
      setErrorMessage("Please enter a valid email address.");
      setIsErrorPopupVisible(true);
      return;
    }

    if (phoneNumber && !phoneNumber.match(phoneFormat)) {
      setErrorMessage("Please enter a valid phone number.");
      setIsErrorPopupVisible(true);
      return;
    }

    setIsButtonDisabled(true);
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password/${isOtpInputVisible ? "resend-otp" : "send-otp"}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailOrPhone: emailOrPhone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data?.error || "Something went wrong. Please try again.");
        setIsErrorPopupVisible(true);
        return;
      }
      setIsSuccessPopupVisible(true);
      setIsOtpInputVisible(true);
      startTimer(60);
    }
    catch (error) {
      setErrorMessage("An error occured. Please try again.");
      setIsErrorPopupVisible(true);
    }
    finally {
      setIsButtonDisabled(false);
    }
  };


  const confirmCode = async () => {
    if (otp.some((digit) => digit === "")) {
      setErrorMessage("Please enter the complete OTP.");
      setIsErrorPopupVisible(true);
      return;
    }
    setIsButtonDisabled(true);
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailOrPhone: emailOrPhone, otp: otp.join("") }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data?.error || "Something went wrong. Please try again.");
        setIsErrorPopupVisible(true);
        return;
      }
      localStorage.setItem("kalyanaOne_forgotPasswordEmailOrPhone", emailOrPhone);

      navigate("/forgot-password/password", {
        state: { emailOrPhone: emailOrPhone, otp: otp.join("") }
      });

    } catch (err) {
      setErrorMessage("An error occurred. Please try again.");
      setIsErrorPopupVisible(true);
    }
    finally {
      setIsButtonDisabled(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Forgot Password</h2>
        <input
          placeholder="Email / Phone Number"
          className="login-input"
          value={emailOrPhone}
          onChange={(e) => setEmailOrPhone(e.target.value)}
        />

        {isOtpInputVisible &&
          <div style={{ width: '98%', display: 'flex', gap: 8, justifyContent: 'space-around', margin: '4px 0' }}>
            {[...Array(4)].map((_, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={otp[index]}
                onChange={(e) => handleOtpChange(e.target.value.replace(/[^0-9]/g, ''), index)}
                onKeyDown={(e) => handleOtpKeyDown(e, index)}
                placeholder=""
                style={{
                  width: 40,
                  height: 40,
                  textAlign: 'center',
                  backgroundColor: '#F5F5F5',
                  borderWidth: 1,
                  borderStyle: 'solid',
                  borderColor: '#aaa',
                  borderRadius: 10,
                  fontSize: 20,
                  color: '#000',
                }}
              />
            ))}
          </div>}

        <div
          className="new-user-btn"
          style={{ width: "100%", pointerEvents: isResendDisabled ? "none" : "auto" }}
          onClick={() => {
            if (isResendDisabled) return;
            isOtpInputVisible ? handleSendOtp() : navigate("/login");
          }}
        >
          <div
            style={{
              width: "100%",
              fontSize: 16,
              color: "#696969",
              textAlign: isOtpInputVisible ? "center" : "left",
              cursor: "pointer",
            }}
          > {isOtpInputVisible ?
            `Didn't receive OTP? ${isResendDisabled ? `Resend in ${formatTime(timer)}` : 'Resend OTP'}`
            : "<- Back to Login"
            }
          </div>
        </div>

        <button
          onClick={isOtpInputVisible ? confirmCode : handleSendOtp}
          className="login-btn primary"
          disabled={isButtonDisabled}
        >
          {isButtonDisabled ? <UpdateLoader size={20} /> :
            isOtpInputVisible ? "Verify OTP" :
              "Get OTP"
          }
        </button>

      </div>

      <YesNoModal
        show={isErrorPopupVisible}
        heading="Error"
        data={errorMessage}
        onClose={() => setIsErrorPopupVisible(false)}
        buttonText="Ok"
        onYes={() => setIsErrorPopupVisible(false)}
      />

      <YesNoModal
        show={isSuccessPopupVisible}
        heading="Success"
        data={isOtpInputVisible ? "OTP resent successfully." : "OTP sent successfully."}
        onClose={() => setIsSuccessPopupVisible(false)}
        buttonText="Ok"
      />

    </div>
  );
}

export default ForgotPassword;
