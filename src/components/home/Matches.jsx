import { useContext, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';
import { Image } from 'react-skeleton-image';
import premiumIcon from "../../assets/icons/PremiumIcon.svg";
import verifiedIcon from "../../assets/icons/verified.svg";
import getMatchBreakdown from '../../clientFunctions/getMatch';
import getSingleMatchBreakdown from '../../clientFunctions/getSingleMatch';
import { AppContext } from '../../context/AppContext';
import MatchesBottomSheet from '../../models/MatchesBottomSheet/MatchesBottomSheet';
import PremiumInfoPopup from '../../models/PremiumInfoPopup/PremiumInfoPopup';
import VerifiedPopup from '../../models/VerifiedPopup/VerifiedPopup';
import "./Matches.css";
import { CalculateScore } from './NewlyJoined';

function Matches({ data, showFilter, setShowFilter, matchFilter, setMatchFilter, renderableProfiles, setRenderableProfiles }) {

  const { globalData } = useContext(AppContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [isVerifiedPopupVisible, setIsVerifiedPopupVisible] = useState(false);
  const [isPremiumPopupVisible, setIsPremiumPopupVisible] = useState(false);

  const pressOnprofile = (uid) => {
    navigate(`/otherProfile/${uid}`);
  };

  const [loading, setLoading] = useState(true);

  const filteredProfiles = data.filter((profile) => renderableProfiles[profile.uid])

  useEffect(() => {
    const checkMatchScoreForProfiles = async () => {
      if (!Array.isArray(data)) return;
      setLoading(true);

      if (data.length === 0) {
        setRenderableProfiles({});
        setLoading(false);
        return;
      }

      const shouldRender = {};

      await Promise.all(
        data.map(async (profile) => {
          if (matchFilter && matchFilter !== "all") {
            const value = await getSingleMatchBreakdown(profile.partnerPreference, matchFilter, globalData);
            shouldRender[profile.uid] = value;
          } else {
            const breakdown = await getMatchBreakdown(profile.partnerPreference, globalData);
            shouldRender[profile.uid] = breakdown.matchedScore !== 0;
          }
        })
      );

      setRenderableProfiles(shouldRender);
      setLoading(false);
    };

    checkMatchScoreForProfiles();
  }, [data, matchFilter]);

  if (loading && window.innerWidth < 768) {
    return (
      <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", marginTop: "10px", gap: "12px" }}>
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} style={{ width: "96%", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div className="mobile-only" style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
              <Skeleton width={170} height={225} style={{ borderRadius: "12px" }} />
              <Skeleton width={170} height={225} style={{ borderRadius: "12px" }} />
            </div>
            <Skeleton width={window.innerWidth - 40} px height={60} style={{ borderRadius: "12px" }} />
          </div>
        ))}
      </div>
    )
  }


  return (
    <div className='matches'>
      {filteredProfiles.length > 0 ?
        <div className="profiles-grid">
          {filteredProfiles
            .map((profile) => (
              <div key={profile.uid} className="profile-card">
                <div className="profile-image-container" onClick={() => pressOnprofile(profile.uid)}>
                  <div style={{ width: "100%", position: "relative" }}>
                    {!profile.photos[0] ?
                      <div className="matches-photo-skelton">
                        <Skeleton width={"100%"} height={"100%"} style={{ borderRadius: "12px" }} />
                      </div>
                      :
                      <Image src={profile.photos[0]} className="profile-image" />
                    }
                  </div>

                  <div className="mobile-only" style={{ width: "100%" }}>
                    {window.innerWidth < 600 &&
                      !profile.photos[1] ?
                      <div className="matches-photo-skelton">
                        <Skeleton borderRadius={10} width={"100%"} height={"100%"} />
                      </div>
                      :
                      <Image src={profile.photos[1]} className="profile-image" />
                    }
                  </div>
                </div>
                <div className="profile-info">
                  <div className="profile-header">
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
                    <CalculateScore item={profile} />
                  </div>
                  <div className="profile-details">
                    {profile.age} Yrs,
                    {profile.occupation?.length > 16
                      ? profile.occupation.slice(0, 16) + "... "
                      : profile.occupation + ","}
                    {profile.location?.length > 10
                      ? profile.location.slice(0, 8) + ".."
                      : profile.location}
                  </div>
                </div>
              </div>
            ))}
        </div>
        :
        !loading &&
        <div className='no-matches-message'>
          No profiles match the selected filter.
        </div>
      }
      <MatchesBottomSheet
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        filter={matchFilter}
        setFilter={(value) => setMatchFilter(value)}
      />
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
  )
}

export default Matches