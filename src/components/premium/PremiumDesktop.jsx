import { useState } from "react";
import check from "../../assets/icons/greenright.svg";

const PremiumPlanDesktop = ({ selectedPlan, setSelectedPlan }) => {

    const features = [
        ["Send interests", "50 per plan"],
        ["Reply to received interests / requests", true],
        ["View full profile details", true],
        ["View verified contact info (phone/ email)", true],
        ["Chat with premium profiles", true],
        ["Advanced search filters (income, education, horoscope etc.,)", true],
        ["Horoscope compatibility check", true],
        ["Profile boost in search results (coming soon)", true],
        ["See who viewed your profile", true],
        ["Privacy control settings", true],
        ["Personalized daily matches", true],
        ["Priority support*", true],
    ];

    return (
        <div className="free-plan-container">
            {selectedPlan === "free" &&
                <div className="desktop-only">
                    <button
                        className="toggle-btn-premium active-plan-btn premium"
                        style={{ width: '100%' }}
                        onClick={() => setSelectedPlan("premium")}
                    >
                        <span className="toggle-btn-text white-text">
                            Upgrade to Premium Plan
                        </span>
                    </button>
                </div>
            }
            <div className="premium-features">
                {features.map(([text, status], idx) => (
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
            </div>

        </div>
    );
};

export default PremiumPlanDesktop;
