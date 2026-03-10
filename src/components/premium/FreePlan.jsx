// import './FreePlan.css';
import { useState } from "react";
import check from "../../assets/icons/greenright.svg";
import cross from "../../assets/icons/redcancel.svg";
import PremiumPlanSheet from "../../models/PremiumPlanSheet/PremiumPlanSheet";

const FreePlan = ({ selectedPlan, setSelectedPlan }) => {
  const [showPremiumPlanSheet, setShowPremiumPlanSheet] = useState(false);

  const features = [
    ["Create & complete profile", true],
    ["Send interests", false],
    ["Receive interests", true],
    ["View partial profile details", true],
    ["View verified contact info (phone/email)", false],
    ["Chat with matched profiles", false],
    ["Advanced search filters (income, education, horoscope etc..)", false],
    ["Horoscope compatibility check", false],
    ["Profile boost in search results", false],
    ["See who viewed your profile", false],
    ["Privacy control settings", false],
    ["Personalized daily matches", false],
    ["Priority support*", false],
  ];


  const premiumFeatures = [
    ["Send interests", "Unlimited"],
    ["Reply to received interests / requests", true],
    ["View full profile details", true],
    ["View verified contact info (phone/ email)", true],
    ["Chat with premium profiles", true],
    ["Advanced search filters (income, education, horoscope etc.,)", true],
    ["Horoscope compatibility check", true],
    ["Privacy control settings", true],
    // ["See who viewed your profile", true],
    // ["Profile boost in search results (coming soon)", true],
    // ["Personalized daily matches", true],
    // ["Priority support*", true],
  ];


  return (
    // <div className="free-plan-container" style={{ height: window.innerHeight - (window.innerWidth > 600 ? 90 : 50) }}>
    <div className="free-plan-container-border">
      {selectedPlan === "free" &&
        <div className="desktop-only">
          <button
            style={{ width: '75%' }}
            className="toggle-btn active-plan-btn free"
          >
            Free Plan (Current Plan)
          </button>
        </div>
      }
      <div className="free-plan-container">
        {selectedPlan === "premium" &&
          <div style={{ marginBottom: "20px", marginTop: "50px" }}>
            <h3 className="unlock-title" style={{ marginBottom: "10px" }}>
              Unlock all features of KalyanaOne ✨
            </h3>
            <p className="includes-text">Includes all Free plan features +</p>
          </div>
        }
        {/* <div style={{ marginTop: "10px" }}> */}
        {(selectedPlan === "free" ? features : premiumFeatures).map(([text, status], idx) => (
          <div className="feature-row" key={idx}>
            <p className="feature-text">{text}</p>
            <span className="feature-status">
              {status === true && <img src={check} alt="check" />}
              {status === false && <img src={cross} alt="cross" />}
              {typeof status === "string" && (
                <span className="feature-limit">{status}</span>
              )}
            </span>
          </div>
        ))}
        {/* </div> */}
        <div className="mobile-only">
          <button className="unlock-premium-button">
            <span className="gradient-text" onClick={() => setSelectedPlan("premium")}>Unlock premium features✨</span>
          </button>
        </div>
        {selectedPlan === "premium" &&
          <div className="desktop-only" style={{ marginTop: "20px" }}>
            <p className="see-more" onClick={() => setShowPremiumPlanSheet(true)}>see more features</p>
          </div>
        }
        <PremiumPlanSheet show={showPremiumPlanSheet} onClose={() => setShowPremiumPlanSheet(false)} />
      </div>
    </div>
  );
};

export default FreePlan;
