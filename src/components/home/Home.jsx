import { useContext, useEffect, useRef, useState } from "react";
import { ChevronDown } from 'react-feather';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API_URL from "../../../config.js";
import { clientAuth } from "../../../firebase.js";
import partnerPreference from "../../assets/icons/group_search_color.svg";
import layer from "../../assets/icons/layers.svg";
import bellIcon from "../../assets/icons/list.svg";
import { AppContext } from "../../context/AppContext.jsx";
import CastePopup from "../../models/CastePopup/CastePopup.jsx";
import YesNoModal from "../../models/YesNoModal/YesNoModal.jsx";
import "./Home.css";
import Lists from "./Lists";
import Matches from "./Matches";
import NewlyJoined from "./NewlyJoined.jsx";
import NewlyJoinedSkeleton from "./NewlyJoinedSkeleton.jsx";
import Shortlisted from "./Shortlisted.jsx";
import CasteFilterBottomSheet from "../../models/CasteFilterBottomSheet/CasteFilterBottomSheet.jsx";

const castefilters = [
  { label: "Veerashaiva Lingayath", value: "LGY" },
  { label: "Valmiki", value: "VLM" },
  { label: "Brahmin", value: "BRM" },
  { label: "Vokkaliga", value: "VKG" },
  { label: "Kuruba", value: "KRB" },
  { label: "Lamani", value: "LMN" }
];

const filters = [
  { label: "All", value: "all" },
  { label: "Age", value: "age" },
  { label: "Height", value: "height" },
  { label: "Income", value: "annualIncome" },
  { label: "Occupation", value: "occupation" },
  { label: "Living In", value: "location" },
  { label: "Education", value: "highestQualification" },
];

export const DATA_CACHE_KEY = `usersDataCache_${clientAuth.currentUser?.uid || 'guest'}`;
const tabs = ["joined", "matches", "shortlisted"];

function Home() {
  const { globalData } = useContext(AppContext);
  const navigate = useNavigate();
  const contentRef = useRef(null);

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isDataFetchLoading, setIsDataFetchLoading] = useState(false);
  const [isCastePopupVisible, setIsCastePopupVisible] = useState(false);
  const [successPopupVisible, setSuccessPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorHeading, setErrorHeading] = useState("Error");
  const [errorPopupVisible, setErrorPopupVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [displayType, setDisplayType] = useState("layer");
  const [showCasteFilter, setShowCasteFilter] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [preferences, setPreferences] = useState(globalData?.partnerPreference || {});

  useEffect(() => {
    setPreferences(globalData?.partnerPreference || {});
  }, [globalData?.partnerPreference]);

  const [matchFilter, setMatchFilter] = useState("all");
  const [matchCaste, setMatchCaste] = useState("all");

  const [renderableProfiles, setRenderableProfiles] = useState({});

  const handleSetCaste = (value) => {
    if (matchCaste === value) {
      setMatchCaste("all");
      setMatchFilter("all");
      setFilteredData(data);
      return;
    }
    setMatchCaste(value);
    setMatchFilter("all");
    setFilteredData(data.filter(profile => profile.casteCode === value));
  };

  const handleSetFilter = (value) => {
    switch (value) {
      case "age":
        if (preferences.ageFrom && preferences.ageTo && preferences?.ageFrom !== undefined && preferences?.ageTo !== undefined) {
          setMatchFilter(value);
        } else {
          setErrorHeading("Age Preference Required");
          setErrorMessage("Please set your age preferences first.");
          setErrorPopupVisible(true);
        }
        break;
      case "height":
        if (preferences.heightFrom && preferences.heightTo && preferences?.heightFrom !== undefined && preferences?.heightTo !== undefined) {
          setMatchFilter(value);
        } else {
          setErrorHeading("Height Preference Required");
          setErrorMessage("Please set your height preferences first.");
          setErrorPopupVisible(true);
        }
        break;
      case "occupation":
        if (preferences?.occupation !== undefined && preferences?.occupation.length > 0) {
          setMatchFilter(value);
        } else {
          setErrorHeading("Occupation Preference Required");
          setErrorMessage("Please set your occupation preferences first.");
          setErrorPopupVisible(true);
        }
        break;
      case "location":
        if (preferences?.location !== undefined && preferences?.location.length > 0) {
          setMatchFilter(value);
        }
        else {
          setErrorHeading("Location Preference Required");
          setErrorMessage("Please set your location preferences first.");
          setErrorPopupVisible(true);
        }
        break;
      case "annualIncome":
        if (preferences.annualIncomeFrom && preferences?.annualIncomeFrom !== undefined) {
          setMatchFilter(value);
        } else {
          setErrorHeading("Income Preference Required");
          setErrorMessage("Please set your annual income preferences first.");
          setErrorPopupVisible(true);
        }
        break;
      case "highestQualification":
        if (preferences?.highestQualification !== undefined && preferences?.highestQualification.length > 0) {
          setMatchFilter(value);
        } else {
          setErrorHeading("Education Preference Required");
          setErrorMessage("Please set your education preferences first.");
          setErrorPopupVisible(true);
        }
        break;
      default:
        setMatchFilter(value);
        break;
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const cached = localStorage.getItem(DATA_CACHE_KEY);
      if (cached) {
        const { data, cachedAt } = JSON.parse(cached);
        if (data && data?.length) {
          const ttl = 10 * 60 * 1000;
          const now = Date.now();
          if (now - cachedAt < ttl) {
            setData(data || []);
            setFilteredData(data || []);
            return;
          }
        }
        localStorage.removeItem(DATA_CACHE_KEY);
      }

      const res = await fetch(`${API_URL}/home`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await clientAuth?.currentUser?.getIdToken()}`,
        },
      });

      const responseData = await res.json();

      if (!res.ok) {
        setData([]);
        setFilteredData([]);
        return;
      }

      const usersData = responseData.usersData || [];
      if (usersData?.length === 0) {
        setData([]);
        setFilteredData([]);
        return;
      }
      setData(usersData);
      setFilteredData(usersData);

      const payload = {
        data: usersData,
        cachedAt: Date.now(),
      };
      localStorage.setItem(DATA_CACHE_KEY, JSON.stringify(payload));

    } catch (error) { }
    finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePartnerPreferenceNavigation = () => {
    if (window.innerWidth < 768) {
      navigate(`/settings/partner-preference`);
    } else {
      navigate("/settings", {
        state: { activePanel: "partner-preference" }
      });
    }
  }

  const [touchStartX, setTouchStartX] = useState(null);

  const handleSwipe = (endX) => {
    if (touchStartX === null || endX === null) return;

    const distance = endX - touchStartX;

    if (Math.abs(distance) > 150) {
      const currentIndex = tabs.indexOf(activeTab);

      if (distance < 0 && currentIndex < tabs.length - 1) {
        setActiveTab(tabs[currentIndex + 1]);
      } else if (distance > 0 && currentIndex > 0) {
        setActiveTab(tabs[currentIndex - 1]);
      }
    }
  };

  const tabRefs = useRef([]);
  const [activeTab, setActiveTab] = useState("joined");
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

  const handleNavigation = (path) => {
    if (window.innerWidth < 768) {
      navigate(`/settings/${path}`);
    } else {
      navigate("/settings", {
        state: { activePanel: path }
      });
    }
  }

  const onShare = async () => {
    const shareData = {
      title: "KalyanaOne Invitation",
      text: `Hello,

You’re invited to join KalyanaOne, a community-based matrimony platform built for individuals who are serious about marriage.

KalyanaOne focuses on genuine profiles, a simple experience, and a respectful, family-friendly approach without spam, pressure, or unwanted follow-ups.

As an early member, you can create an account and explore premium features free for 3 months.

👉 Create your account here: https://kalyanaone.com`,
      url: `https://kalyanaone.com`,
    };

    if (navigator.canShare) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        setErrorMessage("Sharing failed: " + error.message);
        setErrorPopupVisible(true);
      }
    } else {
      const fullMessage = `${shareData.text}\n${shareData.url}`;
      try {
        await navigator.clipboard.writeText(fullMessage);
        toast.info("Profile message copied to clipboard!");
      } catch (error) {
        setErrorMessage("Could not copy message: " + error.message);
        setErrorPopupVisible(true);
      }
    }
  };

  if (isLoading) {
    return <NewlyJoinedSkeleton />;
  }

  return (
    <>
      {activeTab === "joined" && (
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
      )}
      <div className="mobile-only">
        <div className="notification-header">
          <h2 className="chat-title">KalyanaOne</h2>
          <span className="caste-code" onClick={() => setIsCastePopupVisible(true)}>
            {clientAuth?.currentUser?.uid.split("").slice(1, 4).join("")}
          </span>
        </div>
      </div>
      <div className="header-tabs">
        <div className="header-center">
          <div className="nav-tabs">
            {tabs.map((tab, index) => (
              <div
                key={tab}
                ref={(el) => (tabRefs.current[index] = el)}
                onClick={() => setActiveTab(tab)}
                onTouchStart={() => setTouchedTab(tab)}
                onTouchEnd={() => setTouchedTab(null)}
                className={`nav-tab ${activeTab === tab ? "active" : ""} ${touchedTab === tab ? "hovered" : ""
                  }`}
              >
                {tab === "joined" &&
                  <div style={{ display: "flex" }}>
                    Newly joined
                    {
                      activeTab === "joined" && window.innerWidth < 600 &&
                      <ChevronDown onClick={() => setShowCasteFilter(true)} style={{ marginTop: "-5px", paddingTop: "5px" }} />
                    }
                  </div>
                }
                {tab === "matches" &&
                  <div style={{ display: "flex" }}>
                    Matches
                    {
                      activeTab === "matches" && window.innerWidth < 600 &&
                      <ChevronDown onClick={() => setShowFilter(true)} style={{ marginTop: "-5px", paddingTop: "5px" }} />
                    }
                  </div>
                }
                {tab === "shortlisted" && "Shortlisted"}
              </div>
            ))}
            <div className="underline" style={underlineStyle}></div>
          </div>
        </div>
      </div>
      <div
        className="content"
        ref={contentRef}
        onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          handleSwipe(e.changedTouches[0].clientX);
        }}
      >
        <div
          className={`filter-bar ${activeTab === "matches" ? "filter-bar-visible" : "filter-bar-hidden"}`}
          style={{ marginBottom: "10px" }}
        >
          <div style={{ color: "#696969", fontSize: "14px", marginRight: "70px" }}>Filters are based on your partner preference</div>
        </div>
        <div className={`filter-bar ${activeTab === "matches" ? "filter-bar-visible" : "filter-bar-hidden"}`}>
          {filters.map((filter) => (
            <button
              key={filter.value}
              className={`filter-pill ${matchFilter === filter.value ? "active" : ""}`}
              onClick={() => handleSetFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
          <button
            className="filter-pill"
            onClick={handlePartnerPreferenceNavigation}
          >
            <img src={partnerPreference} alt="Partner Preference" />
          </button>
        </div>
        <div
          className={`filter-bar ${activeTab === "joined" ? "filter-bar-visible" : "filter-bar-hidden"}`}
          style={{ marginBottom: "4px" }}
        />
        <div
          className={`filter-bar ${activeTab === "joined" ? "filter-bar-visible" : "filter-bar-hidden"}`}
          style={{ marginBottom: 0 }}
        >
          {castefilters.map((filter) => (
            <button
              key={filter.value}
              className={`filter-pill ${matchCaste === filter.value ? "active" : ""}`}
              onClick={() => handleSetCaste(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>
        {data && data.length > 0 ?
          <div key={activeTab} className="tab-content-fade">
            {activeTab === "joined" &&
              (displayType === "layer" ? (
                <NewlyJoined data={filteredData} />
              ) : (
                <Lists data={filteredData} />
              ))}
            {activeTab === "matches" &&
              <Matches
                data={data}
                showFilter={showFilter}
                setShowFilter={setShowFilter}
                matchFilter={matchFilter}
                setMatchFilter={(value) => handleSetFilter(value)}
                renderableProfiles={renderableProfiles}
                setRenderableProfiles={setRenderableProfiles}
              />
            }
            {activeTab === "shortlisted" && <Shortlisted />}
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
        {isDataFetchLoading && (
          <div style={{ textAlign: "center", padding: "10px", color: "#555", marginBottom: "50px" }}>
            Loading more profiles...
          </div>
        )}
      </div>
      <CastePopup
        show={isCastePopupVisible}
        onClose={() => setIsCastePopupVisible(false)}
      />

      <CasteFilterBottomSheet
        visible={showCasteFilter}
        onClose={() => setShowCasteFilter(false)}
        filter={matchCaste}
        setFilter={handleSetCaste}
      />

      <YesNoModal
        show={successPopupVisible}
        onClose={() => setSuccessPopupVisible(false)}
        heading="Success!"
        data="You have successfully activated early access to premium features for 3 months."
      />

      <YesNoModal
        show={errorPopupVisible}
        onClose={() => {
          setErrorHeading("Error");
          setErrorPopupVisible(false)
        }}
        heading={errorHeading}
        buttonText={errorHeading === "Verification Required" ? "Verify Now" : errorHeading.includes("Preference Required") ? "Go to Preferences" : "Ok"}
        onYes={() => {
          if (errorHeading === "Verification Required") {
            handleNavigation("profile-verification");
          } else if (errorHeading.includes("Preference Required")) {
            handleNavigation("partner-preference");
          } else {
            setErrorHeading("Error");
            setErrorPopupVisible(false);
          }
        }}
        data={errorMessage}
      />

    </>
  );
}

export default Home;
