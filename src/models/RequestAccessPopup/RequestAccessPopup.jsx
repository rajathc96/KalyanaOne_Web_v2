import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API_URL from "../../../config";
import { clientAuth } from "../../../firebase";
import UpdateLoader from "../UpdateLoader/UpdateLoader";
import YesNoModal from "../YesNoModal/YesNoModal";
import { AppContext } from "../../context/AppContext";

const RequestAccessPopup = ({
  show,
  onClose,
  img,
  heading,
  data,
  requestType,
  profileId,
  isPremiumUser,
  setIsSendRequestLimitReachedModalVisible,
  setIsSuccessPopupVisible,
  setIsErrorPopupVisible,
  setErrorMessage
}) => {
  const navigate = useNavigate();
  const { globalData } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleRequest = async () => {
    if (isLoading) return;
    if (!profileId || !requestType) {
      setErrorMessage("Profile ID and request type are required.");
      setIsErrorPopupVisible(true);
      return;
    }

    if (globalData?.interestAndRequestSentCount >= globalData?.interestAndRequestLimit) {
      onClose();
      setIsSendRequestLimitReachedModalVisible(true);
      return;
    }

    const tokenResult = await clientAuth?.currentUser?.getIdTokenResult();
    setIsLoading(true);
    try {
      if (tokenResult.claims?.role === "premium") {
        const response = await fetch(`${API_URL}/api/user/request/send`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenResult.token}`,
          },
          body: JSON.stringify({ requestId: profileId, requestType: requestType }),
        });

        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error || "Failed to send access request.");

        setIsSuccessPopupVisible(true);
      }
    }
    catch (error) {
      setErrorMessage(error?.message || "An error occurred while requesting access. Please try again later.");
      setIsErrorPopupVisible(true);
    }
    finally {
      onClose();
      setIsLoading(false);
    }
  }

  return (
    <div className={`popup-sheet-backdrop ${show ? 'show' : ''}`} onClick={isLoading ? null : onClose}>
      <div
        className={`popup-sheet-container ${show ? 'slide-up' : 'slide-down'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {img && <img src={img} alt="img" className="popup-sheet-image" style={{ alignItems: 'center' }} />}
        </div>
        <p className="popup-sheet-title" style={{ textAlign: 'center', fontWeight: 'bold' }}>{heading}</p>
        <p className="popup-sheet-text" style={{ textAlign: 'center', marginBottom: '20px' }}>
          {data}
        </p>
        {isPremiumUser ?
          <button
            onClick={handleRequest}
            className="popup-sheet-yes-btn"
            style={{ width: '100%', borderRadius: '20px', fontSize: '16px' }}
            disabled={isLoading}
          >
            {isLoading ?
              <UpdateLoader size={19} color="#fff" />
              :
              requestType === 'horoscope' ? 'Request Horoscope' : 'Request Contact'}
          </button>
          :
          <button className="upgrade-btn" onClick={() => navigate('/premium')}>
            Upgrade to Premium
          </button>
        }
      </div>
    </div>
  );
};

export default RequestAccessPopup;
