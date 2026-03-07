import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';
import { clientAuth } from '../../../firebase';
import profile1 from '../../assets/icons/profile1.svg';
import verifiedIcon from "../../assets/icons/verified.svg";
import useChats from '../../hooks/useChats';
import './ChatProfile.css';
import VerifiedPopup from '../../models/VerifiedPopup/VerifiedPopup';

const truncateMessage = (text, maxLength = 18) => {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

function getTimeAgo(timestampInSeconds) {
  const now = Date.now();
  const past = timestampInSeconds * 1000;
  const diff = now - past;

  const seconds = Math.floor(diff / 1000);
  if (seconds < 10) return `just now`;
  if (seconds < 60) return `${seconds}s`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo`;

  const years = Math.floor(days / 365);
  return `${years}y`;
}

const ProfileImageSkeleton = ({ user }) => {
  const [imageLoaded, setImageLoaded] = useState(false);


  return (
    <div className="chat-profile-image-container">
      {!imageLoaded && <Skeleton circle={true} height={50} width={50} />}
      <img
        src={user.receiverData.profilePic}
        alt={user.receiverData.name}
        className="chat-profile-image"
        style={{ display: imageLoaded ? "block" : "none" }}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageLoaded(false)}
      />
    </div>
  );
};


const ChatProfile = ({ setChatId, setName, setProfilePic }) => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifiedPopupVisible, setIsVerifiedPopupVisible] = useState(false);

  const [all, setAll] = useState(true);
  const [unread, setUnread] = useState(false);
  const [activeChatId, setActiveChatId] = useState(null);

  useChats(clientAuth?.currentUser?.uid, setData, setIsLoading);

  const handleClick = (chat) => {
    if (window.innerWidth < 768) {
      navigate(`/messages/${chat.id}`, {
        state: {
          name: chat?.receiverData?.name || "User",
          profilePic: chat?.receiverData?.profilePic,
        },
      });
    } else {
      setActiveChatId(chat.id);
      setChatId(chat.id);
      setName(chat?.receiverData?.name || "User");
      setProfilePic(chat?.receiverData?.profilePic || profile1);
    }
  };

  const filteredData = data.filter((item) => {
    if (all) return true;
    return item.lastSender !== clientAuth?.currentUser?.uid && !item.readByReceiver;
  });


  return (
    <>
      <div className="mobile-only">
        <div className="notification-header">
          <h2 className="chat-title">Messages</h2>
        </div>
      </div>
      <div className="chat-profile">
        <div className='desktop-only'>
          <h2 className="chat-title">Messages</h2>
        </div>

        <div className="chat-tabs">
          <button
            className={`tab ${all ? 'active' : ''}`}
            onClick={() => {
              setAll(true);
              setUnread(false);
            }}
          >
            All
          </button>
          <button
            className={`tab ${unread ? 'active' : ''}`}
            onClick={() => {
              setAll(false);
              setUnread(true);
            }}
          >
            Unread
          </button>
        </div>

        <div className="chat-profile-scrollable">
          <div className="chat-profile-list">
            {isLoading ?
              [1, 2, 3, 4, 5, 6, 7].map((item) => (
                <div key={item.toString()} className="list-header">
                  <Skeleton circle={true} height={50} width={50} />
                  <div className="list-info">
                    <p className="list-name">
                      <Skeleton width={100} />
                    </p>
                    <p className="list-subtext">
                      <Skeleton width={200} />
                    </p>
                  </div>
                </div>
              ))
              :
              filteredData.length === 0 ? (
                unread ?
                  <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <p>No unread messages</p>
                  </div>
                  :
                  <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <p>You have no messages</p>
                  </div>
              )
                :
                filteredData && filteredData.map((user, idx) => (
                  <div
                    key={idx}
                    className={`chat-profile-box ${activeChatId === user.id ? 'active-box' : ''}`}
                    onClick={() => user.deleted ? null : handleClick(user)}
                  >
                    <ProfileImageSkeleton user={user} />
                    <div className="chat-profile-info">
                      <p className={`chat-name ${user.lastSender !== clientAuth?.currentUser?.uid && !user.readByReceiver ? 'unread' : ''}`}>
                        {user.deleted ? "Deleted User" : user?.receiverData?.name}
                        {user?.receiverData?.isVerified &&
                          <img
                            src={verifiedIcon}
                            alt="Verified"
                            className="verified-icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsVerifiedPopupVisible(true);
                            }}
                          />
                        }
                      </p>
                      <p className={`chat-preview ${user.lastSender !== clientAuth?.currentUser?.uid && !user.readByReceiver ? 'unread' : ''}`}>
                        {truncateMessage(user?.lastMessage) || "No messages yet"} • {getTimeAgo(user?.lastTimestamp.seconds)}
                      </p>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
      <VerifiedPopup
        show={isVerifiedPopupVisible}
        onClose={() => setIsVerifiedPopupVisible(false)}
      />
    </>
  );
};

export default ChatProfile;
