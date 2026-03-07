import { signOut } from "firebase/auth";
import { useRef, useState } from "react";
import API_URL from "../../../config";
import { clientAuth } from "../../../firebase";
import deleteIcon from '../../assets/icons/delete.svg';
import "./DeleteAccount.css";

const triggerShake = (element) => {
  if (!element) return;

  const shake = async () => {
    const shakeSequence = [10, -10, 6, -6, 0];
    for (const offset of shakeSequence) {
      element.style.transform = `translateX(${offset}px)`;
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  };

  shake();
};

const reasons = [
  "I found my life partner",
  "Not getting enough matches",
  "Matches not relevant to my preferences",
  "Concerned about privacy/safety",
  "Not satisfied with the app experience",
  "Taking a break from the search",
  "Using another matrimony platform",
  "Other (please specify)",
];

const DeleteAccount = ({ show, onClose }) => {
  const [textInputValue, setTextInputValue] = useState("");
  const [selectedReason, setSelectedReason] = useState(null);
  const [otherReason, setOtherReason] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const reasonsRef = useRef(null);
  const otherReasonRef = useRef(null);
  const profileIdRef = useRef(null);


  const handleDeleteAccount = async () => {
    if (!selectedReason) {
      triggerShake(reasonsRef.current);
      return;
    }
    if (
      selectedReason === "Other (please specify)" &&
      (!otherReason || otherReason.trim() === "")
    ) {
      triggerShake(otherReasonRef.current);
      return;
    }
    if (!textInputValue || textInputValue.trim() === "") {
      triggerShake(profileIdRef.current);
      return;
    }

    if (textInputValue.trim() !== clientAuth.currentUser.uid) {
      triggerShake(profileIdRef.current);
      return;
    }

    setIsDeleting(true);
    try {
      const token = await clientAuth.currentUser.getIdToken();
      if (!token) throw new Error("User not authenticated");
      const reason = selectedReason === "Other (please specify)" ? otherReason : selectedReason;
      if (!reason || reason.trim() === "") throw new Error("Please provide a valid reason.");

      const res = await fetch(`${API_URL}/auth/delete-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          uid: clientAuth.currentUser.uid,
          textInputValue: textInputValue.trim(),
          reason: reason,
        }),
      });
      const data = await res.json();

      if (!res.ok)
        throw new Error(data?.error || "Something went wrong. Please try again.");

      try {
        localStorage.clear();
        await signOut(clientAuth);
      } catch (signOutError) {
        try {
          await clientAuth.currentUser.getIdToken(true);
          await clientAuth.currentUser.reload();
          await signOut(clientAuth);
        } catch (innerError) { }
      }
    }
    catch (error) {
      setErrorMessage(error.message || "Failed to delete account. Please try again.");
      setIsDeleting(false);
      setErrorVisible(true);
    }
  };

  return (
    <div className={`right-sheet-backdrop ${show ? 'show' : ''}`} onClick={onClose}>
      <div
        className={`right-sheet-container ${show ? 'slide-up' : 'slide-down'}`}
        style={{ bottom: "-30px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mobile-only">
          <div className="right-sheet-header" />
        </div>

        <div className="delete-account-container">
          {/* Header */}
          <div className="delete-account-header">
            <h2 className="delete-account-title">You are deleting your account</h2>
            <p className="delete-account-description">
              Deleting your KalyanaOne account will remove your login access permanently. Your profile will no longer be visible to anyone on the platform. Please note: Your account credentials will be permanently deleted. After deletion, you will not be able to recover your account. Any active premium plan will be cancelled, and the amount will not be refunded.
            </p>
          </div>

          {/* Reasons Section */}
          <div className="delete-account-reasons" ref={reasonsRef}>
            <h3 className="reasons-title">Let us know the reason</h3>
            <div className="reasons-list">
              {reasons.map((reason, idx) => (
                <label key={idx} className="reason-option">
                  <input
                    type="radio"
                    name="deleteReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="reason-radio"
                  />
                  <span className="reason-text">{reason}</span>
                </label>
              ))}
            </div>

            {/* Other Reason Input */}
            {selectedReason === "Other (please specify)" && (
              <textarea
                ref={otherReasonRef}
                type="text"
                multiple
                placeholder="Please specify your reason"
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                className="other-reason-input"
              />
            )}
          </div>

          {/* Profile ID Input */}
          <input
            ref={profileIdRef}
            type="text"
            placeholder="Enter Profile ID"
            value={textInputValue}
            onChange={(e) => setTextInputValue(e.target.value)}
            className="profile-id-input"
          />

          {/* Delete Button */}
          <button
            className="delete-account-btn"
            onClick={handleDeleteAccount}
            disabled={isDeleting}
          >
            <img
              src={deleteIcon}
              alt="Delete"
              style={{ marginRight: '4px', width: '20px', height: '20px' }} />
            Delete account
          </button>

          {/* Error Message */}
          {errorVisible && (
            <div className="error-message">
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteAccount;
