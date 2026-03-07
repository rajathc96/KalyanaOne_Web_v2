import { useContext, useEffect, useRef, useState } from "react";
import { ArrowLeft, MoreHorizontal } from "react-feather";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import API_URL from "../../../config";
import { clientAuth } from "../../../firebase";
import profileImg from "../../assets/icons/profile1.svg";
import sendButton from "../../assets/icons/send-button.svg";
import verifiedIcon from "../../assets/icons/verified.svg";
import { AppContext } from "../../context/AppContext";
import useChatMessages from "../../hooks/useChatMessages";
import MessagePremiumPopup from "../../models/MessagePremiumPopup/MessagePremiumPopup";
import ProfileOptions from "../../models/ProfileOptions/ProfileOptions";
import "./Chat.css";
import MessageEtiquette from "./MessageEtiquette";
import VerifiedPopup from "../../models/VerifiedPopup/VerifiedPopup";

const converToValidDate = (timestamp) => {
  if (timestamp && typeof timestamp.toDate === "function")
    return timestamp.toDate();
  else if (timestamp instanceof Date) return timestamp;
  else return new Date();
};

function getTimeAgo(timestampInSeconds) {
  const now = Date.now();
  const past = timestampInSeconds * 1000;
  const diff = now - past;

  const seconds = Math.floor(diff / 1000);
  if (seconds < 10) return `just now`;
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;

  const years = Math.floor(days / 365);
  return `${years}y ago`;
}

const formatDateLabel = (date) => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (d1, d2) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, yesterday)) return "Yesterday";

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const Chat = ({
  chatId: propChatId,
  name: propName,
  profilePic: propProfilePic,
  setChatId,
}) => {
  const navigate = useNavigate();
  const { chatId: paramChatId } = useParams();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const chatId = propChatId || paramChatId || params.get("chatId");
  const name =
    propName ||
    location.state?.name ||
    decodeURIComponent(params.get("name")) ||
    "User";
  const profilePic =
    propProfilePic ||
    location.state?.profilePic ||
    params.get("profilePic") ||
    decodeURIComponent(params.get("profilePic")) ||
    profileImg;
  useEffect(() => {
    if (!chatId) return;

    const profileId = chatId
      .replace(clientAuth?.currentUser?.uid, "")
      .replace("_", "");
    setProfileId(profileId);
  }, [chatId]);

  const { globalData } = useContext(AppContext);
  const [userId, setUserId] = useState(clientAuth?.currentUser?.uid || "");
  const [profileId, setProfileId] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifiedPopupVisible, setIsVerifiedPopupVisible] = useState(false);

  const [isMessagePremiumVisible, setIsMessagePremiumVisible] = useState(
    globalData?.isPremiumUser ? false : true
  );

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useChatMessages(chatId, setMessages, setIsOnline, setLastSeen, setIsTyping);
  const [showProfileOptions, setShowProfileOptions] = useState(false);

  const getProcessedMessages = () => {
    const groupedMessages = [{ type: "etiquette" }];
    let lastDateLabel = "";

    const sorted = [...messages].sort((a, b) => a.timestamp - b.timestamp);

    for (let msg of sorted) {
      let x = converToValidDate(msg.timestamp);

      const dateLabel = formatDateLabel(x); // Convert Firestore Timestamp to Date
      if (dateLabel !== lastDateLabel) {
        groupedMessages.push({
          id: `date-${dateLabel}`,
          type: "date",
          label: dateLabel,
        });
        lastDateLabel = dateLabel;
      }
      groupedMessages.push({ ...msg, type: "message" });
    }
    return groupedMessages;
  };

  const [processedMessages, setProcessedMessages] = useState([]);

  useEffect(() => {
    const messagesWithType = getProcessedMessages();
    setProcessedMessages(messagesWithType);
    setIsLoading(false);
  }, [messages]);

  const bottomRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const scrollToBottom = () => {
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };

    // Give time for rendering before scroll
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100); // can be tuned

    return () => clearTimeout(timer);
  }, [processedMessages]);

  const [profileData, setProfileData] = useState(null);

  const getProfileData = async () => {
    if (!profileId) return;

    const tokenResult = await clientAuth.currentUser?.getIdTokenResult();
    try {
      const res = await fetch(`${API_URL}/api/user/get`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenResult.token}`,
        },
        body: JSON.stringify({ profileId, gender: globalData?.gender }),
      });
      const data = await res.json();
      if (res.ok) {
        console.log(data);
        setProfileData(data);
      } else {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile)
          navigate("/messages", { replace: true });
        else
          setChatId(null);
        toast.error(data.error || "Failed to fetch profile data.");
        return;
      }
    } catch (err) { }
  };

  useEffect(() => {
    getProfileData();
  }, [profileId]);

  const handleSendMessage = async () => {
    if (!globalData.isPremiumUser) return;

    const trimmed = inputText.trim();
    if (!trimmed) return;

    const localId = `local-${Date.now()}`;

    const newMessage = {
      id: localId,
      text: trimmed,
      senderId: userId,
      status: "sending",
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputText("");

    try {
      const res = await fetch(`${API_URL}/api/chat/send-message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await clientAuth?.currentUser?.getIdToken()}`,
        },
        body: JSON.stringify({
          chatId: chatId,
          messageText: trimmed,
        }),
      });

      if (!res.ok) throw new Error("Failed to send");

      const { timestamp } = await res.json(); // backend can return these

      // Update the message with status and real timestamp if needed
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === localId
            ? {
              ...msg,
              status: "delivered",
              timestamp: timestamp ? new Date(timestamp) : msg.timestamp,
            }
            : msg
        )
      );
    } catch (err) {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === localId ? { ...msg, status: "failed" } : msg
        )
      );
    }
  };

  if (!chatId) {
    return (
      <div className="chat-wrapper">
        <div
          className="chat-messages"
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p
            // className="no-chat-selected"
            style={{ fontSize: "18px", color: "#555", height: "10%" }}
          >
            Please select a chat to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-wrapper">
      <div className="chat-header">
        <div className="chat-user">
          <div className="mobile-only">
            <ArrowLeft
              className="back-arrow"
              onClick={() => navigate(-1)}
            />
          </div>
          <img
            src={profilePic}
            alt="user"
            className="chat-profile-img"
            onClick={() => navigate(`/other-profile/${profileId}`)}
          />
          <div>
            <p
              className="chat-user-name"
              onClick={() => navigate(`/other-profile/${profileId}`)}
            >
              {name}
              {profileData?.displayDetails?.isVerified &&
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
            {isOnline ? (
              <span style={{ color: "#15B700" }} className="chat-status">
                Online
              </span>
            ) : (
              !isNaN(lastSeen?.seconds) && (
                <span className="chat-status">
                  Last seen {getTimeAgo(lastSeen.seconds)}
                </span>
              )
            )}
          </div>
        </div>
        <MoreHorizontal
          className="back-arrow"
          color="#696969"
          onClick={() => setShowProfileOptions(true)}
        />
      </div>
      <div
        className={`chat-messages ${!globalData.isPremiumUser ? "height-increase" : ""
          }`}
        ref={chatContainerRef}
      >
        {processedMessages.map((msg, index) => {
          const isMe = msg?.senderId === userId;
          return msg.type === "etiquette" ? (
            <MessageEtiquette key={msg.id} />
          ) : msg.type === "date" ? (
            <div
              key={msg.id}
              style={{
                alignItems: "center",
                margin: "10px 0",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  padding: "4px 10px",
                  borderRadius: "10px",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "400",
                    color: "#696969",
                  }}
                >
                  {msg?.label}
                </span>
              </div>
            </div>
          ) : (
            <div
              key={msg.id}
              style={{
                marginBottom: "5px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  alignSelf: isMe ? "flex-end" : "flex-start",
                  backgroundColor: isMe ? "#F5F5F5" : "#FF025B",
                  padding: "10px 5px 5px 10px",
                  paddingLeft: isMe ? "15px" : "10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5px",
                  borderBottomLeftRadius: "10px",
                  borderBottomRightRadius: "10px",
                  borderTopRightRadius: isMe
                    ? index === processedMessages.length - 1
                      ? 0
                      : "10px"
                    : "10px",
                  borderTopLeftRadius: isMe
                    ? "10px"
                    : index === processedMessages.length - 1
                      ? 0
                      : "10px",
                  maxWidth: "80%",
                  width: "fit-content",
                }}
              >
                <p
                  style={{
                    fontSize: "16px",
                    color: isMe ? "#000" : "#fff",
                    paddingRight: "5px",
                    margin: 0,
                  }}
                >
                  {msg.text?.length > 10 ? msg.text : msg.text + "          "}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <span
                    style={{
                      fontSize: "10px",
                      color: isMe ? "#555" : "#fff",
                      marginRight: "5px",
                    }}
                  >
                    {converToValidDate(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>
              </div>

              {isMe && msg.status && (
                <div
                  style={{
                    alignSelf: "flex-end",
                    marginTop: "2px",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <span style={{ fontSize: "10px", color: "#555" }}>
                    {msg.status}
                  </span>
                </div>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {!globalData.isPremiumUser && (
        <div className="premium-notification">
          Become a Premium member to communicate further
          <button className="upgrade-btn" onClick={() => navigate("/premium")}>
            Upgrade to premium
          </button>
        </div>
      )}

      <div
        className={`chat-input-container ${!globalData.isPremiumUser ? "disabled" : ""
          }`}
      >
        <input
          type="text"
          placeholder={`Message to ${name}...`}
          pattern=".*"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          data-form-type="other"
          enterKeyHint="send"
          inputMode="text"
          style={{
            WebkitAppearance: 'none',
            fontSize: '16px',
            border: 'none',
            outline: 'none'
          }}
        />
        {window.innerWidth > 600 ?
          <button
            className="chat-send-btn"
            onClick={handleSendMessage}
            disabled={!globalData.isPremiumUser}
          >
            Send
          </button>
          :
          <img
            src={sendButton}
            alt="Send"
            className="chat-send-icon"
            onClick={handleSendMessage}
            disabled={!globalData.isPremiumUser}
          />
        }
      </div>
      <MessagePremiumPopup
        show={isMessagePremiumVisible}
        onClose={() => setIsMessagePremiumVisible(false)}
        name={name}
      />
      <ProfileOptions
        show={showProfileOptions}
        onClose={() => setShowProfileOptions(false)}
        profileId={profileId}
        showSendMessageButton={false}
        profileData={profileData}
      />
      <VerifiedPopup
        show={isVerifiedPopupVisible}
        onClose={() => setIsVerifiedPopupVisible(false)}
      />
    </div>
  );
};

export default Chat;
