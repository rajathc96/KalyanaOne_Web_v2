import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import API_URL from "../../../config";
import globeIcon from "../../assets/icons/globe.svg";
import UpdateLoader from "../../models/UpdateLoader/UpdateLoader";
import YesNoModal from "../../models/YesNoModal/YesNoModal";

function RequestDataDeletion() {
	const phoneFormat = /^[6-9][0-9]{9}$/;
	const [phoneNumber, setPhoneNumber] = useState("");
	const [userId, setUserId] = useState("");
	const phoneInputRef = useRef(null);
	const inputsRef = useRef([]);
	const [otp, setOtp] = useState(Array(4).fill(""));
	const [showOtpInputs, setShowOtpInputs] = useState(false);
	const [isButtonDisabled, setIsButtonDisabled] = useState(false);
	const [showErrorModal, setShowErrorModal] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [yesBtnText, setYesBtnText] = useState("");

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
		try { clearInterval(timerRef.current); } catch {
			// Silent catch, if timerRef.current is not a valid interval ID
		}
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
		if (!phoneNumber || !userId) {
			setErrorMessage("Please fill in all fields.");
			setYesBtnText("OK");
			setShowErrorModal(true);
			return;
		}

		if (!phoneNumber.match(phoneFormat))
			return toast.error("Invalid Phone Number, Please enter a valid phone number");

		if (userId.length < 6 || !userId.startsWith("K"))
			return toast.error("Invalid User ID, Please enter a valid User ID");

		setIsButtonDisabled(true);
		try {
			const res = await fetch(`${API_URL}/support/request-data-deletion/send-otp`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ phoneNumber, userId }),
			});
			const data = await res.json();

			if (!res.ok) {
				return toast.error(data.error || "Something went wrong. Please try again.");
			}
			setShowOtpInputs(true);

			startTimer(60);
			setTimeout(() => inputsRef.current[0] && inputsRef.current[0].focus(), 50);
			toast.success("OTP sent successfully!");
		}
		catch {
			toast.error("An error occured. Please try again.");
		}
		finally {
			setIsButtonDisabled(false);
		}
	}

	const handleVerifyOtp = async () => {
		if (!phoneNumber.match(phoneFormat))
			return toast.error("Invalid Phone Number", "Please enter a valid phone number.");

		if (otp.some((digit) => digit === ""))
			return toast.error("Invalid OTP");

		setIsButtonDisabled(true);
		try {
			const res = await fetch(`${API_URL}/support/request-data-deletion/verify-otp`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ phoneNumber, userId, otp: otp.join("") }),
			});
			const data = await res.json();

			if (!res.ok)
				return toast.error(data?.error || "Something went wrong. Please try again.");

			toast.success("OTP verified successfully!");
		}
		catch {
			toast.error("An error occured. Please try again.");
		}
		finally {
			setIsButtonDisabled(false);
		}
	};

	return (
		<div className="login-container">
			<div className="login-box">
				<h2 className="login-title">Request Data Deletion</h2>
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
				/>

				<input
					type="text"
					placeholder="Enter User ID"
					className="login-input"
					value={userId}
					onChange={(e) => setUserId(e.target.value)}
					autoComplete="username"
					disabled={showOtpInputs}
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
						showOtpInputs ? "Verify OTP" : "Get OTP"}
				</button>

				<div
					className="new-user-btn"
					style={{ width: "100%" }}
					onClick={() => {
						if (isResendDisabled) return;
						handleSendOtpToMobile(true);
					}}
				>
					{showOtpInputs &&
						<div
							className="resend-otp-text"
							style={{
								width: "100%",
								fontSize: 16,
								color: "#696969",
								textAlign: "center",
								cursor: "pointer",
								marginTop: 4,
							}}
						>
							Didn't receive OTP? {isResendDisabled ? `Resend in ${formatTime(timer)}` : 'Resend OTP'}
						</div>}
				</div>
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
				show={showErrorModal}
				heading={"Error"}
				data={errorMessage}
				onClose={() => setShowErrorModal(false)}
				buttonText={yesBtnText}
				onYes={() => setShowErrorModal(false)}
			/>

		</div>
	);
}

export default RequestDataDeletion;
