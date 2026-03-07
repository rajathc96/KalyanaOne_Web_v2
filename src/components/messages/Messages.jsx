// Messages.jsx
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Chat from "./Chat";
import ChatProfile from "./ChatProfile";
import "./Messages.css";
import useIsMobile from "./useIsMobile"; // utility hook to detect mobile

const Messages = () => {
  const isMobile = useIsMobile();
  const [chatId, setChatId] = useState(null);
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState("");

  return (
    <div className="messages-container">
      {isMobile ? (
        <Routes>
          <Route path="/" element={<ChatProfile />} />
          <Route
            path=":chatId"
            element={<Chat name={name} profilePic={profilePic} />}
          />
        </Routes>
      ) : (
        <>
          <ChatProfile
            setChatId={setChatId}
            setName={setName}
            setProfilePic={setProfilePic}
          />
          <Chat
            chatId={chatId}
            name={name}
            profilePic={profilePic}
            setChatId={setChatId}
          />
        </>
      )}
    </div>
  );
};

export default Messages;
