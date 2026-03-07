import { useContext } from 'react';
import { ArrowLeft } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import notVerifiedIcon from '../../../assets/icons/not-verified.svg';
import verifiedIcon from '../../../assets/icons/verified.svg';
import downloadQr from '../../../assets/images/KalyanaOne_App_DOwnload_qr.svg';
import googlePlayBadge from '../../../assets/images/google-play-badge.svg';
import { AppContext } from '../../../context/AppContext';
import './ProfileVerification.css';

const ProfileVerification = () => {
  const { globalData } = useContext(AppContext);
  const navigate = useNavigate();
  return (
    <>
      <div className="mobile-only">
        <div className='headers-top'>
          <ArrowLeft className='back-arrow' onClick={() => navigate(-1)} />
          <p className='header-title'>Profile Verification</p>
        </div>
      </div>
      <div className="verification-wrapper">
        <div className='desktop-only'>
          <h2
            className="account-title"
            style={{ borderBottom: '1px solid #ccc', paddingBottom: '8px', marginBottom: '16px' }}
          >Profile Verification</h2>
        </div>
        <div className="status-icon">
          <img
            src={globalData?.isUserVerified === true && globalData?.isUserSelfieVerified === true ? verifiedIcon : notVerifiedIcon}
            alt={globalData?.isUserVerified === true && globalData?.isUserSelfieVerified === true ? "Verified" : "Not Verified"}
          />
        </div>

        <p className="not-verified-text">
          {globalData?.isUserVerified === true && globalData?.isUserSelfieVerified === true ?
            "Your profile is verified" :
            "Your profile is not verified"
          }
        </p>
        {globalData?.isUserVerified !== true || globalData?.isUserSelfieVerified !== true ? <>
          <p className="verify-subtext">
            Verify your profile to get <span>more visibility and trust</span>
          </p>

          <div className='download-qr-box'>
            <p className='download-text'>Please download our mobile app<br /> for identity verification</p>
            <div className='desktop-only'>
              <img src={downloadQr} alt="" />
            </div>
            <div
              className="mobile-only"
              role="button"
              tabIndex={0}
              aria-label="Get it on Google Play"
              onClick={() => {
                window.open(
                  "https://play.google.com/store/apps/details?id=com.OztaLabs.KalyanaOne&hl=en",
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  window.open(
                    "https://play.google.com/store/apps/details?id=com.OztaLabs.KalyanaOne&hl=en",
                    "_blank",
                    "noopener,noreferrer"
                  );
                }
              }}
              style={{ cursor: "pointer" }}
            >
              <img src={googlePlayBadge} alt="Get it on Google Play" />
            </div>
          </div>
        </> : null}
      </div>
    </>
  );
};

export default ProfileVerification;
