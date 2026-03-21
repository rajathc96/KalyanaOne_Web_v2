import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../../../config";
import { clientAuth } from "../../../firebase";
import UpdateLoader from "../UpdateLoader/UpdateLoader";
import { AppContext } from "../../context/AppContext";

const RequestAccessPopup = ({
  show,
  onClose,
  img,
  heading,
  data,
  requestType,
  profileId,
  setIsSendRequestLimitReachedModalVisible,
  setIsSuccessPopupVisible,
  setIsErrorPopupVisible,
  setErrorMessage,
  showUpgradeButton,
  renew,
  isInterestSent,
  isInterestLoading,
  onSendInterest,
}) => {
  const navigate = useNavigate();
  const { globalData } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendInterestClick = async () => {
    if (typeof onSendInterest !== "function") return;
    await onSendInterest();
    onClose();
  };

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
        if (!response.ok) {
          if (data?.code === "LIMIT_REACHED") {
            await clientAuth?.currentUser?.getIdTokenResult(true);
            await clientAuth?.currentUser?.reload();
          }
          throw new Error(data?.error || "Failed to send access request.");
        }

        if (data?.code === "DOWNGRADE") {
          await clientAuth?.currentUser?.getIdTokenResult(true);
          await clientAuth?.currentUser?.reload();
        }
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
        <p className="popup-sheet-text" style={{ textAlign: 'center', marginBottom: '20px', whiteSpace: 'pre-line' }}>
          {data}
        </p>
        {!showUpgradeButton ?
          <button
            onClick={isInterestSent ? handleRequest : handleSendInterestClick}
            className="popup-sheet-yes-btn"
            style={{ width: '100%', borderRadius: '20px', fontSize: '16px' }}
            disabled={isLoading || isInterestLoading}
          >
            {isLoading || isInterestLoading ?
              <UpdateLoader size={19} color="#fff" />
              :
              !isInterestSent ? 'Send Interest' :
                requestType === 'horoscope' ? 'Request Horoscope' : 'Request Contact'}
          </button>
          :
          <button className="upgrade-btn" style={{ marginBottom: 0 }} onClick={() => navigate('/premium')}>
            {renew ? 'Renew at ₹99 Only!' : 'Upgrade at ₹99 Only!'}
          </button>
        }
      </div>
    </div>
  );
};

export default RequestAccessPopup;
