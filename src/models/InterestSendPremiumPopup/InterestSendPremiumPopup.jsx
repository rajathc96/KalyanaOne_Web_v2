import { useContext } from "react";
import giftHeart from "../../assets/emojis/gift-heart.json";
import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const InterestSendPremiumPopup = ({ show, onClose }) => {
    const navigate = useNavigate();
    const { globalData } = useContext(AppContext);
    const isSmall = window.innerWidth < 400;

    return (
        <div className={`popup-sheet-backdrop ${show ? 'show' : ''}`} onClick={onClose}>
            <div
                className={`popup-sheet-container ${show ? 'slide-up' : 'slide-down'}`}
                onClick={(e) => e.stopPropagation()}
                style={{ padding: "20px" }}
            >
                <div className="popup-sheet-header">
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px',
                        alignItems: 'center',
                        width: '100%'
                    }}>
                        <Lottie
                            animationData={giftHeart}
                            loop
                            autoplay
                            style={{ width: 80, height: 80 }}
                        />
                        <p style={{
                            fontSize: '20px',
                            fontWeight: '500',
                        }}>
                            Send Interest with Premium
                        </p>
                        <p style={{
                            color: "#696969",
                            letterSpacing: 0.2,
                            fontSize: isSmall ? '14px' : '16px',
                            textAlign: 'center',
                            marginTop: '-5px'
                        }}>
                            Upgrade to send interests to profiles you like.
                        </p>
                        <button
                            className="upgrade-btn"
                            style={{ margin: "5px 0 0" }}
                            onClick={() => navigate("/premium")}
                        >
                            Upgrade at ₹99 / year
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterestSendPremiumPopup;
