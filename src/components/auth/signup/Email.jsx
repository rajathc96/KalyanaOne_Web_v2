import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API_URL from "../../../../config";
import UpdateLoader from "../../../models/UpdateLoader/UpdateLoader";
import YesNoModal from "../../../models/YesNoModal/YesNoModal";

function Email() {
  const navigate = useNavigate();
  const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [isOtpInputVisible, setIsOtpInputVisible] = useState(false);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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


  // const handleOtpChange = (value) => {
  //   const numericValue = value.replace(/\D/g, '');
  //   setOtp(numericValue);
  // }

  const handleSignup = async () => {
    if (!email) {
      setErrorMessage("Email is required");
      setIsErrorPopupVisible(true);
      return;
    }
    if (!email.match(mailformat)) {
      setErrorMessage("Invalid Email");
      setIsErrorPopupVisible(true);
      return;
    }

    const phoneNumber = localStorage.getItem("kalyanaOne_signupPhoneNumber");
    if (!phoneNumber) {
      setErrorMessage("Phone number is missing. Please start the signup process again.");
      setIsErrorPopupVisible(true);
      navigate("/signup", { replace: true });
      return;
    }

    setIsButtonDisabled(true);
    try {
      const res = await fetch(`${API_URL}/auth/check-email-address`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, phoneNumber }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409)
          setErrorMessage("Please use a different email address to create a new account.");
        else
          setErrorMessage(data?.error || "Something went wrong. Please try again.");
        setIsErrorPopupVisible(true);
        return;
      }
      setSuccessMessage("OTP sent to email successfully!");
      setIsSuccessPopupVisible(true);
      setIsOtpInputVisible(true);
      startTimer(60);
    }
    catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      setIsErrorPopupVisible(true);
    }
    finally {
      setIsButtonDisabled(false);
    }
  }


  const confirmCode = async () => {
    setIsLoading(true);

    try {

      const res = await fetch(`${API_URL}/auth/verify-email-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, otp: otp.join("") }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data?.error || "Something went wrong. Please try again.");
        setIsErrorPopupVisible(true);
        return;
      }

      navigate("/signup/password", { state: { email: email, otp: otp.join("") } });

    } catch (err) {
      setErrorMessage("Invalid OTP");
      setIsErrorPopupVisible(true);
    }
    finally {
      setIsLoading(false);
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

      {isOtpInputVisible &&
        <div style={{ width: '98%', display: 'flex', gap: 8, justifyContent: 'space-around', margin: '4px 0' }}>
          {[...Array(6)].map((_, index) => (
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

      <button
        onClick={isOtpInputVisible ? confirmCode : handleSignup}
        className="login-btn primary"
        disabled={isButtonDisabled || isLoading}
      >
        {isButtonDisabled || isLoading ? <UpdateLoader size={20} /> :
          isOtpInputVisible ? "Verify OTP" :
            "Get OTP"
        }
      </button>

      {isOtpInputVisible && <div
        className="new-user-btn"
        style={{ width: "100%" }}
        onClick={() => {
          if (isResendDisabled) return;
          handleSignup();
        }}
      >
        <div
          style={{
            width: "100%",
            fontSize: 16,
            color: "#696969",
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          {`Didn't receive OTP? ${isResendDisabled ? `Resend in ${formatTime(timer)}` : 'Resend OTP'}`}
        </div>
      </div>}

      <YesNoModal
        show={isErrorPopupVisible}
        heading="This email is already exist"
        data={errorMessage}
        onClose={() => setIsErrorPopupVisible(false)}
        buttonText="Ok"
        onYes={() => {
          setEmail("");
          setIsErrorPopupVisible(false)
        }}
      />

      <YesNoModal
        show={isSuccessPopupVisible}
        heading="Success"
        data={successMessage}
        onClose={() => setIsSuccessPopupVisible(false)}
        buttonText="Ok"
        onYes={() => setIsSuccessPopupVisible(false)}
      />

    </>
  );
}

export default Email;
