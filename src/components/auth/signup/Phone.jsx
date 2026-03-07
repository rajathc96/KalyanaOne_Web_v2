import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API_URL from "../../../../config";
import UpdateLoader from "../../../models/UpdateLoader/UpdateLoader";
import YesNoModal from "../../../models/YesNoModal/YesNoModal";
import check_green from "../../../assets/icons/check_circle1.svg";
import check_white from "../../../assets/icons/whitemark.svg";

function Phone({ setLoginType }) {
  const navigate = useNavigate();
  const phoneFormat = /^[6-9][0-9]{9}$/;
  const [phoneNumber, setPhoneNumber] = useState("");
  const phoneInputRef = useRef(null);
  const inputsRef = useRef([]);
  const [otp, setOtp] = useState(Array(4).fill(""));
  const [showOtpInputs, setShowOtpInputs] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorHeading, setErrorHeading] = useState("Error");
  const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [yesBtnText, setYesBtnText] = useState("");
  const [isTermsChecked, setIsTermsChecked] = useState(true);

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
      handleVerifyOtp();
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

  const handleSendOtpToMobile = async (resend = false) => {
    if (resend && isResendDisabled) return;

    localStorage.removeItem("kalyanaOne_signupPhoneNumber");
    if (!phoneNumber) {
      setErrorMessage("Please enter your phone number to proceed.");
      setIsErrorPopupVisible(true);
      return;
    }

    if (!isTermsChecked) {
      setErrorMessage("Please agree to the Terms and Conditions and Privacy Policy to proceed.");
      setIsErrorPopupVisible(true);
      return;
    }

    if (!phoneNumber.match(phoneFormat)) {
      setErrorMessage("Invalid Phone Number, Please enter a valid phone number.");
      setIsErrorPopupVisible(true);
      return;
    }

    setIsButtonDisabled(true);
    try {
      const res = await fetch(`${API_URL}/auth/signup/${resend === true ? 'resend' : 'send'}-otp-phone-number`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber, isTermsChecked }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 408) {
          setErrorHeading("Phone Number Exists");
          setErrorMessage("Number already exists and is verified. Please log in.");
          setYesBtnText("Login");
          setIsErrorPopupVisible(true);
          return;
        }
        else if (res.status === 409) {
          localStorage.setItem("kalyanaOne_signupPhoneNumber", phoneNumber);
          setErrorHeading("Phone Number Verified");
          setErrorMessage("Phone number is already verified, Please continue with email.");
          setYesBtnText("Ok");
          setIsErrorPopupVisible(true);
          return;
        }
        setErrorMessage(data.error || "Something went wrong. Please try again.");
        setIsErrorPopupVisible(true);
        return;
      }
      setShowOtpInputs(true);
      // start countdown timer and focus first OTP input
      startTimer(60);
      setTimeout(() => inputsRef.current[0] && inputsRef.current[0].focus(), 50);
      setSuccessMessage("OTP sent successfully!");
      setIsSuccessPopupVisible(true);
    }
    catch (error) {
      setErrorMessage("An error occured. Please try again.");
      setIsErrorPopupVisible(true);
    }
    finally {
      setIsButtonDisabled(false);
    }
  }

  const handleVerifyOtp = async () => {
    if (!phoneNumber.match(phoneFormat)) {
      setErrorHeading("Invalid Phone Number");
      setErrorMessage("Please enter a valid phone number.");
      setIsErrorPopupVisible(true);
      return;
    }

    if (otp.some((digit) => digit === "")) {
      setErrorHeading("Invalid OTP");
      setErrorMessage("Please enter a valid OTP.");
      setIsErrorPopupVisible(true);
      return;
    }

    setIsButtonDisabled(true);
    try {
      const res = await fetch(`${API_URL}/auth/signup/verify-otp-phone-number`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber, otp: otp.join("") }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data?.error || "Something went wrong. Please try again.");
        setIsErrorPopupVisible(true);
        return;
      }
      localStorage.setItem("kalyanaOne_signupPhoneNumber", phoneNumber);
      setSuccessMessage("OTP verified successfully!");
      setIsSuccessPopupVisible(true);
      // return setLoginType("email");
    }
    catch (error) {
      setErrorMessage("An error occured. Please try again.");
      setIsErrorPopupVisible(true);
      return;
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
        maxLength={10}
        disabled={showOtpInputs}
        ref={phoneInputRef}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSendOtpToMobile();
          }
        }}
      />

      {showOtpInputs &&
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
                width: 50,
                height: 50,
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

      <button
        className="login-btn primary"
        onClick={showOtpInputs ? handleVerifyOtp : handleSendOtpToMobile}
        disabled={isButtonDisabled}
      >
        {isButtonDisabled ? <UpdateLoader size={20} /> :
          showOtpInputs ? "Verify OTP" : "Send OTP"}
      </button>

      {!showOtpInputs && <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', gap: 5, marginTop: 4 }}>
        <div style={{ fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
          <img
            src={isTermsChecked ? check_green : check_white}
            alt="check"
            style={{ cursor: 'pointer' }}
            onClick={() => setIsTermsChecked(!isTermsChecked)}
          />
          You agree to the
        </div>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', alignItems: 'center' }}>
          <a
            href="https://kalyanaone.com/terms-and-conditions"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 14, color: '#FF025B', textDecoration: 'underline' }}
          >
            Terms and Conditions
          </a>
          <div style={{ fontSize: 14 }}>
            and
          </div>
          <a
            href="https://kalyanaone.com/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 14, color: '#FF025B', textDecoration: 'underline' }}
          >
            Privacy policy
          </a>
        </div>
      </div>}

      {showOtpInputs && <div style={{ width: '100%', marginTop: 8, paddingLeft: 6 }}>
        <div
          onClick={() => {
            // allow user to change number: hide OTP inputs, clear entered digits and focus phone input
            setShowOtpInputs(false);
            setOtp(Array(otp.length).fill(""));
            setTimeout(() => phoneInputRef.current && phoneInputRef.current.focus(), 50);
          }}
          style={{
            width: "100%",
            fontSize: 14,
            color: "#FF025B",
            textDecoration: "underline",
            alignItems: "flex-start",
            cursor: "pointer",
          }}
        >
          Not your number? Change it
        </div>
      </div>}

      <div
        className="new-user-btn"
        style={{ width: "100%" }}
        onClick={() => {
          if (showOtpInputs) {
            // when OTP inputs are visible, clicking should resend OTP unless disabled
            if (isResendDisabled) return;
            handleSendOtpToMobile(true);
          } else {
            navigate("/login");
          }
        }}
      >
        <div
          className="resend-otp-text"
          style={{
            width: "100%",
            fontSize: 16,
            color: "#696969",
            textAlign: showOtpInputs ? "center" : "left",
            cursor: "pointer",
            marginTop: 4,
          }}
        >
          {showOtpInputs
            ? `Didn't receive OTP? ${isResendDisabled ? `Resend in ${formatTime(timer)}` : 'Resend OTP'}`
            : "Already have an account? Log In"}
        </div>
      </div>

      <YesNoModal
        show={isErrorPopupVisible}
        heading={errorHeading}
        data={errorMessage}
        yesText={yesBtnText}
        onClose={() => {
          setIsErrorPopupVisible(false)
          setErrorHeading("Error");
          setErrorMessage("");
        }}
        buttonText={yesBtnText}
        onYes={() => {
          yesBtnText === "Login" ? navigate("/login") : setLoginType("email");
          setIsErrorPopupVisible(false);
          setErrorHeading("Error");
          setErrorMessage("");
        }}
      />

      <YesNoModal
        show={isSuccessPopupVisible}
        heading="Success"
        data={successMessage}
        onClose={() => {
          setIsSuccessPopupVisible(false);
          setSuccessMessage("");
          if (successMessage === "OTP verified successfully!")
            setLoginType("email");
        }}
        buttonText="Ok"
      />

    </>
  );
}

export default Phone;
