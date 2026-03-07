import { useContext, useEffect, useState } from "react";
import { ArrowLeft } from "react-feather";
import { useLocation, useNavigate } from "react-router-dom";
import { clientAuth } from "../../../firebase";
import addphotos from "../../assets/icons/addphoto.svg";
import addphotos_dark from "../../assets/icons/addphoto_dark.svg";
import contact from "../../assets/icons/contact_page.svg";
import contact_dark from "../../assets/icons/contact_page_dark.svg";
import rightArrow from "../../assets/icons/editrightarrow.svg";
import rightArrow_dark from "../../assets/icons/editrightarrow_dark.svg";
import partner from "../../assets/icons/group_search.svg";
import partner_dark from "../../assets/icons/group_search_dark.svg";
import privacy from "../../assets/icons/lockedit.svg";
import privacy_dark from "../../assets/icons/lockedit_dark.svg";
import account from "../../assets/icons/manage_accounts.svg";
import account_dark from "../../assets/icons/manage_accounts_dark.svg";
import notification from "../../assets/icons/notifications.svg";
import notification_dark from "../../assets/icons/notifications_dark.svg";
import personedit from "../../assets/icons/person_edit.svg";
import personedit_dark from "../../assets/icons/person_edit_dark.svg";
import help from "../../assets/icons/support_agent.svg";
import help_dark from "../../assets/icons/support_agent_dark.svg";
import userAgreement from "../../assets/icons/userAgreement.svg";
import userAgreement_dark from "../../assets/icons/userAgreement_dark.svg";
import profile from "../../assets/icons/verified_user.svg";
import profile_dark from "../../assets/icons/verified_user_dark.svg";
import getPercentage from "../../clientFunctions/getPercentage";
import { AppContext } from "../../context/AppContext";
import PlanDetailsPopup from "../../models/PlanDetailsPopup/PlanDetailsPopup";
import ProgressBar from "../../models/ProgressBar";
import AccountSettings from "./AccountSettings";
import AddPhotos from "./AddPhotos/AddPhotos";
import ContactDetails from "./ContactDetails";
import EditProfile from "./EditProfile/EditProfile";
import Help from "./Help/Help";
import NotificationSettings from "./NotificationSettings/NotificationSettings";
import PartnerPreference from "./PartnerPreference/PartnerPreference";
import PoliciesAgreement from "./PoliciesAgreement/PoliciesAgreement";
import PrivacySettings from "./PrivacySettings/PrivacySettings";
import ProfileVerification from "./ProfileVerification/ProfileVerification";
import premiumIcon from "../../assets/icons/PremiumIcon.svg";
import verifiedIcon from "../../assets/icons/verified.svg";
import "./Settings.css";

const Settings = () => {
  const { globalData } = useContext(AppContext);
  const location = useLocation();
  const [showPlanDetails, setShowPlanDetails] = useState(false);

  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    if (!globalData) return;
    const { shortlistsData, ...otherData } = globalData;
    const percentage = getPercentage(
      otherData.about,
      otherData.basicDetails,
      otherData.casteDetails,
      otherData.contactDetails,
      otherData.educationCareer,
      otherData.familyDetails,
      otherData.horoscopeDetails,
      otherData.partnerPreference,
      otherData.personalDetails,
      otherData.socialMediaDetails
    );

    let start = 0;
    let end = percentage;
    let duration = 800; // ms
    let increment = end > start ? 1 : -1;
    let stepTime = Math.abs(Math.floor(duration / (end - start || 1)));

    setPercentage(start);

    if (start === end) return;

    let current = start;
    const timer = setInterval(() => {
      current += increment;
      setPercentage(current);
      if (current === end) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [globalData]);

  const sections = [
    { title: "Edit Profile", url: "edit-profile", activeImg: personedit_dark, defaultImg: personedit },
    { title: "Partner preference", url: "partner-preference", activeImg: partner_dark, defaultImg: partner },
    { title: "Add photos", url: "add-photos", activeImg: addphotos_dark, defaultImg: addphotos },
    { title: "Contact details", url: "contact-details", activeImg: contact_dark, defaultImg: contact },
    { title: "Profile verification", url: "profile-verification", activeImg: profile_dark, defaultImg: profile },
    { title: "Privacy settings", url: "privacy-settings", activeImg: privacy_dark, defaultImg: privacy },
    { title: "Notification settings", url: "notification-settings", activeImg: notification_dark, defaultImg: notification },
    { title: "Account settings", url: "account-settings", activeImg: account_dark, defaultImg: account },
    { title: "Help", url: "help", activeImg: help_dark, defaultImg: help },
    { title: "Policies & Agreement", url: "policies-agreement", activeImg: userAgreement_dark, defaultImg: userAgreement },
  ]

  const initialPanel = location.state?.activePanel || "edit-profile";
  const [activePanel, setActivePanel] = useState(initialPanel);

  const renderPanel = () => {
    switch (activePanel) {
      case "edit-profile":
        return <EditProfile />;
      case "partner-preference":
        return <PartnerPreference />;
      case "add-photos":
        return <AddPhotos />;
      case "contact-details":
        return <ContactDetails />;
      case "profile-verification":
        return <ProfileVerification />;
      case "privacy-settings":
        return <PrivacySettings />;
      case "notification-settings":
        return <NotificationSettings />;
      case "account-settings":
        return <AccountSettings />;
      case "help":
        return <Help />;
      case "policies-agreement":
        return <PoliciesAgreement />;
      default:
        return <EditProfile />;
    }
  };

  const navigate = useNavigate();
  const handleClick = (url) => {
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      navigate(`/settings/${url}`);
    } else {
      setActivePanel(url);
    }
  };

  return (
    <>
      <div className="mobile-only">
        <div className="headers-top">
          <ArrowLeft className="back-arrow" onClick={() => navigate(-1)} />
          <p className="header-title">Settings</p>
        </div>
      </div>
      <div className="settings-container">
        <div className="settings-sidebar">
          <div
            className="edit-profile-box"
            // onClick={() => navigate("/settings/plandetails")}
            onClick={() => setShowPlanDetails(true)}
          >
            <img src={clientAuth?.currentUser?.photoURL} alt="Profile" className="edit-profile-img" />
            <div className="user-details">
              <p className="username">{clientAuth?.currentUser?.displayName}
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
            <div className={`${globalData?.isPremiumUser ? "premium-plan" : "free-plan"}`}>
              {globalData?.isPremiumUser ? "Premium" : "Free plan"}
            </div>
          </div>

          <div className="progress-bar-container">
            <ProgressBar percentage={percentage} />
            <p className="progress-text" style={{ marginBottom: "8px" }}>
              Profile is {percentage}% completed
            </p>
          </div>

          <ul className="settings-menu">
            {sections.map((section) => (
              <li
                className={activePanel === section.url ? "active" : ""}
                onClick={() => handleClick(section.url)}
                style={{ display: "flex", alignItems: "center" }}
              >
                <div className="desktop-only">
                  <img
                    src={activePanel === section.url ? section.activeImg : section.defaultImg}
                    alt={section.title}
                    className="settings-menu-icon"
                  />
                </div>
                <div className="mobile-only">
                  <img
                    src={section.activeImg}
                    alt={section.title}
                    className="settings-menu-icon"
                  />
                </div>
                {section.title}
                <img
                  src={activePanel === section.url ? rightArrow_dark : rightArrow}
                  alt="arrow"
                  style={{ marginLeft: "auto" }}
                  className="desktop-only"
                />
                <img
                  src={rightArrow_dark}
                  alt="arrow"
                  style={{ marginLeft: "auto" }}
                  className="mobile-only"
                />
              </li>
            ))}
          </ul>

          {!globalData.isPremiumUser && (
            <button
              className="upgrade-btn"
              onClick={() => navigate("/premium")}
              style={{ marginTop: "5px" }}
            >
              Upgrade to premium
            </button>
          )}
        </div>
        <div className="settings-panel">{renderPanel()}</div>
      </div>
      <PlanDetailsPopup
        show={showPlanDetails}
        onClose={() => setShowPlanDetails(false)}
      />

    </>
  );
};

export default Settings;
