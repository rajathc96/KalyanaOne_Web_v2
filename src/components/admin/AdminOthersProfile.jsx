import { useContext, useEffect, useState, useRef } from "react";
import { ArrowLeft, MoreHorizontal } from "react-feather";
import { useNavigate, useParams } from "react-router-dom";
import API_URL from "../../../config";
import { clientAuth } from "../../../firebase";
import { AppContext } from "../../context/AppContext";
import ProfileOptions from "../../models/ProfileOptions/ProfileOptions";
import { CalculateScore } from "../home/NewlyJoined";
import YesNoModal from "../../models/YesNoModal/YesNoModal";
import Photos from "../othersProfile/Photos";
import Info from "../othersProfile/Info";

const AdminOthersProfile = () => {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const { globalData } = useContext(AppContext);
  const [profileData, setProfileData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [showName, setShowName] = useState(false);
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [isShortlistLoading, setIsShortlistLoading] = useState(false);
  const partnerPrefRef = useRef(null);
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const scrollToPartnerPreference = () => {
    partnerPrefRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

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

  const getProfileData = async () => {
    if (!profileId) {
      setErrorMessage("Profile ID is required to fetch profile data.");
      setIsErrorPopupVisible(true);
      return;
    }
    setIsLoading(true);
    const tokenResult = await clientAuth.currentUser?.getIdTokenResult();
    try {
      const res = await fetch(`${API_URL}/api/admin/user/get`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenResult.token}`,
        },
        body: JSON.stringify({ profileId }),
      });
      const data = await res.json();
      if (res.ok) {
        setProfileData(data);
        setIsLoading(false);
      } else {
        throw new Error(data.error || "Failed to fetch profile data.");
      }

    } catch (error) {
      setErrorMessage(error?.message || "An error occurred. Please try again.");
      setIsErrorPopupVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProfileData();
  }, [profileId]);

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

              <Photos
                profileData={profileData}
                profileId={profileId}
                isLoading={isLoading}
                isShortlistLoading={isShortlistLoading}
                setIsShortlistLoading={setIsShortlistLoading}
                scrollToPartnerPreference={scrollToPartnerPreference}
                admin={true}
              />
              <Info
                profileData={profileData}
                horoscopeAccess={globalData.admin === true}
                contactAccess={globalData.admin === true}
                isPremiumUser={globalData.admin === true}
                isLoading={isLoading}
                profileId={profileId}
                partnerPrefRef={partnerPrefRef}
              />
            </div>
          </div>
        </>
      )}

      <ProfileOptions
        show={showProfileOptions}
        onClose={() => setShowProfileOptions(false)}
        profileId={profileId}
        profileData={profileData}
        showSendMessageButton={false}
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

export default AdminOthersProfile;
