import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clientAuth } from "../../../../firebase";
import { AppContext } from "../../../context/AppContext";
import "./PlanDetails.css";
import premiumIcon from "../../../assets/icons/PremiumIcon.svg";
import verifiedIcon from "../../../assets/icons/verified.svg";

function formatDateShortMonth(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const year = date.getFullYear();
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const month = monthNames[date.getMonth()];

  function getOrdinal(n) {
    if (n > 3 && n < 21) return 'th';
    switch (n % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }

  return `${day}${getOrdinal(day)} ${month} ${year}`;
}

function calculateRemainingDays(expiryDate) {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const timeDiff = expiry - today;
  const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  return daysRemaining >= 0 ? daysRemaining : 0;
}

const PlanDetails = () => {
  const { globalData } = useContext(AppContext);
  const navigate = useNavigate();

  const [premiumStartDate, setPremiumStartDate] = useState("");
  const [premiumEndDate, setPremiumEndDate] = useState("");
  const [daysRemaining, setDaysRemaining] = useState(0);

  const getPremiumStartDate = async () => {
    try {
      const tokenResult = await clientAuth?.currentUser?.getIdTokenResult();
      const formattedDate = tokenResult?.claims?.premiumStart
        ? formatDateShortMonth(tokenResult.claims.premiumStart)
        : "N/A";
      setPremiumStartDate(formattedDate);

      const formattedEndDate = tokenResult?.claims?.premiumExpiry
        ? formatDateShortMonth(tokenResult.claims.premiumExpiry)
        : "N/A";
      setPremiumEndDate(formattedEndDate);
      setDaysRemaining(calculateRemainingDays(tokenResult?.claims?.premiumExpiry));

    } catch {
      setPremiumStartDate("N/A");
      setPremiumEndDate("N/A");
    }
  };

  useEffect(() => {
    if (globalData.isPremiumUser)
      getPremiumStartDate();
  }, [globalData.isPremiumUser]);

  return (
    <>
      <div className="plan-details-content" style={{ margin: 0 }}>
        <div>
          <div className="profile-card-plan">
            <div className="edit-profile-box-two">
              <img src={clientAuth?.currentUser?.photoURL} alt="Profile" className="edit-profile-img" />
              <div className="user-details">
                <p className="username">
                  {clientAuth?.currentUser?.displayName}
                  {globalData?.isUserVerified && globalData?.isUserSelfieVerified &&
                    <>
                      <img
                        src={verifiedIcon}
                        alt="Verified"
                        style={{ width: "18px", height: "18px" }}
                      />
                      {globalData?.isPremiumUser && <img
                        src={premiumIcon}
                        alt="Premium"
                        style={{ width: "18px", height: "18px" }}
                      />}
                    </>}
                </p>
                <p className="userid">{clientAuth?.currentUser?.uid}</p>
              </div>
              <div className={`${globalData?.isPremiumUser ? "premium-plan" : "free-plan"}`} style={{ top: "24px" }}>
                {globalData?.isPremiumUser ? "Premium" : "Free plan"}
              </div>
            </div>

            <div className="plan-info-section">
              <div className="plan-row">
                <span className="label">Profile ID</span>
                <span className="value">{clientAuth?.currentUser?.uid}</span>
              </div>
              <div className="plan-row">
                <span className="label">Date of joining</span>
                <span className="value">{clientAuth?.currentUser?.metadata?.creationTime.slice(5, 16)}</span>
              </div>
              <div className="plan-row">
                <span className="label">Membership type</span>
                <span className="value">
                  {globalData.isPremiumUser
                    ? "Premium"
                    : "Free"}
                </span>
              </div>
              {globalData?.isPremiumUser &&
                <div className="plan-row">
                  <span className="label">Start Date</span>
                  <span className="value">
                    {premiumStartDate}
                  </span>
                </div>
              }
              <div className="plan-row">
                <span className="label">Expiry date</span>
                <span className="value">
                  {globalData.isPremiumUser
                    ? premiumEndDate
                    : "No expiry"}
                </span>
              </div>
              {globalData?.isPremiumUser &&
                <>
                  <div className="plan-row">
                    <span className="label">Interest/Request Left</span>
                    <span className="value">
                      {Number(globalData.interestAndRequestLimit) - Number(globalData.interestAndRequestSentCount)}
                    </span>
                  </div>
                  <div className="plan-row">
                    <span className="label">Valid Period</span>
                    <span className="value">
                      {daysRemaining} days remaining
                    </span>
                  </div>
                </>
              }
            </div>

            <div className="verification-section">
              {globalData.isUserVerified && globalData.isUserSelfieVerified && <div className="verified-section">
                <img src={verifiedIcon} alt="verified" className="verified-icon" />
                <span className="verified-text">Verified Profile</span>
              </div>}
              {globalData.isPremiumUser && <div className="verified-section">
                <img src={premiumIcon} alt="Premium" className="verified-icon" />
                <span className="verified-text">Premium Profile</span>
              </div>}
            </div>
          </div>
        </div>

        {globalData.isPremiumUser &&
          <span className="plan-limit-info">
            Send up to 50 interests/requests within 1 year. <br className="desktop-only" /> Renewal is required after reaching the limit or expiry, whichever comes first.
          </span>
        }
        {!globalData.isPremiumUser &&
          <button className="upgrade-btn" onClick={() => navigate("/premium")}>Upgrade to premium</button>
        }
      </div>
    </>
  );
};

export default PlanDetails;
