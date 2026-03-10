import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../../../config";
import { clientAuth } from "../../../firebase";
import cancelInterest from "../../assets/icons/cancel-interest.svg";
import PopupSheet from "../../models/PopupSheet/PopupSheet";
import UpdateLoader from "../../models/UpdateLoader/UpdateLoader";
import YesNoModal from "../../models/YesNoModal/YesNoModal";

const Sent = ({ item, setNotificationsData }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelInterestModalVisible, setIsCancelInterestModalVisible] = useState(false);
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCancelRequest = async () => {
    setIsCancelInterestModalVisible(false);
    setIsLoading(true);

    try {
      const token = await clientAuth?.currentUser?.getIdToken();
      if (!token) {
        throw new Error("User is not authenticated");
      }

      const response = await fetch(`${API_URL}/api/user/${item.type === "interest" ? "interest" : "request"}/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(item.type === "interest" ? { interestId: item.uid } : { requestId: item.uid, requestType: item.requestType }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || `Failed to cancel ${item.type} `);
      }

      setNotificationsData(prevData =>
        prevData.filter(notification => !(
          notification.uid === item.uid &&
          notification.type === "interest" &&
          notification.subType === "sent"
        ))
      );

    } catch (error) {
      setErrorMessage(error?.message || `Failed to cancel ${item.type}. Please try again.`);
      setIsErrorPopupVisible(true);
    } finally {
      setIsLoading(false);
    }
  }

  const handleViewProfile = () => {
    navigate(`/other-profile/${item.uid}`);
  }

  return (
    <>
      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '8px 0 3px',
        gap: '5px',
      }}>
        <p style={{ maxWidth: '85%', fontSize: "14px", fontWeight: 400 }}>
          {item.status === "accepted"
            ? `${item.displayDetails.name.split(" ")[0]} accepted your ${item.type === "interest" ? "interest" : item.requestType + " request"}`
            : item.status === "declined"
              ? `${item.displayDetails.name.split(" ")[0]} declined your ${item.type === "interest" ? "interest" : item.requestType + " request"}`
              : `You sent ${item.type === "interest" ? "an interest" : "a " + item.requestType + " request"}`
          }
        </p>
        {item?.timeStamp && (
          <p style={{ fontSize: 14, color: '#696969' }}>
            • {new Date(item.timeStamp._seconds * 1000).toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric',
            })}
          </p>
        )}
      </div>

      {(item.status === "pending" || item.status === "accepted") && (
        <div style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '15px',
          marginTop: 8,
        }}>

          <button
            style={{
              backgroundColor: '#F5F5F5',
              width: '100%',
              padding: '8px 0',
              borderRadius: 20,
              border: 'none',
              color: '#000000',
              fontSize: 16,
              cursor: 'pointer',
            }}
            onClick={item.status === "pending" ? () => setIsCancelInterestModalVisible(true) : handleViewProfile}
          >
            {isLoading ?
              <UpdateLoader />
              :
              item.status === "pending" ? "Cancel" : "View Profile"}
          </button>
        </div>
      )}

      <PopupSheet
        show={isCancelInterestModalVisible}
        onClose={() => setIsCancelInterestModalVisible(false)}
        heading={`Cancel ${item.type === "interest" ? "Interest" : item.requestType + " request"}`}
        data={`Are you sure you want to cancel?`}
        onYes={handleCancelRequest}
        img={cancelInterest}
      />
      <YesNoModal
        show={isErrorPopupVisible}
        onClose={() => setIsErrorPopupVisible(false)}
        heading="Error"
        data={errorMessage}
        buttonText="Ok"

      />
    </>
  );
};

export default Sent;
