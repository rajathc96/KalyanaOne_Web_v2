// import "./PremiumPlanSheet.css";
import check from "../../assets/icons/greenright.svg";

const PremiumPlanSheet = ({ show, onClose }) => {
  const features = [
    ["Send interests / requests", "50 per plan"],
    ["Reply to received interests / requests", true],
    ["View full profile details", true],
    ["View verified contact info (phone/ email)", true],
    ["Chat with premium profiles", true],
    ["Search with advanced search filters", true],
    ["Horoscope compatibility check", true],
    ["Profile boost in search results (coming soon)", true],
    ["See who viewed your profile", true],
    ["Privacy control settings", true],
    ["Personalized daily matches", true],
    ["Priority support*", true],
  ];

  return (
    <div
      className={`right-sheet-backdrop ${show ? "show" : ""}`}
      onClick={onClose}
    >
      <div
        className={`right-sheet-container ${show ? "slide-up" : "slide-down"}`}
        style={{ maxWidth: "400px", width: "100%" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="unlock-title">Premium features of KalyanaOne ✨</h3>
        <ul className="premium-list">
          {features.map(([text, status], idx) => (
            <div className="feature-row" key={idx}>
              <p>{text}</p>
              <span className="feature-status">
                {status === true && <img src={check} alt="check" />}
                {typeof status === "string" && (
                  <span className="feature-limit">{status}</span>
                )}
              </span>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};


export default PremiumPlanSheet;
