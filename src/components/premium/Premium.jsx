import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import PremiumPlanSheet from "../../models/PremiumPlanSheet/PremiumPlanSheet";
import FreePlan from "./FreePlan";
import "./Premium.css";
import PremiumPlan from "./PremiumPlan";
import PremiumPlanDesktop from "./PremiumDesktop";
// import backIcon from "../../assets/icons/back.svg";

const Premium = () => {
  const { globalData } = useContext(AppContext);
  const [selectedPlan, setSelectedPlan] = useState("premium");
  const [showPremiumPlanSheet, setShowPremiumPlanSheet] = useState(false);

  return (
    <div className="premium-container">
      <div className="premium-container">
        {/* <div className="premium-container-back-button">
          <ArrowLeft className="back-arrow" onClick={() => navigate(-1)} />
          <p>Subscribe</p>
        </div> */}
        <div className={`premium-header ${selectedPlan === "premium" ? "" : "show"}`}>
          <button
            className={`toggle-btn ${selectedPlan === "free" ? "active-plan-btn free" : ""}`}
            onClick={() => setSelectedPlan("free")}
          >
            Free Plan
          </button>
          <button
            className={`toggle-btn-premium ${selectedPlan === "premium" ? "active-plan-btn premium" : ""}`}
            onClick={() => setSelectedPlan("premium")}
          >
            <span
              className={`toggle-btn-text ${selectedPlan === "premium" ? "white-text" : "gradient-text"
                }`}
            >
              Premium plan
            </span>
          </button>
        </div>

        <div className="mobile-only" style={{ marginTop: "12px" }}>
          {selectedPlan === "free" ?
            <FreePlan setSelectedPlan={setSelectedPlan} selectedPlan={selectedPlan} /> :
            <PremiumPlan
              setShowPremiumPlanSheet={setShowPremiumPlanSheet}
              globalData={globalData}
            />
          }
        </div>

        <div className="desktop-only">
          <div className="plan-details">
            <FreePlan setSelectedPlan={setSelectedPlan} selectedPlan={selectedPlan} />
            {selectedPlan === "free" ?
              <PremiumPlanDesktop
                setSelectedPlan={setSelectedPlan}
                selectedPlan={selectedPlan}
              /> :
              <PremiumPlan
                setShowPremiumPlanSheet={setShowPremiumPlanSheet}
                globalData={globalData}
              />
            }
          </div>
        </div>
      </div>{" "}
      <PremiumPlanSheet show={showPremiumPlanSheet} onClose={() => setShowPremiumPlanSheet(false)} />
    </div>
  );
};

export default Premium;
