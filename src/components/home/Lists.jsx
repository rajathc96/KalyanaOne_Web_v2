import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";
import premiumIcon from "../../assets/icons/PremiumIcon.svg";
import verifiedIcon from "../../assets/icons/verified.svg";
import convertHeightToInches from "../../clientFunctions/convertHeightToInches";
import PremiumInfoPopup from "../../models/PremiumInfoPopup/PremiumInfoPopup";
import VerifiedPopup from "../../models/VerifiedPopup/VerifiedPopup";
import "./Lists.css";

const Lists = ({ data }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const [isVerifiedPopupVisible, setIsVerifiedPopupVisible] = useState(false);
  const [isPremiumPopupVisible, setIsPremiumPopupVisible] = useState(false);

  useEffect(() => {
    if (!data) return;    
    setIsLoading(false);
  }, [data]);

  const pressOnprofile = (uid) => {
    navigate(`/otherProfile/${uid}`);
  };

  return (
    <div className="list-page">
      {isLoading ? (
        <Skeleton count={10} height={70} style={{ marginBottom: 18 }} />
      ) : (
        data.map((profile, idx) => (
          <div key={idx} className="list-card" onClick={() => pressOnprofile(profile.uid)}>
            <div className="list-header">
              <img src={profile.profilePic} alt={profile.name} className="avatar" />
              <div className="list-info">
                <span className="profile-id">
                  {profile.uid}
                  {profile?.isVerified &&
                    <>
                      <img
                        src={verifiedIcon}
                        alt="Verified"
                        className="verified-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsVerifiedPopupVisible(true);
                        }}
                      />
                      {profile?.role === "premium" && <img
                        src={premiumIcon}
                        alt="Premium"
                        className="verified-icon"
                        onClick={(e) => {
                          setName(profile.name);
                          e.stopPropagation();
                          setIsPremiumPopupVisible(true);
                        }}
                      />}
                    </>}
                </span>
                <p className="list-subtext">
                  {profile.age} Yrs, {convertHeightToInches(profile.height) + ", "}
                  {profile.location?.length > 10
                    ? profile.location.slice(0, 8) + ".."
                    : profile.location}
                </p>
              </div>
            </div>
          </div>
        ))
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

    </div>
  );
};

export default Lists;
