import { useContext } from "react";
import premiumIcon from "../../assets/icons/PremiumIcon.svg";
import { AppContext } from "../../context/AppContext";

const PremiumInfoPopup = ({ name, show, onClose }) => {
    const isSmall = window.innerWidth < 370;
    const { globalData } = useContext(AppContext);

    return (
        <div className={`popup-sheet-backdrop ${show ? 'show' : ''}`} onClick={onClose}>
            <div
                className={`popup-sheet-container ${show ? 'slide-up' : 'slide-down'}`}
                onClick={(e) => e.stopPropagation()}
                style={{ padding: "15px" }}
            >
                <div className="popup-sheet-header">
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        marginTop: '20px',
                        gap: '12px',
                        alignItems: 'center',
                        width: '100%'
                    }}>
                        <img
                            src={premiumIcon}
                            alt="Premium"
                            style={{
                                width: "45px",
                                height: "45px",
                            }}
                        />
                        <p style={{
                            fontSize: '20px',
                            fontWeight: '500',
                        }}>
                            {name === "You" ? "You are a Premium user" : `${name} is a Premium user`}
                        </p>
                        <p style={{
                            color: "#696969",
                            letterSpacing: 0.2,
                            fontSize: isSmall ? '14px' : '16px',
                            textAlign: 'center'
                        }}>
                            Premium profiles have more visibility and trust
                        </p>
                        {!(globalData?.isPremiumUser) && <button
                            className="verify-popup-btn"
                            onClick={() => window.location.href = '/premium'}>
                            Upgrade to Premium now
                        </button>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PremiumInfoPopup;
