import { useCallback, useContext, useEffect, useState, useRef } from "react";
import { ArrowLeft, MoreHorizontal } from "react-feather";
import { useNavigate, useParams } from "react-router-dom";
import API_URL from "../../../config";
import { clientAuth } from "../../../firebase";
import shortlistRemove from '../../assets/icons/shortlist-remove.svg';
import { AppContext } from "../../context/AppContext";
import PopupSheet from "../../models/PopupSheet/PopupSheet";
import ProfileOptions from "../../models/ProfileOptions/ProfileOptions";
import { CalculateScore } from "../home/NewlyJoined";
import Info from "./Info";
import "./OthersProfile.css";
import Photos from "./Photos";
import YesNoModal from "../../models/YesNoModal/YesNoModal";
import InterestAndRequestLimitPopup from "../../models/InterestAndRequestLimitPopup/InterestAndRequestLimitPopup";
import InterestSendPremiumPopup from "../../models/InterestSendPremiumPopup/InterestSendPremiumPopup";

const OthersProfileSingle = () => {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const { globalData, setGlobalData } = useContext(AppContext);
  const [profileData, setProfileData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [horoscopeAccess, setHoroscopeAccess] = useState(false);
  const [contactAccess, setContactAccess] = useState(false);

  const [isInterestSent, setIsInterestSent] = useState(false);
  const [isInterestLoading, setIsInterestLoading] = useState(false);
  const [isInterestDeclined, setIsInterestDeclined] = useState(false);

  const [showName, setShowName] = useState(false);
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [isShortListRemoveModalVisible, setIsShortListRemoveModalVisible] =
    useState(false);
  const [isShortlistLoading, setIsShortlistLoading] = useState(false);
  const [isShortListed, setIsShortlisted] = useState(false);
  const partnerPrefRef = useRef(null);
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

  const handleSendInterest = async () => {
    if (!profileId) {
      setErrorMessage("Profile ID is required to send interest.");
      setIsErrorPopupVisible(true);
      return;
    }

    if (!globalData?.isPremiumUser) {
      setIsSendInterestPremiumPopupVisible(true);
      return;
    }

    if (globalData?.interestAndRequestSentCount >= globalData?.interestAndRequestLimit) {
      setIsSendInterestLimitReachedModalVisible(true);
      return;
    }

    setIsInterestLoading(true);
    try {
      const token = await clientAuth?.currentUser?.getIdToken();
      if (!token) return;

      const res = await fetch(`${API_URL}/api/user/interest/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ interestId: profileId }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data?.code === "LIMIT_REACHED") {
          await clientAuth?.currentUser?.getIdTokenResult(true);
          await clientAuth?.currentUser?.reload();
          setIsSendInterestLimitReachedModalVisible(true);
          return;
        }
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setIsInterestSent(true);
      if (data?.code === "DOWNGRADE") {
        await clientAuth?.currentUser?.getIdTokenResult(true);
        await clientAuth?.currentUser?.reload();
      } else {
        setGlobalData((prev) => ({
          ...prev,
          interestAndRequestSentCount: (prev.interestAndRequestSentCount || 0) + 1,
        }));
      }
    } catch (error) {
      setErrorMessage(error?.message || "An error occurred. Please try again.");
      setIsErrorPopupVisible(true);
    } finally {
      setIsInterestLoading(false);
    }
  };
  // }, [globalData?.interestAndRequestLimit, globalData?.interestAndRequestSentCount, globalData?.isPremiumUser, profileId, setGlobalData]);

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
  const timerRef = useRef(null);

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
        } catch {
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

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.querySelector(".profile-scroll-wrapper")?.scrollTop;
      if (scrollTop > 20) {
        setShowName(true);
      } else {
        setShowName(false);
      }
    };

    const scrollContainer = document.querySelector(".profile-scroll-wrapper");
    scrollContainer?.addEventListener("scroll", handleScroll);

    return () => scrollContainer?.removeEventListener("scroll", handleScroll);
  }, []);

  const getProfileData = useCallback(async () => {
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
  }, [globalData?.gender, profileId]);

  const getPremiumData = useCallback(async () => {
    if (!profileId) return;
    const tokenResult = await clientAuth.currentUser?.getIdTokenResult();

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
    } catch {
      // No-op: failure to fetch premium data should not block profile view.
    }
  }, [profileId]);

  const checkIsInterestSent = useCallback(async () => {
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

    } catch {
      // No-op: failure to check interest status should not block profile view.
    }
    finally {
      setIsInterestLoading(false);
    }
  }, [profileId]);

  useEffect(() => {
    checkIsInterestSent();
    getProfileData();
  }, [checkIsInterestSent, getProfileData]);

  useEffect(() => {
    if (isInterestSent === true) {
      getPremiumData();
    }
  }, [getPremiumData, isInterestSent]);

  return (
    <div className="others-profile single">
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
          <div className="profile-scroll-wrapper">
            <div className="profile-container single">
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
                    {showName && `• ${profileData?.name || "Unknown"}`}
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
                handleSendInterest={handleSendInterest}
                setIsShortListRemoveModalVisible={
                  setIsShortListRemoveModalVisible
                }
                isInterestSent={isInterestSent}
                isInterestLoading={isInterestLoading}
                isInterestDeclined={isInterestDeclined}
                isShortlistLoading={isShortlistLoading}
                setIsShortlistLoading={setIsShortlistLoading}
                isShortListed={isShortListed}
                setIsShortlisted={setIsShortlisted}
                scrollToPartnerPreference={scrollToPartnerPreference}
              />
              {/* </div>
              <div> */}
              <Info
                profileData={profileData}
                horoscopeAccess={horoscopeAccess}
                contactAccess={contactAccess}
                globalData={globalData}
                isLoading={isLoading}
                profileId={profileId}
                partnerPrefRef={partnerPrefRef}
                isInterestSent={isInterestSent}
                isInterestLoading={isInterestLoading}
                handleSendInterest={handleSendInterest}
              />
              {/* </div> */}
            </div>
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

      <YesNoModal
        show={isErrorPopupVisible}
        onClose={() => setIsErrorPopupVisible(false)}
        heading="Error"
        data={errorMessage}
        buttonText="Ok"

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
    </div>
  );
};

export default OthersProfileSingle;
