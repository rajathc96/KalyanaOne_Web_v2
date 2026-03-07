import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API_URL from '../../../config';
import { clientAuth } from '../../../firebase';
import PopupSheet from '../../models/PopupSheet/PopupSheet';
import YesNoModal from '../../models/YesNoModal/YesNoModal';

const Received = ({ item, getNotifications }) => {
  const navigate = useNavigate();
  const [isDeclinePopupVisible, setIsDeclinePopupVisible] = useState(false);
  const [isAcceptPopupVisible, setIsAcceptPopupVisible] = useState(false);
  const [isAcceptLoading, setIsAcceptLoading] = useState(false);
  const [isDeclineLoading, setIsDeclineLoading] = useState(false);
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleAcceptRequest = async () => {
    setIsAcceptPopupVisible(false);
    setIsAcceptLoading(true);
    try {
      const token = await clientAuth?.currentUser?.getIdToken();
      if (!token) {
        throw new Error("User is not authenticated");
      }
      const response = await fetch(`${API_URL}/api/user/${item.type}/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: item.type === "interest" ? JSON.stringify({ interestId: item.uid }) : JSON.stringify({ requestedId: item.uid, requestType: item.requestType }),
      });

      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data.message || "Failed to accept request.");
        setIsErrorPopupVisible(true);
        return;
      }
      getNotifications();

    } catch (error) {
      setErrorMessage(error?.message || "Failed to accept request. Please try again.");
      setIsErrorPopupVisible(true);
    } finally {
      setIsAcceptLoading(false);
    }

  }

  const handleDeclineRequest = async () => {
    setIsDeclineLoading(true);
    try {
      const token = await clientAuth?.currentUser?.getIdToken();
      if (!token) {
        throw new Error("User is not authenticated");
      }
      const response = await fetch(`${API_URL}/api/user/${item.type}/decline`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: item.type === "interest" ? JSON.stringify({ interestId: item.uid }) : JSON.stringify({ requestedId: item.uid, requestType: item.requestType }),
      });

      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data.message || "Failed to decline request.");
        setIsErrorPopupVisible(true);
        return;
      }
      getNotifications();

      setSuccessMessage("You have declined the interest");
      setIsSuccessPopupVisible(true);

    } catch (error) {
      setErrorMessage(error?.message || "Failed to decline request. Please try again.");
      setIsErrorPopupVisible(true);
    } finally {
      setIsDeclineLoading(false);
    }
  }

  const handleViewProfile = () => {
    navigate(`/other-profile/${item.uid}`);
  }

  const handleReply = ({ chatId, name, profilePic }) => {
    if (window.innerWidth < 768) {
      navigate(`/messages/${chatId}`, {
        state: {
          name: name || "User",
          profilePic: profilePic,
        },
      });
    } else {
      navigate(`/messages?chatId=${chatId}&name=${name}&profilePic=${encodeURIComponent(profilePic)}`);
    }
  };

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
          {item.status === 'accepted'
            ? `You accepted ${item.displayDetails.name.split(" ")[0]}'s ${item.type === "interest" ? "interest" : "request for " + item.requestType}`
            : item.status === 'declined'
              ? `You declined ${item.displayDetails.name.split(" ")[0]}'s ${item.type === "interest" ? "interest" : "request for " + item.requestType}`
              : `${item.type === "interest" ? item.displayDetails.name.split(" ")[0] + " showed interest in you" : item.displayDetails.name.split(" ")[0] + " requested your " + item.requestType + " details"}`
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

      {/* Pending buttons */}

      {item.status === 'pending' ? (
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
            onClick={() => setIsDeclinePopupVisible(true)}
            disabled={isDeclineLoading || isAcceptLoading}
            style={{
              backgroundColor: '#F5F5F5',
              width: '48%',
              padding: '8px 0',
              borderRadius: 20,
              border: 'none',
              fontSize: 16,
              cursor: 'pointer',
            }}
          >
            Decline
          </button>

          <button
            onClick={item.type === "interest" ? () => handleReply({
              chatId: [`${clientAuth?.currentUser.uid}`, item.uid].sort().join("_"),
              name: item.displayDetails.name,
              profilePic: item.displayDetails.profilePic,
            }) : () => setIsAcceptPopupVisible(true)}
            disabled={isAcceptLoading || isDeclineLoading}
            style={{
              backgroundColor: '#FF025B',
              width: '48%',
              padding: '8px 0',
              borderRadius: 20,
              border: 'none',
              color: '#fff',
              fontSize: 16,
              cursor: 'pointer',
            }}
          >
            {item.type === "interest"
              ? 'Reply' : 'Accept'}
          </button>
        </div>
      ) : (
        item.type === 'interest' &&
        item.subType === 'received' &&
        item.status === 'accepted' && (
          <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 8,
          }}>
            <button
              onClick={handleViewProfile}
              style={{
                backgroundColor: '#F5F5F5',
                width: '100%',
                padding: '8px 0',
                borderRadius: 20,
                border: 'none',
                fontSize: 16,
                cursor: 'pointer',
              }}
            >
              View Profile
            </button>
          </div>
        )
      )}

      <PopupSheet
        show={isAcceptPopupVisible}
        onClose={() => setIsAcceptPopupVisible(false)}
        heading="Accept Request"
        data={item?.requestType ?
          `Are you sure you want to accept ${item.displayDetails.name.split(" ")[0]}'s request for ${item.requestType}?`
          :
          `Are you sure you want to accept ${item.displayDetails.name.split(" ")[0]}'s request?`}
        onYes={handleAcceptRequest}
      />

      <PopupSheet
        show={isDeclinePopupVisible}
        onClose={() => setIsDeclinePopupVisible(false)}
        heading="Decline Request"
        data={item?.requestType ?
          `Are you sure you want to decline ${item.displayDetails.name.split(" ")[0]}'s request for ${item.requestType}?`
          :
          `Are you sure you want to decline ${item.displayDetails.name.split(" ")[0]}'s request?`
        }
        onYes={handleDeclineRequest}
      />

      <YesNoModal
        show={isErrorPopupVisible}
        onClose={() => setIsErrorPopupVisible(false)}
        data={errorMessage}
        buttonText="Ok"
        
      />

      <YesNoModal
        show={isSuccessPopupVisible}
        onClose={() => setIsSuccessPopupVisible(false)}
        heading='Success'
        data={successMessage}
        buttonText="Ok"
        
      />
    </>
  );
};

export default Received;
