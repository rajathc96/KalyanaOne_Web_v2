import { useEffect, useRef, useState } from "react";
import API_URL from "../../../config";
import { clientAuth } from "../../../firebase";
import Interests from "./Interests";
import "./Notification.css";
import Profiles from "./Profiles";
import ProfilesSkeleton from "./ProfilesSkeleton";
import Requests from "./Requests";

const tabs = ["all", "interests", "requests"];

const Notification = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [interests, setInterests] = useState(false);
  const [requests, setRequests] = useState(false);
  const [notificationsData, setNotificationsData] = useState([]);

  const getNotifications = async () => {
    const token = await clientAuth?.currentUser?.getIdToken();
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/user/notifications`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Failed to fetch notifications");

      const data = result.data || [];
      data.sort((a, b) => b?.timeStamp?._seconds - a?.timeStamp?._seconds);
      setNotificationsData(data);
    } catch (error) { }
    finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const requestsData = notificationsData.filter(item => item.type === "request");
    setRequests(requestsData);
    const interestsData = notificationsData.filter(item => item.type === "interest");
    setInterests(interestsData);
  }, [notificationsData]);


  useEffect(() => {
    getNotifications();
  }, []);

  // const [touchStartX, setTouchStartX] = useState(null);

  // const handleSwipe = (endX) => {
  //   if (touchStartX === null || endX === null) return;

  //   const distance = endX - touchStartX;

  //   if (Math.abs(distance) > 50) {
  //     const currentIndex = tabs.indexOf(activeTab);

  //     if (distance < 0 && currentIndex < tabs.length - 1) {
  //       setActiveTab(tabs[currentIndex + 1]);
  //     } else if (distance > 0 && currentIndex > 0) {
  //       setActiveTab(tabs[currentIndex - 1]);
  //     }
  //   }
  // };


  const tabRefs = useRef([]);
  const [activeTab, setActiveTab] = useState("all");
  const [touchedTab, setTouchedTab] = useState(null);

  const [underlineStyle, setUnderlineStyle] = useState({
    width: 0,
    transform: "translateX(0px)",
  });

  const updateUnderline = () => {
    const index = tabs.indexOf(activeTab);
    const tabEl = tabRefs.current[index];
    if (tabEl) {
      const { offsetLeft, offsetWidth } = tabEl;
      setUnderlineStyle({
        width: `${offsetWidth}px`,
        transform: `translateX(${offsetLeft}px)`,
      });
    }
  };

  useEffect(() => {
    updateUnderline();
  }, [activeTab]);

  useEffect(() => {
    const timeout = setTimeout(updateUnderline, 50);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", updateUnderline);
    return () => window.removeEventListener("resize", updateUnderline);
  }, [activeTab]);

  return (
    <>
      <div className="mobile-only">
        <div className="notification-header">
          <h2 className="chat-title">Notifications</h2>
        </div>
      </div>
      <div className="header-tabs">
        <div className="header-center">
          <div className="nav-tabs" style={{ justifyContent: "space-around" }}>
            {tabs.map((tab, index) => (
              <div
                key={tab}
                ref={(el) => (tabRefs.current[index] = el)}
                onClick={() => setActiveTab(tab)}
                onTouchStart={() => setTouchedTab(tab)}
                onTouchEnd={() => setTouchedTab(null)}
                className={`nav-tab ${activeTab === tab ? "active" : ""
                  } ${touchedTab === tab ? "hovered" : ""}`}
              >
                {tab === "all" && "All"}
                {tab === "interests" && "Interests"}
                {tab === "requests" && "Requests"}
              </div>
            ))}
            <div className="underline" style={underlineStyle}></div>
          </div>
        </div>
      </div>
      <div className="notification-page">
        <div className="notification-content">
          {isLoading ?
            <ProfilesSkeleton />
            : (
              <>
                {activeTab === "all" && <Profiles data={notificationsData} setNotificationsData={setNotificationsData} getNotifications={getNotifications} />}
                {activeTab === "interests" && <Interests data={interests} setNotificationsData={setNotificationsData} getNotifications={getNotifications} />}
                {activeTab === "requests" && <Requests data={requests} setNotificationsData={setNotificationsData} getNotifications={getNotifications} />}
              </>
            )}
        </div>
      </div>
    </>
  );
};

export default Notification;
