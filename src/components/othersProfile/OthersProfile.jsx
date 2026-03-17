import { useContext, useEffect, useLayoutEffect, useState, useRef } from "react";
import { ArrowLeft, MoreHorizontal } from "react-feather";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import API_URL from "../../../config";
import { clientAuth } from "../../../firebase";
import cancelIcon from "../../assets/icons/cancel.svg";
import leftArrow from "../../assets/icons/leftarrow.svg";
import rightArrow from "../../assets/icons/rightarrow.svg";
import shortlistRemove from '../../assets/icons/shortlist-remove.svg';
import { AppContext } from "../../context/AppContext";
import PopupSheet from "../../models/PopupSheet/PopupSheet";
import ProfileOptions from "../../models/ProfileOptions/ProfileOptions";
import { DATA_CACHE_KEY } from "../home/Home";
import { CalculateScore } from "../home/NewlyJoined";
import Info from "./Info";
import "./OthersProfile.css";
import Photos from "./Photos";
import YesNoModal from "../../models/YesNoModal/YesNoModal";
import InterestAndRequestLimitPopup from "../../models/InterestAndRequestLimitPopup/InterestAndRequestLimitPopup";
import InterestSendPremiumPopup from "../../models/InterestSendPremiumPopup/InterestSendPremiumPopup";

const OthersProfile = () => {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const { globalData, setGlobalData } = useContext(AppContext);
  const [profileData, setProfileData] = useState({});
  const [isLoading, setIsLoading] = useState(!true);
  const [isInterestSent, setIsInterestSent] = useState(false);
  const [isInterestLoading, setIsInterestLoading] = useState(false);
  const [isInterestDeclined, setIsInterestDeclined] = useState(false);
  const [horoscopeAccess, setHoroscopeAccess] = useState(false);
  const [contactAccess, setContactAccess] = useState(false);
  const [showName, setShowName] = useState(false);
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [isShortListRemoveModalVisible, setIsShortListRemoveModalVisible] =
    useState(false);
  const [isShortlistLoading, setIsShortlistLoading] = useState(false);
  const [isShortListed, setIsShortlisted] = useState(false);
  const partnerPrefRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const timerRef = useRef(null);
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isSendInterestLimitReachedModalVisible, setIsSendInterestLimitReachedModalVisible] = useState(false);
  const [isSendInterestPremiumPopupVisible, setIsSendInterestPremiumPopupVisible] = useState(false);

  const scrollToPartnerPreference = () => {
    partnerPrefRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  useEffect(() => {
    setIsShortlisted(
      globalData?.shortlistsData?.some((item) => item.uid === profileId)
    );
  }, [globalData, profileId]);

  const handleRemoveShortlist = async () => {
    setIsShortListRemoveModalVisible(false);
    if (!profileId) {
      setErrorMessage("Profile ID is required to remove from shortlist.");
      setIsErrorPopupVisible(true);
      return;
    }

    setIsShortlistLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/user/shortlist/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await clientAuth?.currentUser?.getIdToken()}`,
        },
        body: JSON.stringify({ shortlistId: profileId }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Something went wrong. Please try again.");

      const shorlists = globalData?.shortlistsData?.filter(
        (item) => item.uid !== profileId
      );
      setGlobalData((prev) => ({
        ...prev,
        shortlistsData: shorlists,
      }));
      setIsShortlisted(false);
    } catch (error) {
      setErrorMessage(error?.message || "An error occurred. Please try again.");
      setIsErrorPopupVisible(true);
    } finally {
      setIsShortlistLoading(false);
    }
  };

  const getUsersFromCache = () => {
    try {
      const cached = localStorage.getItem(DATA_CACHE_KEY);
      if (cached) {
        const { data } = JSON.parse(cached);
        return data || [];
      }
    } catch (error) { }
    return [];
  };

  const navigateToProfile = (direction) => {
    const users = getUsersFromCache();
    if (users.length === 0) {
      return;
    }

    const currentIndex = users.findIndex((user) => user.uid === profileId);
    if (currentIndex === -1) {
      setErrorMessage("Current profile not found in the list");
      setIsErrorPopupVisible(true);
      return;
    }

    let nextIndex;
    if (direction === "next") {
      nextIndex = currentIndex + 1;
      if (nextIndex >= users.length) {
        toast.info("This is the last profile");
        return;
      }
    } else {
      nextIndex = currentIndex - 1;
      if (nextIndex < 0) {
        toast.info("This is the first profile");
        return;
      }
    }

    const nextUser = users[nextIndex];
    navigate(`/otherProfile/${nextUser.uid}`);
  };

  const handlePreviousProfile = () => {
    navigateToProfile("previous");
  };

  const handleNextProfile = () => {
    navigateToProfile("next");
  };

  const getProfileData = async () => {
    if (!profileId) {
      setErrorMessage("Profile ID is required to fetch profile data.");
      setIsErrorPopupVisible(true);
      return;
    }
    setIsLoading(true);
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
      if (res.ok)
        setProfileData(data);
      else
        throw new Error(data?.error || "Failed to fetch profile data.");

    } catch (error) {
      setErrorMessage(error?.message || "An error occurred. Please try again.");
      setIsErrorPopupVisible(true);
    }
    finally {
      setIsLoading(false);
    }
  };

  const getPremiumData = async () => {
    if (!profileId) return;
    const tokenResult = await clientAuth.currentUser?.getIdTokenResult();

    if (isInterestSent === true) {
      try {
        const response = await fetch(`${API_URL}/api/user/get-premium-data`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenResult.token}`,
          },
          body: JSON.stringify({ profileId: profileId }),
        });
        const data = await response.json();

        if (response.ok) {
          if (data.access !== undefined && data.access === false) {
            setHoroscopeAccess(false);
            setContactAccess(false);
            return;
          } else {
            setHoroscopeAccess(data.access.horoscope);
            setContactAccess(data.access.contact);

            setProfileData((prev) => ({
              ...prev,
              horoscopeDetails: data?.userData.horoscope,
              contactDetails: data?.userData.contact,
            }));
          }
        }
      } catch (error) { }
    }
  }

  const checkIsInterestSent = async () => {
    if (!profileId) return;
    const token = await clientAuth?.currentUser?.getIdToken();
    if (!token) return;
    setIsInterestLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/user/interest/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ interestId: profileId }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsInterestSent(data.exists);
        setIsInterestDeclined(data.status === "declined");
      }

    } catch (e) { }
    finally {
      setIsInterestLoading(false);
    }
  }

  useEffect(() => {
    checkIsInterestSent();
    getProfileData();
  }, [profileId]);

  useEffect(() => {
    if (isInterestSent === true) {
      getPremiumData();
    }
  }, [isInterestSent]);

  useEffect(() => {
    if (!profileId) return;

    const clearTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    const startTimer = () => {
      clearTimer();
      timerRef.current = setTimeout(async () => {
        const token = await clientAuth?.currentUser?.getIdToken();
        if (!token) return;
        try {
          await fetch(`${API_URL}/api/user/view-count`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ profileId }),
          });
        } catch (error) {
          // No-op: view count failure should not block profile view.
        }
      }, 10000);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        startTimer();
      } else {
        clearTimer();
      }
    };

    if (document.visibilityState === "visible") {
      startTimer();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearTimer();
    };
  }, [profileId]);

  useLayoutEffect(() => {
    const handleScroll = () => {
      const scrollTop = scrollContainerRef.current?.scrollTop;
      if (scrollTop > 20) {
        setShowName(true);
      } else {
        setShowName(false);
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [profileData]);

  return (
    <div
      className="others-profile"
      style={{ pointerEvents: isLoading ? "none" : "auto" }}
    >
      {!isLoading && Object.keys(profileData).length === 0 ? (
        <div
          style={{
            width: "100%",
            height: window.innerWidth < 600 ? "80vh" : "80%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "20px",
            color: "#888",
          }}
        >
          No Profile data available
        </div>
      ) : (
        <>
          <div className="arrow-btn left-arrow" onClick={handlePreviousProfile}>
            <img src={leftArrow} alt="Previous" />
          </div>

          <div className="profile-scroll-wrapper" ref={scrollContainerRef}>
            <div className="profile-container">
              <div
                className={`outer-photos-header ${showName ? "border" : ""}`}
              >
                <div className="outer-photos-header-top ">
                  <ArrowLeft
                    className="back-arrow"
                    onClick={() => navigate(-1)}
                  />
                  <p className="others-profile-id">
                    {profileId}{" "}
                    {showName && `• ${profileData?.name.slice(0, 9).trim() || "Unknown"}`}
                  </p>
                </div>
                <div className="" style={{ display: "flex", alignItems: "center" }}>
                  <CalculateScore item={profileData} />&nbsp;&nbsp;
                  <MoreHorizontal
                    className="back-arrow"
                    color="#696969"
                    onClick={() => setShowProfileOptions(true)}
                  />
                </div>
              </div>

              {/* <div className="others-photos-container"> */}
              <Photos
                profileData={profileData}
                profileId={profileId}
                isLoading={isLoading}
                setIsShortListRemoveModalVisible={
                  setIsShortListRemoveModalVisible
                }
                isInterestSent={isInterestSent}
                setIsInterestSent={setIsInterestSent}
                isInterestLoading={isInterestLoading}
                setIsInterestLoading={setIsInterestLoading}
                isInterestDeclined={isInterestDeclined}
                setIsInterestDeclined={setIsInterestDeclined}
                isShortlistLoading={isShortlistLoading}
                setIsShortlistLoading={setIsShortlistLoading}
                isShortListed={isShortListed}
                setIsShortlisted={setIsShortlisted}
                scrollToPartnerPreference={scrollToPartnerPreference}
                setIsSendInterestLimitReachedModalVisible={setIsSendInterestLimitReachedModalVisible}
                setIsSendInterestPremiumPopupVisible={setIsSendInterestPremiumPopupVisible}
              />
              {/* </div>
              <div> */}
              <Info
                profileData={profileData}
                horoscopeAccess={horoscopeAccess}
                contactAccess={contactAccess}
                isPremiumUser={globalData.isPremiumUser}
                isLoading={isLoading}
                profileId={profileId}
                partnerPrefRef={partnerPrefRef}
              />
              {/* </div> */}
            </div>
          </div>
          <div className={`cancel-button ${isLoading ? "loading" : ""}`}>
            <img src={cancelIcon} alt="Close" onClick={() => navigate("/home")} />
            <img src={rightArrow} alt="Next" onClick={handleNextProfile} />
          </div>
        </>
      )}

      <ProfileOptions
        show={showProfileOptions}
        onClose={() => setShowProfileOptions(false)}
        profileId={profileId}
        profileData={profileData}
      />

      <PopupSheet
        show={isShortListRemoveModalVisible}
        onClose={() => setIsShortListRemoveModalVisible(false)}
        heading="Remove from Shortlist"
        data={`Remove ${profileData?.name || "profile"} from your shortlist?`}
        onYes={handleRemoveShortlist}
        img={shortlistRemove}
      />

      <InterestAndRequestLimitPopup
        show={isSendInterestLimitReachedModalVisible}
        onClose={() => setIsSendInterestLimitReachedModalVisible(false)}
        type="interests"
      />

      <InterestSendPremiumPopup
        show={isSendInterestPremiumPopupVisible}
        onClose={() => setIsSendInterestPremiumPopupVisible(false)}
      />

      <YesNoModal
        show={isErrorPopupVisible}
        onClose={() => setIsErrorPopupVisible(false)}
        heading="Error"
        data={errorMessage}
        buttonText="Ok"
      />

    </div>
  );
};

export default OthersProfile;
