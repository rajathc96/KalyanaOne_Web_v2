import Lottie from "lottie-react";
import bouquet from "../assets/emojis/bouquet.json";
import { useNavigate } from "react-router-dom";

const EarlyAccess = ({
  show,
  onClose,
}) => {
  const isMobile = window.innerWidth < 768;
  const navigate = useNavigate();
  return (
    <div className={`popup-sheet-backdrop ${show ? 'show' : ''}`} onClick={onClose}>
      <div
        className={`popup-sheet-container ${show ? 'slide-up' : 'slide-down'}`}
        style={{
          textAlign: "center",
          gap: "15px",
          minWidth: isMobile ? '90%' : '420px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: '15px' }}>
          <Lottie
            animationData={bouquet}
            loop
            autoplay
            style={{ width: 80, height: 80 }}
          />
        </div>
        <p
          style={{
            textAlign: 'center',
            whiteSpace: 'pre-line',
            lineHeight: 1.3,
            fontSize: '20px',
            fontWeight: '500',
            marginTop: '15px',
            letterSpacing: '-0.5px',
            color: '#FF025B'
          }}
        >
          Early Member Privilege ✨
        </p>
        <p
          className="popup-sheet-text"
          style={{
            fontSize: '20px',
            letterSpacing: '-0.4px',
            color: '#696969',
            marginBottom: '0px'
          }}
        >
          We’re offering early members<br />
          <span style={{ color: '#000', fontWeight: '500' }}>
            Upgrade to premium at ₹99 Only!
          </span>
        </p>
        <ul className="early-list" style={{ letterSpacing: '-0.5px' }}>
          <li>Explore profiles from all communities</li>
          <li>Send 50 interests/requests</li>
          <li>1 Year Validity per plan</li>
        </ul>
        <button className="upgrade-btn"
          style={{ display: 'initial' }}
          onClick={() => navigate("/premium")}
        >
          Buy now at ₹99/year only!
        </button>
      </div>
    </div>
  );
};

export default EarlyAccess;