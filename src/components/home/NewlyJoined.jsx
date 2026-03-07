import { useContext, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";
import { Image } from "react-skeleton-image";
import premiumIcon from "../../assets/icons/PremiumIcon.svg";
import verifiedIcon from "../../assets/icons/verified.svg";
import getMatchBreakdown from "../../clientFunctions/getMatch";
import { AppContext } from "../../context/AppContext";
import MatchScoreDetails from "../../models/MatchingScoreDetails/MatchingScoreDetails";
import PremiumInfoPopup from "../../models/PremiumInfoPopup/PremiumInfoPopup";
import VerifiedPopup from "../../models/VerifiedPopup/VerifiedPopup";

export const CalculateScore = ({ item }) => {
  const { globalData } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);
  const [scoreModelVisible, setScoreModelVisible] = useState(false);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState({});
  const calculateScore = async () => {
    setIsLoading(true);
    if (!item?.partnerPreference) return 0;
    const { result, score } = await getMatchBreakdown(item?.partnerPreference, globalData);
    setResult(result);
    setScore(score);
    setIsLoading(false);
  }

  useEffect(() => {
    if (item?.partnerPreference) {
      calculateScore();
    }
  }, [item?.partnerPreference, globalData]);

  return (
    <>
      {isLoading ? (
        <Skeleton width={55} height={25} style={{ borderRadius: 30 }} />
      ) : (
        <button
          disabled={isLoading}
          onClick={() => setScoreModelVisible(true)}
          style={{
            fontSize: 16,
            color: "#15B700",
            padding: "4px 14px 2px 14px",
            borderRadius: 20,
            backgroundColor: "#F5F5F5",
            border: "none",
            display: "flex",
            alignItems: "center",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {score ? score : `0 / ${Object.keys(result).length}`}
        </button>
      )}
      <MatchScoreDetails
        visible={scoreModelVisible}
        data={item}
        score={score}
        globalData={globalData}
        result={result}
        onClose={() => setScoreModelVisible(false)}
      />
    </>
  )
}


function NewlyJoined({ data, preference = true }) {
  const navigate = useNavigate();
  const { globalData } = useContext(AppContext);
  const [name, setName] = useState("");
  const [isVerifiedPopupVisible, setIsVerifiedPopupVisible] = useState(false);
  const [isPremiumPopupVisible, setIsPremiumPopupVisible] = useState(false);

  const pressOnprofile = (uid) => {
    if (globalData?.admin)
      navigate(`/admin/other-profile/${uid}`);
    else
      navigate(`/otherProfile/${uid}`);
  };

  return (
    <div className="profiles-grid">
      {data.map((profile) => (
        <div key={profile.uid} className="profile-card">
          <div
            className="profile-image-container"
            onClick={() => pressOnprofile(profile.uid)}
          >
            <Image src={profile.profilePic} className="profile-image" />
          </div>
          <div className="profile-info">
            <div className="profile-header">
              <span className="profile-id">
                {profile.name}
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
              {preference && <CalculateScore item={profile} />}
            </div>
            <div className="profile-details">
              {profile.age} Yrs, {profile.occupation?.length > 16
                ? profile.occupation.slice(0, 16) + "... "
                : profile.occupation + ", "}
              {profile.location?.length > 10
                ? profile.location.slice(0, 8) + ".."
                : profile.location}
            </div>
          </div>
        </div>
      ))}
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
}

export default NewlyJoined;
