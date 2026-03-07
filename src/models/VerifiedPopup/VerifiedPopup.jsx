import { useNavigate } from "react-router-dom";
import verifiedIcon from "../../assets/icons/verified.svg";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

const VerifiedPopup = ({ own = false, show, onClose }) => {
    const navigate = useNavigate();
    const isSmall = window.innerWidth < 370;
    const { globalData } = useContext(AppContext);

    const handleNavigation = (path) => {
        if (window.innerWidth < 768) {
            navigate(`/settings/${path}`);
        } else {
            navigate("/settings", {
                state: { activePanel: path }
            });
        }
    }

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
                            src={verifiedIcon}
                            alt="Verified"
                            style={{
                                width: "45px",
                                height: "45px",
                            }}
                        />
                        <p style={{
                            fontSize: '20px',
                            fontWeight: '500',
                        }}>
                            {own ? "Your profile is verified" : "This profile is verified"}
                        </p>
                        <p style={{
                            color: "#696969",
                            letterSpacing: 0.2,
                            fontSize: isSmall ? '14px' : '16px',
                            textAlign: 'center'
                        }}>
                            Verified profiles have more visibility and trust
                        </p>
                        {!(globalData?.isUserVerified && globalData?.isUserSelfieVerified) && <button
                            className="verify-popup-btn"
                            onClick={() => handleNavigation("profile-verification")}>
                            Verify Your Profile Now
                        </button>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifiedPopup;
