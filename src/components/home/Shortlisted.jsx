import { useContext, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";
import { Image } from "react-skeleton-image";
import API_URL from "../../../config";
import { clientAuth } from "../../../firebase";
import premiumIcon from "../../assets/icons/PremiumIcon.svg";
import verifiedIcon from "../../assets/icons/verified.svg";
import { AppContext } from "../../context/AppContext";
import PremiumInfoPopup from "../../models/PremiumInfoPopup/PremiumInfoPopup";
import VerifiedPopup from "../../models/VerifiedPopup/VerifiedPopup";
import Lists from "./Lists";
import { CalculateScore } from "./NewlyJoined";
import NewlyJoinedSkeleton from "./NewlyJoinedSkeleton";


const Shortlisted = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [isVerifiedPopupVisible, setIsVerifiedPopupVisible] = useState(false);
  const [isPremiumPopupVisible, setIsPremiumPopupVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const { globalData } = useContext(AppContext);
  const [data, setData] = useState(globalData?.shortlistsData || []);

  useEffect(() => {
    if (globalData?.shortlistsData) {
      setData(globalData.shortlistsData);
      setIsLoading(false);
    }
  }, [globalData]);

  const pressOnprofile = (uid) => {
    navigate(`/otherProfile/${uid}`);
  };

  const ua = navigator.userAgent;
  const isMobile = /Mobi|Android/i.test(ua);

  const getUserPreferenceData = async () => {
    if (!data || data.length === 0) return;
    if (!isMobile) {
      try {
        const token = await clientAuth?.currentUser?.getIdToken();
        if (!token) return;

        const res = await fetch(`${API_URL}/api/user/partnerPreference`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ uids: data.map((item) => item.uid) }),
        });
        const datas = await res.json();
        if (res.ok) {
          setData((prev) => {
            const updatedData = prev.map((item) => {
              const preference = datas.find((pref) => pref.uid === item.uid);
              return { ...item, ...preference };
            });
            return updatedData;
          });
        }
      } catch (error) { }
    }
  };

  useEffect(() => {
    getUserPreferenceData();
  }, []);

  if (isLoading) {
    return (
      <>
        {isMobile ?
          <div className="profiles-grid">
            <Skeleton count={10} height={70} style={{ marginTop: 10, borderRadius: 10 }} />
          </div>
          :
          <NewlyJoinedSkeleton />
        }
      </>
    )
  }

  return (
    <>
      {data.length > 0 ?
        <div className="profiles-grid shortlisted">
          {data.map((profile) => (
            <div key={profile.uid} className="profile-card desktop-only">
              <div className="profile-image-container" onClick={() => pressOnprofile(profile.uid)}>
                <Image src={profile.profilePic} className="profile-image" />
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
          {/* </div> */}
          <div className="mobile-only">
            <Lists data={data} />
          </div>
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
        :
        !isLoading &&
        <div className="no-matches-message">
          You have not shortlisted any profiles yet.
        </div>
      }
    </>
  );
};

export default Shortlisted;