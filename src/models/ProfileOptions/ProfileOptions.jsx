import { useRef, useState } from "react";
import { Paperclip } from "react-feather";
import { toast } from "react-toastify";
import API_URL from "../../../config";
import { clientAuth } from "../../../firebase";
import flag from "../../assets/icons/flag.svg";
import mail from "../../assets/icons/mail2.svg";
import Vector from "../../assets/icons/share-2.svg";
import "./ProfileOptions.css";
import YesNoModal from "../YesNoModal/YesNoModal";

function base64ToBlob(base64Data, contentType) {
  const byteCharacters = atob(base64Data.split(",")[1]);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    byteArrays.push(new Uint8Array(byteNumbers));
  }

  return new Blob(byteArrays, { type: contentType });
}

const ProfileOptions = ({ show, onClose, profileId, profileData, showSendMessageButton = true }) => {

  const [active, setActive] = useState(null); // "message" | "report" | null
  const [message, setMessage] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [attachedImage, setAttachedImage] = useState(null);
  const [imageFileName, setImageFileName] = useState(null);
  const [imageFileType, setImageFileType] = useState(null);
  const [isSendMessageButtonLoading, setIsSendMessageButtonLoading] = useState(false);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);
  const [successPopupMessage, setSuccessPopupMessage] = useState("");

  const fileInputRef = useRef(null);

  const handleSendMessageClick = () => {
    setActive(active === "message" ? null : "message");
    setMessage("");
    setAttachedImage(null);
  };

  const handleReportClick = () => {
    setActive(active === "report" ? null : "report");
    setReportDetails("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setAttachedImage(reader.result);
        setImageFileName(file.name);
        setImageFileType(file.mimetype || 'image/png');
      };
      reader.readAsDataURL(file);
    }
    // ✅ reset input so user can re-select another image
    e.target.value = "";
  };

  const handleRemoveImage = () => {
    setAttachedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const submitReport = async () => {
    if (!reportDetails || reportDetails.trim() === "") return;
    if (reportDetails.length < 10) {
      setErrorMessage("Report details must be at least 10 characters long.");
      setIsErrorPopupVisible(true);
      return;
    }

    const formData = new FormData();
    if (attachedImage) {

      const blob = base64ToBlob(attachedImage, imageFileType || 'image/png');
      const file = new File([blob], imageFileName, { type: imageFileType || 'image/png' });
      formData.append('images', file);
    }

    formData.append("profileId", profileId);
    formData.append("report", reportDetails.trim());
    setIsReportLoading(true);
    try {
      const token = await clientAuth?.currentUser?.getIdToken();
      const res = await fetch(`${API_URL}/api/complain/report`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.error || "An error occurred while submitting the report.");

      setSuccessPopupMessage("Report submitted successfully.");
      setIsSuccessPopupVisible(true);
      setReportDetails("");
      setAttachedImage(null);
      setActive(null);
    } catch (e) {
      setErrorMessage(e?.message || "There was an error reporting. Please try again");
      setIsErrorPopupVisible(true);
    } finally {
      setIsReportLoading(false);
    }
  };

  const onShare = async () => {
    const shareText = `🌸 KalyanaOne – Community-Based Matrimony

I found a profile that might interest you.

Profile ID: ${profileId}
Community: ${profileData.casteDetails?.caste || "N/A"}
Age: ${profileData?.basicDetails?.age || "N/A"}
Profession: ${profileData?.educationCareer?.occupation || "N/A"}
Location: ${profileData?.basicDetails?.location || "N/A"}

Built for genuine, community-first connections.

View full profile on KalyanaOne 👇
👉 `;

    const shareData = {
      title: "KalyanaOne Profile Share",
      text: shareText,
      url: `http://kalyana.one/other-profile/${profileId}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) { }
    } else {
      const fullMessage = `${shareData.text}\n${shareData.url}`;
      try {
        await navigator.clipboard.writeText(fullMessage);
        toast.info("Profile message copied to clipboard!");
      } catch (error) { }
    }
  };

  const handleTextMessaging = async () => {
    if (!message || message === "") return;
    setIsSendMessageButtonLoading(true);
    try {
      const chatId = [clientAuth?.currentUser.uid, profileId].sort().join("_");

      const token = await clientAuth?.currentUser?.getIdToken();
      if (!token)
        throw new Error("You are not authenticated. Please log in again.");

      const res = await fetch(`${API_URL}/api/chat/send-message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ chatId: chatId, messageText: message }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "There was an error sending message. Please try again");

      setSuccessPopupMessage("Message sent successfully");
      setIsSuccessPopupVisible(true);
      setMessage("");
      setActive(null);
    } catch (e) {
      setErrorMessage(e?.message || "There was an error sending message. Please try again");
      setIsErrorPopupVisible(true);
    } finally {
      setIsSendMessageButtonLoading(false);
    }
  };

  return (
    <div
      className={`bottom-sheet-backdrop ${show ? "show" : ""}`}
      onClick={onClose}
    >
      <div
        className={`bottom-sheet-container ${show ? "slide-up" : "slide-down"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="profile-options">
          {/* Send Message */}
          {showSendMessageButton &&
            <button
              className={`profile-option-btn ${active === "message" ? "active" : active ? "inactive" : ""
                }`}
              disabled={
                active === "report" ||
                isReportLoading ||
                isSendMessageButtonLoading
              }
              onClick={handleSendMessageClick}
            >
              <img src={mail} alt="Message" />
              <span>
                {active === "message" ? "Cancel Message" : "Send Message"}
              </span>
            </button>
          }
          <button
            className={`profile-option-btn ${active ? "inactive" : ""}`}
            disabled={!!active || isReportLoading || isSendMessageButtonLoading}
            onClick={onShare}
          >
            <img src={Vector} alt="Share" />
            <span>Share Profile</span>
          </button>

          <button
            className={`profile-option-btn ${active === "report" ? "active" : active ? "inactive" : ""
              }`}
            disabled={
              active === "message" ||
              isReportLoading ||
              isSendMessageButtonLoading
            }
            onClick={handleReportClick}
          >
            <img src={flag} alt="Report" />
            <span>
              {active === "report" ? "Cancel Report" : "Report Profile"}
            </span>
          </button>
        </div>

        {/* ✅ Message Box with Submit button inside textarea */}
        {active === "message" && (
          <div className="message-profile textarea-wrapper">
            <textarea
              className="message-textarea"
              placeholder="Please enter the details here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <button
              disabled={!message || isSendMessageButtonLoading}
              onClick={handleTextMessaging}
              className="submit-button"
            >
              Submit
            </button>
          </div>
        )}

        {/* ✅ Report Box (Submit + Paperclip inside container) */}
        {active === "report" && (
          <div className="report-profile textarea-wrapper">
            <textarea
              className="message-textarea"
              placeholder="Please enter the details here..."
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
            />

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            <Paperclip
              className="attachment-icon"
              onClick={() => fileInputRef.current.click()}
            />

            {attachedImage && (
              <div className="attachment-container">
                <img
                  src={attachedImage}
                  alt="Preview"
                  className="attachment-photo"
                />
                <button className="close-button" onClick={handleRemoveImage}>
                  ✕
                </button>
              </div>
            )}

            <button
              disabled={!reportDetails || isReportLoading}
              onClick={submitReport}
              className="submit-button"
            >
              Submit
            </button>
          </div>
        )}
      </div>

      <YesNoModal
        show={isSuccessPopupVisible}
        onClose={() => setIsSuccessPopupVisible(false)}
        heading="Success"
        data={successPopupMessage}
        buttonText="Ok"
      />
      <YesNoModal
        show={isErrorPopupVisible}
        onClose={() => setIsErrorPopupVisible(false)}
        data={errorMessage}
        buttonText="Ok"
      />
    </div>
  );
};

export default ProfileOptions;
