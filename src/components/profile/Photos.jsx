import { useState } from 'react'; // Adjust the path as necessary
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';
import { clientAuth } from '../../../firebase';
import groupSearch from '../../assets/icons/group_search.svg';
import personEdit from '../../assets/icons/person_edit.svg';
import Gallery from './Gallery';
import GalleryDesktop from './GalleryDesktop';
import './Photos.css';
import premiumIcon from "../../assets/icons/PremiumIcon.svg";
import verifiedIcon from "../../assets/icons/verified.svg";
import VerifiedPopup from '../../models/VerifiedPopup/VerifiedPopup';
import PremiumInfoPopup from '../../models/PremiumInfoPopup/PremiumInfoPopup';

const Photos = ({ profileData }) => {
  const navigate = useNavigate();
  const [isVerifiedPopupVisible, setIsVerifiedPopupVisible] = useState(false);
  const [isPremiumPopupVisible, setIsPremiumPopupVisible] = useState(false);

  const handleNavigation = (path) => {
    if (window.innerWidth < 768) {
      navigate(`/settings/${path}`);
    } else {
      navigate("/settings", {
        state: { activePanel: path }
      });
    }
  }

  return (
    <div className="photos">
      {!profileData?.photos ? (
        <div style={{ width: "640px", marginLeft: "15px", marginTop: "10px", borderRadius: "10px" }}>
          <div className="others-photos-header" style={{ marginLeft: 0 }}>
            <div className='desktop-only'>
              <Skeleton height={20} width={200} style={{ marginBottom: 5 }} />
            </div>
            <Skeleton height={30} width={100} />
          </div>
          <div className='desktop-only'>
            <Skeleton height={450} width={"70%"} style={{ borderRadius: 10, margin: "20px 0" }} />
          </div>
          <div className='mobile-only'>
            <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
              <div className='photo-gallery-skeleton'>
                <Skeleton width={"100%"} height={"100%"} />
              </div>
              <div className='photo-gallery-skeleton'>
                <Skeleton height={"100%"} width={"100%"} />
              </div>
            </div>
          </div>
          <div className='desktop-only'>
            <div style={{ width: "63%", display: "flex", justifyContent: "space-between", marginLeft: 0, gap: "10px" }}>
              <Skeleton height={35} width={185} style={{ borderRadius: 10 }} />
              <Skeleton height={35} width={175} style={{ borderRadius: 10 }} />
            </div>
          </div>
          <div className='mobile-only'>
            <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
              <div className='photo-button-skeleton'>
                <Skeleton height={"100%"} width={"100%"} />
              </div>
              <div className='photo-button-skeleton'>
                <Skeleton height={"100%"} width={"100%"} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="photos-header">
            <h3 style={{ display: "flex", alignItems: "center", gap: "5px" }}>{clientAuth?.currentUser?.displayName}
              {profileData?.isUserVerified && profileData?.isUserSelfieVerified ?
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
                  {profileData?.isPremiumUser === true && <img
                    src={premiumIcon}
                    alt="Premium"
                    style={{ cursor: "pointer", width: "18px", height: "18px" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPremiumPopupVisible(true);
                    }}
                  />}
                </>
                :
                <>
                  <span
                    className="verify-popup-btn"
                    style={{
                      padding: "4px 8px",
                      width: "fit-content",
                      fontSize: "10px",
                      marginLeft: "5px",
                    }}
                    onClick={() => handleNavigation("profile-verification")}
                  >
                    Verify Profile
                  </span>
                </>
              }
            </h3>
            <p>{clientAuth?.currentUser?.uid}</p>
          </div>

          <div className='desktop-only'>
            <div className='photos-carousel'>
              <GalleryDesktop profileData={profileData} />
            </div>
          </div>

          <div className="mobile-only">
            <div className="scroll-view">
              <Gallery profileData={profileData} />
            </div>
          </div>


          <div className="user-profile-photos-footer">
            <button className="preference-btn" onClick={() => handleNavigation('partner-preference')}>
              <img
                src={groupSearch}
                alt="preferences"
                className="btn-icon"
              />
              <span>Set Preferences</span>
            </button>

            <button className="edit-profile-btn" onClick={() => handleNavigation('edit-profile')}>
              <img
                src={personEdit}
                alt="edit"
                className="btn-icon"
              />
              <span>Edit Profile</span>
            </button>

          </div>
        </>
      )}
      <VerifiedPopup
        own={true}
        show={isVerifiedPopupVisible}
        onClose={() => setIsVerifiedPopupVisible(false)}
      />
      <PremiumInfoPopup
        name={"You"}
        show={isPremiumPopupVisible}
        onClose={() => setIsPremiumPopupVisible(false)}
      />
    </div>
  );
};

export default Photos;