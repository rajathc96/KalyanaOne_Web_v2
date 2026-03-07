import { useContext, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-toastify';
import API_URL from '../../../config';
import { clientAuth } from '../../../firebase';
import shortlistImg from '../../assets/icons/check_circle.svg';
import shortlistedImg from '../../assets/icons/check_circle1.svg';
import interestSentImg from '../../assets/icons/heart-check2.svg';
import sendInterestImg from '../../assets/icons/heart_check.svg';
import partner_dark from "../../assets/icons/group_search_dark.svg";
import { AppContext } from '../../context/AppContext';
import UpdateLoader from '../../models/UpdateLoader/UpdateLoader';
import { CalculateScore } from '../home/NewlyJoined';
import Gallery from '../profile/Gallery';
import GalleryDesktop from '../profile/GalleryDesktop';
import premiumIcon from "../../assets/icons/PremiumIcon.svg";
import verifiedIcon from "../../assets/icons/verified.svg";
import VerifiedPopup from '../../models/VerifiedPopup/VerifiedPopup';
import PremiumInfoPopup from '../../models/PremiumInfoPopup/PremiumInfoPopup';
import YesNoModal from '../../models/YesNoModal/YesNoModal';
import { useNavigate } from 'react-router-dom';

const Photos = ({
  profileData,
  profileId,
  isLoading,
  setIsShortListRemoveModalVisible,
  isShortlistLoading,
  setIsShortlistLoading,
  isInterestSent,
  setIsInterestSent,
  isInterestLoading,
  isShortListed,
  setIsShortlisted,
  isInterestDeclined,
  scrollToPartnerPreference,
  admin = false
}) => {
  const navigate = useNavigate();
  const { globalData, setGlobalData } = useContext(AppContext);
  const [isInterestSending, setIsInterestSending] = useState(false);
  const [name, setName] = useState("");
  const [isVerifiedPopupVisible, setIsVerifiedPopupVisible] = useState(false);
  const [isPremiumPopupVisible, setIsPremiumPopupVisible] = useState(false);
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [errorHeading, setErrorHeading] = useState("Error");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSendInterest = async () => {
    if (!profileId) {
      setErrorMessage("Profile ID is required to send interest.");
      setIsErrorPopupVisible(true);
      return;
    }

    if (!globalData?.isPremiumUser) {
      setErrorHeading("Premium Feature");
      setErrorMessage("Upgrade to premium to send interest.");
      setIsErrorPopupVisible(true);
      return;
    }

    setIsInterestSending(true);
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
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setIsInterestSent(true);
    } catch (error) {
      setErrorMessage(error?.message || "An error occurred. Please try again.");
      setIsErrorPopupVisible(true);
    } finally {
      setIsInterestSending(false);
    }
  }

  const handleAddShortlist = async () => {
    if (!profileId) {
      setErrorMessage("Profile ID is required to add to shortlist.");
      setIsErrorPopupVisible(true);
      return;
    }

    setIsShortlistLoading(true);
    try {
      const token = await clientAuth?.currentUser?.getIdToken();
      if (!token) return;
      const res = await fetch(`${API_URL}/api/user/shortlist/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ shortlistId: profileId }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setGlobalData((prev) => ({
        ...prev,
        shortlistsData: [
          ...(prev.shortlistsData || [])
          , { uid: profileId, ...profileData.displayDetails }
        ],
      }));
      setIsShortlisted(true);
    } catch (error) {
      setErrorMessage(error?.message || "An error occurred. Please try again.");
      setIsErrorPopupVisible(true);
    } finally {
      setIsShortlistLoading(false);
    }
  }

  return (
    <div className={`others-photos ${isLoading ? "loading" : ""}`}>
      {isLoading ? (
        <div style={{ width: "440px", marginLeft: "10px" }}>
          <div className="others-photos-header" style={{ marginLeft: 0 }}>
            <div className='desktop-only'>
              <Skeleton height={20} width={200} style={{ marginBottom: 5 }} />
            </div>
            <Skeleton height={20} width={150} />
          </div>
          <div className='desktop-only'>
            <Skeleton height={480} width={"100%"} style={{ borderRadius: 10, margin: "20px 0" }} />
          </div>
          <div className='mobile-only'>
            <div style={{ width: "85%", display: "flex", flexDirection: "row", gap: "10px" }}>
              <div>
                <Skeleton height={220} width={180} style={{ borderRadius: 10, margin: "20px 0" }} />
              </div>
              <div>
                <Skeleton height={220} width={180} style={{ borderRadius: 10, margin: "20px 0" }} />
              </div>
            </div>
          </div>
          <div className='desktop-only'>
            <div className="photos-footer" style={{ display: "flex", justifyContent: "space-between", marginLeft: 0 }}>
              <Skeleton height={35} width={150} style={{ borderRadius: 10 }} />
              <Skeleton height={35} width={150} style={{ borderRadius: 10 }} />
              <Skeleton height={30} width={80} style={{ borderRadius: 10 }} />
            </div>
          </div>
          <div className='mobile-only'>
            <div className="photos-footer" style={{ width: "85%", display: "flex", justifyContent: "space-around", marginLeft: '-15px' }}>
              <Skeleton height={35} width={175} style={{ borderRadius: 10 }} />
              <Skeleton height={35} width={175} style={{ borderRadius: 10 }} />
            </div>
          </div>
        </div>
      ) : (
        <div className="others-photos-wrapper">
          <div className="others-photos-header">
            <div className='photos-header-top'>
              {/* <ArrowLeft className='back-arrow' onClick={() => navigate(-1)} /> */}
              <p className='others-profile-id'>{profileId}</p>
            </div>
            <p className='others-profile-name'>{profileData?.name || "Unknown"}
              {profileData?.displayDetails?.isVerified &&
                <>
                  <img
                    src={verifiedIcon}
                    alt="Verified"
                    style={{ cursor: "pointer", width: "18px", height: "18px" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsVerifiedPopupVisible(true);
                    }}
                  />
                  {profileData?.displayDetails?.role === "premium" && <img
                    src={premiumIcon}
                    alt="Premium"
                    style={{ cursor: "pointer", width: "18px", height: "18px" }}
                    onClick={(e) => {
                      setName(profileData.name);
                      e.stopPropagation();
                      setIsPremiumPopupVisible(true);
                    }}
                  />}
                </>}
            </p>
          </div>

          <div className='desktop-only'>
            <div>
              <div className="photos-carousel" >
                <GalleryDesktop profileData={profileData} />
              </div>
            </div>
          </div>

          <div className="mobile-only">
            <div className="scroll-view">
              <Gallery profileData={profileData} />
            </div>
          </div>

          {!admin && <div className="photos-footer">
            <button className="interest-btn" disabled={isInterestSending || isInterestLoading} onClick={isInterestSent || isInterestSending || isInterestLoading ? null : handleSendInterest}>
              <img
                src={isInterestSent ? interestSentImg : sendInterestImg}
                alt="interest"
                className="btn-icon"
              />
              <span>{isInterestSending || isInterestLoading ? <UpdateLoader /> : isInterestSent ? isInterestDeclined ? 'Interest declined' : 'Interest sent' : 'Send interest'}</span>
            </button>

            <button className="shortlist-btn" onClick={isShortListed ? () => setIsShortListRemoveModalVisible(true) : handleAddShortlist}>
              <img
                src={isShortListed ? shortlistedImg : shortlistImg}
                alt="shortlist"
                className="btn-icon"
              />
              <span>{isShortlistLoading ? <UpdateLoader /> : isShortListed ? 'Shortlisted' : 'Shortlist'}</span>
            </button>

            <div className="desktop-only">
              <CalculateScore item={profileData} />
            </div>

          </div>}
          <button className="interest-btn partner-preference-btn" onClick={scrollToPartnerPreference}>
            <img
              src={partner_dark}
              alt="partner-preference"
              className="btn-icon"
            />
            <span>Partner Preference</span>
          </button>
        </div>
      )}

      <VerifiedPopup
        show={isVerifiedPopupVisible}
        onClose={() => setIsVerifiedPopupVisible(false)}
      />
      <PremiumInfoPopup
        name={name}
        show={isPremiumPopupVisible}
        onClose={() => setIsPremiumPopupVisible(false)}
      />
      <YesNoModal
        show={isErrorPopupVisible}
        onClose={() => {
          setErrorHeading("Error");
          setIsErrorPopupVisible(false)
        }}
        heading={errorHeading}
        data={errorMessage}
        buttonText={errorHeading === "Premium Feature" ? "Upgrade" : "Ok"}
        showCancel={false}
        onYes={() => {
          setIsErrorPopupVisible(false);
          if (errorHeading === "Premium Feature") {
            navigate("/premium");
          }
        }}
      />
    </div >
  );
};

export default Photos;