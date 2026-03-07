import { useEffect, useState } from "react";
import "./MatchScoreDetails.css";
import greenTick from "../../assets/icons/greenright.svg"; // Replace with actual path to your green tick icon
import redCross from "../../assets/icons/redcancel.svg";
import herImage from "../../assets/icons/her.svg"; // Replace with actual image path
import yourImage from "../../assets/icons/you.svg";
import { clientAuth } from "../../../firebase";
import Skeleton from "react-loading-skeleton";
import convertHeightToInches from "../../clientFunctions/convertHeightToInches";

const preferenceKeyMap = {
  age: "Age Range",
  height: "Height Range",
  maritalStatus: "Marital Status",
  location: "Location",
  motherTongue: "Language",
  subCaste: "Sub Caste",
  physicalStatus: "Physical Status",
  foodHabit: "Food Habits",
  drinking: "Drinking",
  smoking: "Smoking",
  education: "Education",
  occupation: "Occupation",
  company: "Company",
  workLocation: "Work Location",
  annualIncome: "Annual Income"
};

const MatchScoreDetails = ({ visible, onClose, data, globalData, result, score }) => {
  const [shouldRender, setShouldRender] = useState(visible);
  const [isOtherProfilePhotoLoading, setIsOtherProfilePhotoLoading] = useState(true);
  const [otherProfilePhoto, setOtherProfilePhoto] = useState(data?.profilePic || data?.displayDetails?.profilePic || herImage);
  const [isMyProfilePhotoLoading, setIsMyProfilePhotoLoading] = useState(true);
  const [myProfilePhoto, setMyProfilePhoto] = useState(clientAuth?.currentUser ? clientAuth?.currentUser?.photoURL : yourImage);

  useEffect(() => {
    if (data?.profilePic || data?.displayDetails?.profilePic) {
      setOtherProfilePhoto(data?.profilePic || data?.displayDetails?.profilePic);
    }
  }, [data?.profilePic, data?.displayDetails?.profilePic]);

  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);

      // Delay to allow initial render before adding animation class
      const timer = setTimeout(() => {
        setShouldAnimate(true);
      }, 100); // 10ms is usually enough

      return () => clearTimeout(timer);
    } else
      setShouldAnimate(false);
  }, [visible]);

  if (!shouldRender) return null;

  return (
    <div className={`right-sheet-backdrop ${visible ? (shouldAnimate ? 'show' : '') : ''}`} onClick={onClose}>
      <div
        className={`right-sheet-container ${visible ? (shouldAnimate ? 'slide-up' : '') : 'slide-down'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="match-container">
          <div className="match-header">
            <span className="match-heading">
              {globalData?.basicDetails?.gender === "Male" ? "Her" : "His"} preference
            </span>
            <span className="match-heading">Your match</span>
          </div>
          <hr className="match-divider" style={{ marginBottom: 0 }} />

          <div className="match-data-container">
            {Object.entries(result).map(([key, value], index) => (
              <div className="match-row" key={index}>
                <span className="match-label">
                  {preferenceKeyMap[key]} : {
                    key === "age" ?
                      `${data?.partnerPreference?.ageFrom} - ${data?.partnerPreference?.ageTo} years`
                      :
                      key === "height" ?
                        `${convertHeightToInches(data?.partnerPreference?.heightFrom)} - ${convertHeightToInches(data?.partnerPreference?.heightTo)} in`
                        :
                        Array.isArray(data?.partnerPreference?.[key]) ?
                          data?.partnerPreference?.[key].length ? (data?.partnerPreference?.[key].join(", ")).slice(0, 30) : "Any"
                          :
                          data?.partnerPreference?.[key] || "Any"
                  }
                </span>
                {/* {value === false && <FiXCircle size={22} color="white" fill="red" />}
            {value === true && */}
                <img
                  src={value ? greenTick : redCross}
                  alt={value ? "Matched" : "Not matched"}
                  className="match-icon"
                />
                {/* } */}
              </div>
            ))}
          </div>

          <hr className="match-divider" style={{ marginTop: 2 }} />

          <div className="match-footer">

            <div style={{ width: 60, height: 60, position: "relative" }}>
              {isOtherProfilePhotoLoading && (
                <div
                  style={{
                    position: "absolute",
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    top: 0,
                    left: 0,
                    overflow: "hidden",
                    zIndex: 1,
                  }}
                >
                  <Skeleton
                    circle
                    height={60}
                    width={60}
                    style={{ borderRadius: "50%" }}
                  />
                </div>
              )}
              <img
                className="match-avatar"
                alt="Her"
                onLoadStart={() => setIsOtherProfilePhotoLoading(true)}
                onLoad={() => setIsOtherProfilePhotoLoading(false)}
                onError={() => setOtherProfilePhoto(herImage)}
                src={otherProfilePhoto}
              />
            </div>

            <div className="match-score">
              <p>You are matching</p>
              <div className="score-number">
                <span className="profile-score">{score}</span>
              </div>
              <p>of {globalData?.basicDetails?.gender === "Male" ? "her" : "his"} preference</p>
            </div>

            <div style={{ width: 60, height: 60, position: "relative" }}>
              {isMyProfilePhotoLoading && (
                <div
                  style={{
                    position: "absolute",
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    top: 0,
                    left: 0,
                    overflow: "hidden",
                    zIndex: 1,
                  }}
                >
                  <Skeleton
                    circle
                    height={60}
                    width={60}
                    style={{ borderRadius: "50%" }}
                  />
                </div>
              )}
              <img
                className="match-avatar"
                alt="You"
                onLoadStart={() => setIsMyProfilePhotoLoading(true)}
                onLoad={() => setIsMyProfilePhotoLoading(false)}
                onError={() => setMyProfilePhoto(yourImage)}
                src={myProfilePhoto}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchScoreDetails;
