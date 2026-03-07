import Skeleton from "react-loading-skeleton";
import arrowIcon from "../../assets/icons/chevron-right.svg";
import lockIcon from "../../assets/icons/lock.svg";
import { useState, useRef } from "react";
import { getSections } from "./OtherProfileSections";
import RequestAccessPopup from "../../models/RequestAccessPopup/RequestAccessPopup";

const Info = ({
  profileData,
  horoscopeAccess,
  contactAccess,
  isPremiumUser,
  isLoading,
  profileId,
  partnerPrefRef,
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

  const sections = getSections(profileData, isPremiumUser, horoscopeAccess, contactAccess);

  const [isRequestAccessModalVisible, setIsRequestAccessModalVisible] = useState(false);
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
        data={isPremiumUser ?
          `${profileData.name} has chosen to keep their ${requestedSection === 'horoscope' ? 'horoscope' : 'contact'} details private. You can request access to view this information`
          :
          `Upgrade your plan to see ${profileData?.name?.split(' ')[0]}'s ${requestedSection === 'horoscope' ? 'horoscope' : 'contact'} details`}
        requestType={requestedSection}
        profileId={profileId}
        isPremiumUser={isPremiumUser}
      />
    </div>
  );
};

export default Info;
