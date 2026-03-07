import { useContext, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';
import arrowIcon from '../../assets/icons/chevron-right.svg';
import lockIcon from '../../assets/icons/lock.svg';
import { AppContext } from '../../context/AppContext';
import './Info.css';
import { getSections } from './ProfileSections';

const Info = ({ profileData }) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    if (window.innerWidth < 768) {
      navigate(`/settings/${path}`);
    } else {
      navigate("/settings", {
        state: { activePanel: path }
      });
    }
  }

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
    setExpandedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  const { globalData } = useContext(AppContext);

  useEffect(() => {
    if (!profileData) return;
  }, [profileData]);

  const sections = getSections(profileData, globalData);

  return (
    <div className="info">
      {!profileData.basicDetails ?
        <div
          className="loading-skeleton"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '40px'
          }}>
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px'
            }}>
              <Skeleton width="20%" height={20} />
              {Array.from({ length: 5 }).map((_, idx1) => (
                <Skeleton width="100%" height={20} key={idx1} />
              ))}
            </div>
          ))}
        </div>
        :
        <>
          <section className="info-section">
            <div className="section-header" onClick={() => toggleSection('about')}>
              <p>About</p>
              <img
                src={arrowIcon}
                alt="arrow"
                className={`arrow-icon ${expandedSections['about'] ? '' : 'rotated'}`}
              />
            </div>
            {expandedSections['about'] && (
              <p style={{ marginBottom: "16px" }}>
                {profileData.about || "No about information available."}
              </p>
            )}
          </section>
          {sections.map((section, index) => (
            <section key={index} className="info-section">
              <div className="section-header" onClick={() => toggleSection(section.title)}>
                <p>{section.title}</p>
                <img
                  src={section.encrypted ? lockIcon : arrowIcon}
                  alt={section.encrypted ? "lock" : "arrow"}
                  className={`arrow-icon ${expandedSections[section.title] ? '' : 'rotated'}`}
                />
              </div>
              {expandedSections[section.title] && (
                <ul>
                  {section.content.map((item, idx) => (
                    <li style={{ display: "flex", gap: "5px", flexDirection: "column" }} key={idx}>
                      <span className="prof-title">{item.label}</span>
                      {item.value === "N/A" || item.value === "Not specified" ? (
                        <span
                          className="prof-value na-value"
                          onClick={() => {
                            if (section.title === "Partner preferences")
                              handleNavigation('partner-preference')
                            else
                              handleNavigation('edit-profile')
                          }}
                        >
                          Add
                        </span>
                      ) :
                        Array.isArray(item.value) ?
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
      }
    </div>
  );
};

export default Info;
