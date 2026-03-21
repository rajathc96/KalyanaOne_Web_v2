import Skeleton from "react-loading-skeleton";
import arrowIcon from "../../assets/icons/chevron-right.svg";
import lockIcon from "../../assets/icons/lock.svg";
import { useState } from "react";
import { getSections } from "./OtherProfileSections";
import RequestAccessPopup from "../../models/RequestAccessPopup/RequestAccessPopup";
import InterestAndRequestLimitPopup from "../../models/InterestAndRequestLimitPopup/InterestAndRequestLimitPopup";
import YesNoModal from "../../models/YesNoModal/YesNoModal";

const Info = ({
  profileData,
  horoscopeAccess,
  contactAccess,
  globalData,
  isLoading,
  profileId,
  partnerPrefRef,
  isInterestSent,
  isInterestLoading,
  handleSendInterest,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    about: true,
    "Basic details": true,
    "Caste & Subcaste": true,
    "Education & Career details": true,
    "Personal details": true,
    "Horoscope details": true,
    "Family details": true,
    "Contact details": true,
    "Partner preferences": true,
  });

  const toggleSection = (sectionTitle) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle],
    }));
  };

  const sections = getSections(profileData, horoscopeAccess, contactAccess);

  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);

  const [isRequestAccessModalVisible, setIsRequestAccessModalVisible] = useState(false);
  const [isSendRequestLimitReachedModalVisible, setIsSendRequestLimitReachedModalVisible] = useState(false);
  const [requestedSection, setRequestedSection] = useState(null);

  const handleLockClick = (section) => {
    setRequestedSection(section.title.split(' ')[0].toLowerCase());
    setIsRequestAccessModalVisible(true);
  };

  return (
    <div className={`others-info ${isLoading ? "loading" : ""}`}>
      {isLoading ? (
        <div
          className="loading-skeleton"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "40px",
          }}
        >
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
              }}
            >
              <Skeleton width="20%" height={20} />
              {Array.from({ length: 5 }).map((_, idx1) => (
                <Skeleton height={20} key={idx1} />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <>
          <section className="info-section">
            <div className="section-header">
              <p>About</p>
              <img
                src={arrowIcon}
                alt="arrow"
                className={`arrow-icon ${expandedSections["about"] ? "" : "rotated"
                  }`}
                onClick={() => toggleSection("about")}
              />
            </div>
            {expandedSections["about"] && (
              <p style={{ marginBottom: "16px" }}>
                {profileData.about || "No about information available."}
              </p>
            )}
          </section>

          {sections.map((section, index) => (
            <section
              key={index}
              className="info-section"
              ref={section.title === "Partner preferences" ? partnerPrefRef : null}
              onClick={() => { section.encrypted ? handleLockClick(section) : null }}
            >
              <div
                className="section-header"
                style={{ pointerEvents: section.encrypted ? "none" : "auto" }}
              >
                <p>{section.title}</p>
                <img
                  src={section.encrypted ? lockIcon : arrowIcon}
                  alt={section.encrypted ? "lock" : "arrow"}
                  className={`${section.encrypted ? 'lock-icon' : 'arrow-icon'} ${expandedSections[section.title] ? "" : "rotated"
                    }`}
                  onClick={() => toggleSection(section.title)}
                />
              </div>
              {expandedSections[section.title] && (
                <ul>
                  {section.content.map((item, idx) => (
                    <li
                      style={{
                        display: "flex",
                        gap: "5px",
                        flexDirection: "column",
                      }}
                      key={idx}
                    >
                      <span className="prof-title">{item.label}</span>
                      {Array.isArray(item.value) ?
                        <div className="tag-container">
                          {item.value.map((val, i) => (
                            <span className="tag" key={i}>{val}</span>
                          ))}
                        </div>
                        :
                        (
                          <span className="prof-value">{item.value}</span>
                        )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </>
      )}

      <RequestAccessPopup
        show={isRequestAccessModalVisible}
        onClose={() => setIsRequestAccessModalVisible(false)}
        img={lockIcon}
        heading={`${requestedSection === 'horoscope' ? 'Horoscope' : 'Contact'} is locked`}
        data={isInterestSent ?
          `${profileData.name?.split(' ')[0]} has kept their ${requestedSection === 'horoscope' ? 'horoscope' : 'contact'} details private. You can request access to view it`
          :
          globalData?.interestAndRequestLimit > 0 && globalData?.interestAndRequestSentCount >= globalData?.interestAndRequestLimit ?
            `You have reached your limit for sending interests and requests. Please renew your plan to send more requests.`
            :
            globalData?.isPremiumUser === true ?
              `Send interest to ${profileData.name?.split(' ')[0].toUpperCase()} to view their ${requestedSection} details`
              :
              `Upgrade your plan to view ${profileData?.name?.split(' ')[0]}'s\n${requestedSection === 'horoscope' ? 'horoscope' : 'contact'} details`
        }
        requestType={requestedSection}
        profileId={profileId}
        setIsSendRequestLimitReachedModalVisible={setIsSendRequestLimitReachedModalVisible}
        setIsSuccessPopupVisible={setIsSuccessPopupVisible}
        setIsErrorPopupVisible={setIsErrorPopupVisible}
        setErrorMessage={setErrorMessage}
        showUpgradeButton={globalData?.isPremiumUser !== true}
        isInterestSent={isInterestSent}
        isInterestLoading={isInterestLoading}
        onSendInterest={handleSendInterest}
        renew={globalData?.interestAndRequestLimit > 0 && globalData?.interestAndRequestSentCount >= globalData?.interestAndRequestLimit}
      />

      <InterestAndRequestLimitPopup
        show={isSendRequestLimitReachedModalVisible}
        onClose={() => setIsSendRequestLimitReachedModalVisible(false)}
        type="requests"
      />

      <YesNoModal
        show={isSuccessPopupVisible}
        onClose={() => setIsSuccessPopupVisible(false)}
        heading="Success"
        data={`${requestedSection === 'horoscope' ? 'Horoscope' : 'Contact'} access request sent successfully.`}
        buttonText="Ok"
      />
      <YesNoModal
        show={isErrorPopupVisible}
        onClose={() => setIsErrorPopupVisible(false)}
        data={errorMessage}
        buttonText="Ok"
      />

    </div>
  );
};

export default Info;
