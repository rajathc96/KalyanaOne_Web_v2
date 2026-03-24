import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import API_URL from "../../../config.js";
import { clientAuth } from "../../../firebase.js";
import layer from "../../assets/icons/layers.svg";
import bellIcon from "../../assets/icons/list.svg";
import YesNoModal from "../../models/YesNoModal/YesNoModal.jsx";
import Lists from "../home/Lists.jsx";
import NewlyJoined from "../home/NewlyJoined.jsx";
import NewlyJoinedSkeleton from "../home/NewlyJoinedSkeleton.jsx";

const tabs = [
  { label: "Valmiki", value: "valmiki" },
  { label: "Brahmin", value: "brahmin" },
  { label: "Lingayath", value: "veerashaiva-lingayath" },
  { label: "Vokkaliga", value: "vokkaliga" },
  { label: "Kuruba", value: "kuruba" },
  { label: "Lamani", value: "lamani" },
];

function AllUsers() {
  const contentRef = useRef(null);

  const [data, setData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorPopupVisible, setErrorPopupVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [displayType, setDisplayType] = useState("layer");
  const [activeCaste, setActiveCaste] = useState("valmiki");

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const cached = localStorage.getItem(`admin_${activeCaste}`);
      if (cached) {
        const { data, cachedAt } = JSON.parse(cached);
        if (data && data?.length) {
          const ttl = 10 * 60 * 1000;
          const now = Date.now();
          if (now - cachedAt < ttl) {
            setData(data || []);
            return;
          }
        }
        localStorage.removeItem(`admin_${activeCaste}`);
      }

      const res = await fetch(`${API_URL}/api/admin/users/${activeCaste}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await clientAuth?.currentUser?.getIdToken()}`,
        },
      });

      const responseData = await res.json();
      console.log(responseData);

      if (!res.ok) {
        setData([]);
        return;
      }

      const usersData = responseData || [];

      usersData.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));

      if (usersData?.length === 0) {
        setData([]);
        return;
      }
      setData(usersData);
      const payload = {
        data: usersData,
        cachedAt: Date.now(),
      };
      localStorage.setItem(`admin_${activeCaste}`, JSON.stringify(payload));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [activeCaste]);

  const [touchStartX, setTouchStartX] = useState(null);

  const handleSwipe = (endX) => {
    if (touchStartX === null || endX === null) return;

    const distance = endX - touchStartX;

    if (Math.abs(distance) > 150) {
      const currentIndex = tabs.findIndex(tab => tab.value === activeTab.value);

      if (distance < 0 && currentIndex < tabs.length - 1) {
        const nextTab = tabs[currentIndex + 1];
        setActiveTab(nextTab);
        setActiveCaste(nextTab.value);
      } else if (distance > 0 && currentIndex > 0) {
        const prevTab = tabs[currentIndex - 1];
        setActiveTab(prevTab);
        setActiveCaste(prevTab.value);
      }
    }
  };

  const tabRefs = useRef([]);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [touchedTab, setTouchedTab] = useState(null);

  const [underlineStyle, setUnderlineStyle] = useState({
    width: 0,
    transform: "translateX(0px)",
  });

  const updateUnderline = () => {
    const index = tabs.findIndex(tab => tab.value === activeTab.value);
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

  const copyInviteText = async (message) => {
    if (!window.isSecureContext) {
      throw new Error("Clipboard access requires HTTPS.");
    }

    if (!navigator?.clipboard?.writeText) {
      throw new Error("Clipboard is not supported in this browser.");
    }

    await navigator.clipboard.writeText(message);
  };

  const onShare = async () => {
    const shareData = {
      title: "KalyanaOne Invitation",
      text: `Hello,

You’re invited to join KalyanaOne, a community-based matrimony platform built for individuals who are serious about marriage.

KalyanaOne focuses on genuine profiles, a simple experience, and a respectful, family-friendly approach without spam, pressure, or unwanted follow-ups.

As an early member, you can create an account and explore premium features for ₹99 per year.

👉 Create your account here: https://kalyanaone.com`,
      url: `https://kalyanaone.com`,
    };

    const fullMessage = `${shareData.text}\n${shareData.url}`;
    const isWebShareSupported = typeof navigator?.share === "function";
    const canSharePayload =
      typeof navigator?.canShare === "function"
        ? navigator.canShare({
          title: shareData.title,
          text: shareData.text,
          url: shareData.url,
        })
        : true;

    if (isWebShareSupported && canSharePayload) {
      try {
        await navigator.share(shareData);
      } catch (shareError) {
        if (shareError?.name === "AbortError") {
          return;
        }

        try {
          await copyInviteText(fullMessage);
          toast.success("Invite Link copied!");
        } catch (error) {
          setErrorMessage("Sharing failed: " + error.message);
          setErrorPopupVisible(true);
        }
      }
    } else {
      try {
        await copyInviteText(fullMessage);
          toast.success("Invite Link copied!");
      } catch (error) {
        setErrorMessage("Could not copy message: " + error.message);
        setErrorPopupVisible(true);
      }
    }
  };


  return (
    <>
      <div
        className="mobile-top-icon"
        onClick={() =>
          setDisplayType(displayType === "lists" ? "layer" : "lists")
        }
      >
        <img
          src={displayType === "lists" ? layer : bellIcon}
          alt="Toggle View"
          className="sidebar-image"
        />
      </div>
      <div className="mobile-only">
        <div className="notification-header">
          <h2 className="chat-title">KalyanaOne</h2>
          <span className="caste-code">
            {clientAuth?.currentUser?.uid.split("").slice(1, 4).join("")}
          </span>
        </div>
      </div>
      <div className="header-tabs">
        <div className="header-center">
          <div className="nav-tabs">
            {tabs.map((tab, index) => (
              <div
                key={index}
                ref={(el) => (tabRefs.current[index] = el)}
                onClick={() => {
                  setActiveTab(tab);
                  setActiveCaste(tab.value);
                }}
                onTouchStart={() => setTouchedTab(tab)}
                onTouchEnd={() => setTouchedTab(null)}
                className={`nav-tab ${activeTab.value === tab.value ? "active" : ""} ${touchedTab?.value === tab.value ? "hovered" : ""}`}
              >
                {tab.label}
              </div>
            ))}
            <div className="underline" style={underlineStyle}></div>
          </div>
        </div>
      </div>
      {isLoading ? <NewlyJoinedSkeleton /> :
        <div
          className="content"
          ref={contentRef}
          onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            handleSwipe(e.changedTouches[0].clientX);
          }}
        >
          {data && data.length > 0 ?
            <div key={activeTab} className="tab-content-fade">
              {(displayType === "layer" ? (
                <NewlyJoined data={data} preference={false} />
              ) : (
                <Lists data={data} />
              ))}
            </div>
            :
            <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <div className="no-profiles-container">
                <p
                  style={{
                    fontWeight: "500",
                    fontSize: 20,
                    color: "#333",
                    textAlign: "center",
                    marginBottom: 12,
                    lineHeight: 1.4,
                  }}
                >
                  No Profiles Yet <br /> from Your Community
                </p>
                <p
                  style={{
                    fontSize: 16,
                    fontWeight: 400,
                    color: "#666",
                    textAlign: "center",
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  We're currently onboarding <br /> members from your community
                </p>

                <button
                  onClick={onShare}
                  aria-label="Share this profile"
                  style={{
                    marginTop: 16,
                    width: "90%",
                    backgroundColor: "#FF025B",
                    padding: "12px 50px",
                    borderRadius: 25,
                    border: "none",
                    color: "#fff",
                    fontSize: 16,
                    letterSpacing: 0.5,
                    cursor: "pointer",
                    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
                    marginBottom: 12,
                  }}
                >
                  Invite Now
                </button>

                <p
                  style={{
                    fontSize: 16,
                    fontWeight: 400,
                    color: "#666",
                    textAlign: "center",
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  Invite friend / family member from <br /> your community to join KalyanaOne.
                </p>
              </div>
            </div>
          }
        </div>}

      <YesNoModal
        show={errorPopupVisible}
        onClose={() => setErrorPopupVisible(false)}
        buttonText="Ok"
        data={errorMessage}
      />

    </>
  );
}

export default AllUsers;
